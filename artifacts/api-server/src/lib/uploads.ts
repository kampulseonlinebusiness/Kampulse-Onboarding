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
};

export function ensureUploadDirs(): void {
  const dirs = [
    "passport", "cv", "certificates", "ids", "proof_of_address",
    "medical", "guarantor", "generated-pdf"
  ];
  for (const dir of dirs) {
    const full = path.join(UPLOAD_BASE, dir);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
    }
  }
}

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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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
