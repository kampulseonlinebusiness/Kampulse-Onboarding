import { Router, type IRouter } from "express";
import express from "express";
import { db } from "@workspace/db";
import { applicationsTable, documentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  createUploader,
  validateFileMagicBytes,
  makeStorageKey,
} from "../lib/uploads";
import { uploadFile, deleteFile, ensureUploadDirs, UPLOAD_BASE } from "../lib/storage";
import multer from "multer";

ensureUploadDirs();

const router: IRouter = Router();

const VALID_FILE_TYPES = [
  "passport", "cv", "certificate", "id", "proof_of_address",
  "medical", "guarantor_passport", "guarantor_id",
];

// Serve uploaded files statically (local dev fallback; R2 files are served
// directly from the CDN so this is only hit in non-R2 environments).
router.use("/uploads/files", express.static(UPLOAD_BASE, { fallthrough: false }));

// ── POST /uploads/:token — upload a document for an application ───────────────
router.post("/uploads/:token", async (req, res): Promise<void> => {
  const { token } = req.params;
  const rawFileType = req.query["fileType"];
  const fileType = Array.isArray(rawFileType) ? rawFileType[0] : rawFileType;

  if (!fileType || !VALID_FILE_TYPES.includes(fileType as string)) {
    res.status(400).json({ error: "Invalid or missing fileType query parameter" });
    return;
  }

  // Verify application token
  const [application] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.token, token));

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  const uploader = createUploader(fileType as string);
  const upload = uploader.single("file");

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err) {
      res.status(400).json({ error: String(err) });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    // ── Magic-bytes validation (buffer-based) ─────────────────────────────────
    const magicError = validateFileMagicBytes(req.file.buffer, fileType as string);
    if (magicError) {
      res.status(400).json({ error: magicError });
      return;
    }

    // ── Upload to storage (R2 or local disk) ──────────────────────────────────
    const key = makeStorageKey(fileType as string, req.file.originalname);
    const fileUrl = await uploadFile(req.file.buffer, key, req.file.mimetype);

    // ── Remove old document of same type ──────────────────────────────────────
    const existing = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.applicationId, application.id));

    const old = existing.find(d => d.fileType === fileType);
    if (old) {
      await deleteFile(old.filePath); // handles both keys and legacy disk paths
      await db.delete(documentsTable).where(eq(documentsTable.id, old.id));
    }

    // ── Save document record ──────────────────────────────────────────────────
    await db.insert(documentsTable).values({
      applicationId: application.id,
      fileType: fileType as string,
      fileName: req.file.originalname,
      filePath: key,   // storage key (not a disk path)
      fileUrl,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    req.log.info({ applicationId: application.id, fileType }, "Document uploaded");
    res.json({
      fileType,
      filePath: key,
      fileName: req.file.originalname,
      fileUrl,
    });
  });
});

export default router;
