/**
 * Pluggable file storage.
 *
 * When the three CLOUDFLARE_R2_* env vars are present the file is uploaded
 * to Cloudflare R2 (S3-compatible). Otherwise it falls back to local disk so
 * the dev environment on Replit continues to work without any extra config.
 *
 * Callers store the returned `key` in the DB `filePath` column and the
 * returned `url` in the `fileUrl` column.  Deletion accepts either a key
 * or a legacy absolute disk path — both are handled transparently.
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

export const UPLOAD_BASE = path.resolve(process.cwd(), "uploads");

// ── R2 client (lazy, returns null when not configured) ────────────────────────

function makeR2Client(): S3Client | null {
  const accountId  = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKey  = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretKey  = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKey || !secretKey) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
}

const bucket     = () => process.env.CLOUDFLARE_R2_BUCKET ?? "";
const publicBase = () =>
  (process.env.CLOUDFLARE_R2_PUBLIC_URL ?? "").replace(/\/$/, "");

/** Returns true when R2 env vars are fully configured. */
export function isR2Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET &&
    process.env.CLOUDFLARE_R2_PUBLIC_URL
  );
}

// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Upload a Buffer to storage.
 *
 * @param buffer    File contents
 * @param key       Storage key, e.g. "passport/abc123.pdf"
 * @param mimeType  MIME type string, e.g. "image/jpeg"
 * @returns         Public URL to access the file
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  mimeType: string,
): Promise<string> {
  const client = makeR2Client();

  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket(),
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
    return `${publicBase()}/${key}`;
  }

  // ── Local disk fallback ───────────────────────────────────────────────────
  const dest = path.join(UPLOAD_BASE, key);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buffer);
  return `/api/uploads/files/${key}`;
}

// ── Delete ────────────────────────────────────────────────────────────────────

/**
 * Delete a file from storage.
 *
 * Accepts:
 *  - A storage key            ("passport/abc123.pdf")
 *  - A local API URL          ("/api/uploads/files/passport/abc123.pdf")
 *  - A legacy absolute path   ("/home/runner/workspace/uploads/passport/abc123.pdf")
 */
export async function deleteFile(keyOrUrl: string): Promise<void> {
  if (!keyOrUrl) return;

  // Normalise to a storage key
  let key = keyOrUrl;
  if (key.startsWith("/api/uploads/files/")) {
    key = key.replace("/api/uploads/files/", "");
  } else if (path.isAbsolute(key)) {
    // Legacy absolute disk path — derive key relative to UPLOAD_BASE
    key = path.relative(UPLOAD_BASE, key).replace(/\\/g, "/");
  }

  const client = makeR2Client();
  if (client) {
    try {
      await client.send(
        new DeleteObjectCommand({ Bucket: bucket(), Key: key }),
      );
    } catch {
      /* ignore — file may already be gone */
    }
    return;
  }

  // Local disk fallback
  const fullPath = path.join(UPLOAD_BASE, key);
  try {
    fs.unlinkSync(fullPath);
  } catch {
    /* ignore */
  }
}

// ── Local dir bootstrap (no-op when R2 is active) ─────────────────────────────

export function ensureUploadDirs(): void {
  if (isR2Configured()) return; // nothing to create on cloud storage
  const dirs = [
    "passport", "cv", "certificates", "ids", "proof_of_address",
    "medical", "guarantor", "generated-pdf", "job-photos",
  ];
  for (const dir of dirs) {
    const full = path.join(UPLOAD_BASE, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  }
}
