import { Router, type IRouter } from "express";
import express from "express";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { applicationsTable, documentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createUploader, getFileUrl, ensureUploadDirs } from "../lib/uploads";
import { logger } from "../lib/logger";
import multer from "multer";

ensureUploadDirs();

const router: IRouter = Router();

const UPLOAD_BASE = path.resolve(process.cwd(), "uploads");

const VALID_FILE_TYPES = [
  "passport", "cv", "certificate", "id", "proof_of_address",
  "medical", "guarantor_passport", "guarantor_id",
];

// Serve uploaded files statically.
// express.static handles path traversal protection and correct MIME types.
// Must be registered before the admin router's global requireAuth middleware.
router.use("/uploads/files", express.static(UPLOAD_BASE, { fallthrough: false }));

// Upload document
router.post("/uploads/:token", async (req, res): Promise<void> => {
  const { token } = req.params;
  const rawFileType = req.query["fileType"];
  const fileType = Array.isArray(rawFileType) ? rawFileType[0] : rawFileType;

  if (!fileType || !VALID_FILE_TYPES.includes(fileType as string)) {
    res.status(400).json({ error: "Invalid or missing fileType query parameter" });
    return;
  }

  // Verify application token
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.token, token));
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

    const fileUrl = getFileUrl(req.file.path);

    // Remove old document of same type
    const existing = await db.select().from(documentsTable)
      .where(eq(documentsTable.applicationId, application.id));
    const old = existing.find(d => d.fileType === fileType);
    if (old) {
      try { fs.unlinkSync(old.filePath); } catch { /* ignore */ }
      await db.delete(documentsTable).where(eq(documentsTable.id, old.id));
    }

    // Save document record
    await db.insert(documentsTable).values({
      applicationId: application.id,
      fileType: fileType as string,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileUrl,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    req.log.info({ applicationId: application.id, fileType }, "Document uploaded");
    res.json({
      fileType,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileUrl,
    });
  });
});

export default router;
