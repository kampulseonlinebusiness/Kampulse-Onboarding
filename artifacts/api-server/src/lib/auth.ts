import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "kampulse-secret-key-change-in-production";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "kampulse-refresh-secret-change-in-production";

export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";
/** Milliseconds — must match REFRESH_TOKEN_EXPIRY above. */
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function signRefreshToken(payload: JwtPayload): string {
  // Include a random jti (JWT ID) so that two tokens issued within the same
  // second for the same user are always distinct. Without this, identical iat
  // values would produce identical token strings and break rotation logic.
  const jti = crypto.randomBytes(16).toString("hex");
  return jwt.sign({ ...payload, jti }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Returns the SHA-256 hex digest of a refresh token string.
 * We store only the hash so the raw token is never persisted — if the DB is
 * compromised, stolen hashes cannot be used directly.
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
