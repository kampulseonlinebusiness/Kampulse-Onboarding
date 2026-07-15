/**
 * Multer configuration + magic-bytes validation.
 *
 * All uploaders now use memoryStorage so the file buffer is available in
 * req.file.buffer immediately — no temp file is written.  Actual persistence
 * is handled by the storage module (R2 or local disk).
 */

import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

// ── Directory → sub-path mapping ─────────────────────────────────────────────

export const FILE_TYPE_DIRS: Record<string, string> = {
  passport:           "passport",
  cv:                 "cv",
  certificate:        "certificates",
  id:                 "ids",
  proof_of_address:   "proof_of_address",
  medical:            "medical",
  guarantor_passport: "guarantor",
  guarantor_id:       "guarantor",
  generated_pdf:      "generated-pdf",
  job_photo:          "job-photos",
};

/** Generate a unique storage key for the given file type. */
export function makeStorageKey(fileType: string, originalName: string): string {
  const dir = FILE_TYPE_DIRS[fileType] ?? "misc";
  const ext = path.extname(originalName);
  return `${dir}/${randomUUID()}${ext}`;
}

// ── Magic-bytes validation (Buffer-based) ─────────────────────────────────────

type AllowedMimeGroup = "image" | "document";

/** Detect MIME type from the first 12 bytes of a Buffer. Returns null if unrecognised. */
export function detectMimeFromBuffer(buf: Buffer): string | null {
  if (buf.length < 4) return null;

  // PDF: %PDF  (25 50 44 46)
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46)
    return "application/pdf";

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "image/jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  )
    return "image/png";

  // WebP: RIFF....WEBP
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  )
    return "image/webp";

  return null;
}

const IMAGE_ONLY_FILE_TYPES = new Set(["passport", "guarantor_passport"]);

const ALLOWED_MIME_BY_GROUP: Record<AllowedMimeGroup, string[]> = {
  image:    ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf", "image/jpeg", "image/png"],
};

/**
 * Validate the magic bytes of an in-memory Buffer against the allowed types
 * for the given fileType category.
 *
 * @returns null on success, or an error message string on failure.
 */
export function validateFileMagicBytes(buffer: Buffer, fileType: string): string | null {
  const detected = detectMimeFromBuffer(buffer);

  if (!detected) {
    return "File type could not be verified — only PDF, JPEG, PNG, and WebP are accepted.";
  }

  const group: AllowedMimeGroup = IMAGE_ONLY_FILE_TYPES.has(fileType) ? "image" : "document";
  const allowed = ALLOWED_MIME_BY_GROUP[group];

  if (!allowed.includes(detected)) {
    const label = group === "image"
      ? "JPEG, PNG, or WebP image"
      : "PDF, JPEG, or PNG file";
    return `Invalid file content. Expected a ${label} but the file appears to be something else.`;
  }

  return null;
}

// ── Multer instances (memory storage) ─────────────────────────────────────────

const IMAGE_ONLY_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const DOCUMENT_MIMES   = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

/** Multer uploader for job cover photos. */
export function createImageUploader(_subDir: string) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
      IMAGE_ONLY_MIMES.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    },
  });
}

/** Multer uploader for application documents. */
export function createUploader(_fileType: string) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
      DOCUMENT_MIMES.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only PDF, PNG, JPG, and JPEG files are allowed"));
    },
  });
}

// ── Backward-compat shims ─────────────────────────────────────────────────────
// These are no-ops when using cloud storage but kept so existing call sites
// that haven't been updated yet don't break at compile time.

export function ensureUploadDirs(): void {
  // Delegated to storage.ts — kept here for import compat.
}

export function getFileUrl(_filePath: string): string {
  // Legacy shim — new code uses uploadFile() from storage.ts directly.
  return "";
}
