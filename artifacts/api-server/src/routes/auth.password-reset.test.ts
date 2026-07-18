/**
 * Integration tests for the forgot-password / reset-password flow.
 *
 * The email transport is mocked — no real SMTP connection is required.
 * Tests run against the real database so token lifecycle is verified end-to-end.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import crypto from "crypto";
import app from "../app.js";
import { db } from "@workspace/db";
import {
  usersTable,
  passwordResetTokensTable,
} from "@workspace/db";
import { hashPassword, comparePassword } from "../lib/auth.js";
import { eq } from "drizzle-orm";

// ── Mock the email module so no real SMTP call is made ────────────────────────
vi.mock("../lib/email.js", () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
  sendApplicationSubmittedEmail: vi.fn().mockResolvedValue(undefined),
  sendStatusUpdateEmail: vi.fn().mockResolvedValue(undefined),
}));

// Import after mocking so we can inspect calls in assertions.
const { sendPasswordResetEmail } = await import("../lib/email.js");

// ── Test fixtures ─────────────────────────────────────────────────────────────

const TEST_EMAIL = `test-reset-${Date.now()}@kampulse-test.invalid`;
const TEST_NAME = "Reset Test User";
const INITIAL_PASSWORD = "Initial@Password1";

let testUserId: number;

beforeAll(async () => {
  const passwordHash = await hashPassword(INITIAL_PASSWORD);
  const [user] = await db
    .insert(usersTable)
    .values({ email: TEST_EMAIL, name: TEST_NAME, passwordHash, role: "admin" })
    .returning();
  testUserId = user.id;
});

afterAll(async () => {
  // Remove all tokens and the user created for this test suite.
  await db
    .delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.userId, testUserId));
  await db.delete(usersTable).where(eq(usersTable.id, testUserId));
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/auth/forgot-password", () => {
  it("creates a reset token in the database for a registered email", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: TEST_EMAIL });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/reset link has been sent/i);

    // The token row must now exist in the DB.
    const [tokenRow] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.userId, testUserId));

    expect(tokenRow).toBeDefined();
    expect(tokenRow.token).toHaveLength(64); // 32 random bytes → 64 hex chars
    expect(tokenRow.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // The email helper must have been called exactly once.
    expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      TEST_EMAIL,
      TEST_NAME,
      tokenRow.token,
    );
  });

  it("returns 200 for an unregistered email without revealing whether it exists", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@doesnotexist.invalid" });

    expect(res.status).toBe(200);
    // Response must be identical to the success message — no enumeration leak.
    expect(res.body.message).toMatch(/reset link has been sent/i);
  });
});

describe("POST /api/auth/reset-password", () => {
  it("updates the password and removes the token when a valid token is submitted", async () => {
    // Ensure a fresh token exists for our test user.
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.userId, testUserId));

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await db
      .insert(passwordResetTokensTable)
      .values({ userId: testUserId, token, expiresAt });

    const newPassword = "NewSecure@Password99";
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, newPassword });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/password reset successfully/i);

    // Password must have been updated in the DB.
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, testUserId));
    const passwordChanged = await comparePassword(newPassword, user.passwordHash);
    expect(passwordChanged).toBe(true);

    // The token must have been deleted (single-use).
    const [remaining] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.userId, testUserId));
    expect(remaining).toBeUndefined();
  });

  it("rejects an expired token with a clear error", async () => {
    // Insert a token whose expiry is in the past.
    const expiredToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() - 1000); // 1 second ago
    await db
      .insert(passwordResetTokensTable)
      .values({ userId: testUserId, token: expiredToken, expiresAt });

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: expiredToken, newPassword: "AnyPassword@1" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid or has expired/i);

    // Cleanup the expired row.
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.userId, testUserId));
  });
});
