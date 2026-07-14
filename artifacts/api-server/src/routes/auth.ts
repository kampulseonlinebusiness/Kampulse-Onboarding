import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  AdminLoginBody,
  RefreshTokenBody,
  CreateAdminUserBody,
} from "@workspace/api-zod";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
} from "../lib/auth";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

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
  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post("/auth/refresh", async (req, res): Promise<void> => {
  const parsed = RefreshTokenBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Refresh token required" });
    return;
  }
  try {
    const payload = verifyRefreshToken(parsed.data.refreshToken);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.id));
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const newPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
    res.json({
      accessToken: signAccessToken(newPayload),
      refreshToken: signRefreshToken(newPayload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
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
