import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const UPLOAD_BASE = path.resolve(process.cwd(), "uploads");

const FILE_TYPE_DIRS: Record<string, string> = {
  passport: "passport",
  cv: "cv",
  certificate: "certificates",
  id: "ids",
  proof_of_address: "proof_of_address",
  medical: "medical",
  guarantor_passport: "guarantor",
  guarantor_id: "guarantor",
  generated_pdf: "generated-pdf",
  job_photo: "job-photos",
};

export function ensureUploadDirs(): void {
  const dirs = [
    "passport", "cv", "certificates", "ids", "proof_of_address",
    "medical", "guarantor", "generated-pdf", "job-photos"
  ];
  for (const dir of dirs) {
    const full = path.join(UPLOAD_BASE, dir);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
    }
  }
}

// ── Magic-bytes validation ────────────────────────────────────────────────────
// Read the first 12 bytes of a file and compare against known file signatures.
// This prevents a renamed malicious file (e.g. evil.exe → report.pdf) from
// slipping through on the basis of its extension or Content-Type header alone.

type AllowedMimeGroup = "image" | "document";

/** Returns the detected MIME type from magic bytes, or null if unrecognised. */
export function detectMimeFromMagicBytes(filePath: string): string | null {
  let buf: Buffer;
  try {
    // Read only the first 12 bytes — sufficient for all signatures we check.
    const fd = fs.openSync(filePath, "r");
    buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    fs.closeSync(fd);
  } catch {
    return null;
  }

  // PDF: %PDF  (25 50 44 46)
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
    return "application/pdf";
  }

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP  (52 49 46 46 ?? ?? ?? ?? 57 45 42 50)
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

const ALLOWED_MIME_BY_GROUP: Record<AllowedMimeGroup, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf", "image/jpeg", "image/png"],
};

// File types that only accept images (no PDFs).
const IMAGE_ONLY_FILE_TYPES = new Set(["passport", "guarantor_passport"]);

/**
 * Validates the magic bytes of an already-written file against the allowed
 * MIME types for the given fileType category.
 *
 * @returns null on success, or an error message string on failure.
 */
export function validateFileMagicBytes(filePath: string, fileType: string): string | null {
  const detected = detectMimeFromMagicBytes(filePath);

  if (!detected) {
    return "File type could not be verified — only PDF, JPEG, PNG, and WebP are accepted.";
  }

  const group: AllowedMimeGroup = IMAGE_ONLY_FILE_TYPES.has(fileType) ? "image" : "document";
  const allowed = ALLOWED_MIME_BY_GROUP[group];

  if (!allowed.includes(detected)) {
    const labels = group === "image"
      ? "JPEG, PNG, or WebP image"
      : "PDF, JPEG, or PNG file";
    return `Invalid file content. Expected a ${labels} but the file appears to be something else.`;
  }

  return null;
}

// ── Image uploader (job photos) ───────────────────────────────────────────────

const IMAGE_ONLY_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function createImageUploader(subDir: string) {
  const destDir = path.join(UPLOAD_BASE, subDir);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
      if (IMAGE_ONLY_MIMES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
      }
    },
  });
}

// ── Document uploader (application files) ────────────────────────────────────

export function getUploadDir(fileType: string): string {
  const dir = FILE_TYPE_DIRS[fileType] ?? "misc";
  const full = path.join(UPLOAD_BASE, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  return full;
}

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export function createUploader(fileType: string) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, getUploadDir(fileType));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIMES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only PDF, PNG, JPG, and JPEG files are allowed"));
      }
    },
  });
}

export function getFileUrl(filePath: string): string {
  const relative = path.relative(UPLOAD_BASE, filePath);
  return `/api/uploads/files/${relative.replace(/\\/g, "/")}`;
}
