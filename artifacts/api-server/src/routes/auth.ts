import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, passwordResetTokensTable, refreshTokensTable } from "@workspace/db";
import { eq, and, gt, lt } from "drizzle-orm";
import crypto from "crypto";
import {
  AdminLoginBody,
  RefreshTokenBody,
  CreateAdminUserBody,
  ChangePasswordBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "@workspace/api-zod";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
  hashRefreshToken,
  REFRESH_TOKEN_EXPIRY_MS,
} from "../lib/auth";
import { requireAuth } from "../middlewares/requireAuth";
import { sendPasswordResetEmail } from "../lib/email";

const router: IRouter = Router();

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Removes expired refresh token rows — runs opportunistically on auth calls. */
async function pruneExpiredRefreshTokens(): Promise<void> {
  await db
    .delete(refreshTokensTable)
    .where(lt(refreshTokensTable.expiresAt, new Date()));
}

/** Stores a hashed refresh token in the DB for the given user. */
async function storeRefreshToken(userId: number, token: string): Promise<void> {
  const tokenHash = hashRefreshToken(token);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  await db.insert(refreshTokensTable).values({ userId, tokenHash, expiresAt });
}

// ── Routes ────────────────────────────────────────────────────────────────────

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persist the refresh token hash so it can be revoked later.
  await storeRefreshToken(user.id, refreshToken);
  // Opportunistically clean up expired rows.
  pruneExpiredRefreshTokens().catch(() => { /* non-critical */ });

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post("/auth/refresh", async (req, res): Promise<void> => {
  const parsed = RefreshTokenBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Refresh token required" });
    return;
  }

  const { refreshToken } = parsed.data;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  // Validate the token exists in the DB (not revoked).
  const tokenHash = hashRefreshToken(refreshToken);
  const [stored] = await db
    .select()
    .from(refreshTokensTable)
    .where(
      and(
        eq(refreshTokensTable.tokenHash, tokenHash),
        gt(refreshTokensTable.expiresAt, new Date()),
      ),
    );

  if (!stored) {
    res.status(401).json({ error: "Refresh token has been revoked or expired" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.id));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const newPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  // Token rotation: delete the used token and issue a fresh one.
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.id, stored.id));
  await storeRefreshToken(user.id, newRefreshToken);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  // Accept the refresh token and revoke it immediately.
  const parsed = RefreshTokenBody.safeParse(req.body);
  if (parsed.success) {
    const tokenHash = hashRefreshToken(parsed.data.refreshToken);
    await db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash));
  }
  // Always return 200 — the client should discard its tokens regardless.
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

router.post("/auth/change-password", requireAuth, async (req, res): Promise<void> => {
  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }

  const newHash = await hashPassword(newPassword);
  await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, user.id));

  // Revoke ALL refresh tokens for this user — all sessions are invalidated.
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.userId, user.id));

  res.json({ message: "Password changed successfully" });
});

router.post("/auth/forgot-password", async (req, res): Promise<void> => {
  const parsed = ForgotPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email } = parsed.data;

  // Always return 200 to avoid revealing which emails are registered.
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.json({ message: "If that email is registered, a reset link has been sent." });
    return;
  }

  // Invalidate any existing reset tokens for this user.
  await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.userId, user.id));

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(passwordResetTokensTable).values({ userId: user.id, token, expiresAt });
  await sendPasswordResetEmail(user.email, user.name, token);

  res.json({ message: "If that email is registered, a reset link has been sent." });
});

router.post("/auth/reset-password", async (req, res): Promise<void> => {
  const parsed = ResetPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { token, newPassword } = parsed.data;

  const [resetRecord] = await db
    .select()
    .from(passwordResetTokensTable)
    .where(
      and(
        eq(passwordResetTokensTable.token, token),
        gt(passwordResetTokensTable.expiresAt, new Date()),
      ),
    );

  if (!resetRecord) {
    res.status(400).json({ error: "This reset link is invalid or has expired. Please request a new one." });
    return;
  }

  const newHash = await hashPassword(newPassword);
  await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, resetRecord.userId));
  await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.id, resetRecord.id));

  // Revoke all existing refresh tokens so old sessions can't persist after a reset.
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.userId, resetRecord.userId));

  res.json({ message: "Password reset successfully. You can now sign in with your new password." });
});

router.post("/admin/users", requireAuth, async (req, res): Promise<void> => {
  if (req.user?.role !== "super_admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const parsed = CreateAdminUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, name, password, role } = parsed.data;
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }
  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({ email, name, passwordHash, role }).returning();
  res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

export default router;
