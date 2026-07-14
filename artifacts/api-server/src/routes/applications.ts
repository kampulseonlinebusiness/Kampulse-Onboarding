import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable, documentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  StartApplicationBody,
  ResumeApplicationParams,
  SavePersonalInfoParams,
  SavePersonalInfoBody,
  SaveGuarantorInfoParams,
  SaveGuarantorInfoBody,
  SaveAgreementParams,
  SaveAgreementBody,
  SubmitApplicationParams,
} from "@workspace/api-zod";
import { sendApplicationSubmittedEmail } from "../lib/email";

const router: IRouter = Router();

function buildApplicationResume(app: typeof applicationsTable.$inferSelect & { jobTitle: string }, docs: typeof documentsTable.$inferSelect[]) {
  return {
    id: app.id,
    token: app.token,
    status: app.status,
    currentStep: app.currentStep,
    jobId: app.jobId,
    jobTitle: app.jobTitle,
    applicationSource: app.applicationSource,
    expectedStartDate: app.expectedStartDate,
    coverLetter: app.coverLetter,
    personalInfo: {
      fullName: app.fullName,
      dateOfBirth: app.dateOfBirth,
      gender: app.gender,
      nationality: app.nationality,
      stateOfOrigin: app.stateOfOrigin,
      lga: app.lga,
      maritalStatus: app.maritalStatus,
      address: app.address,
      phone: app.phone,
      email: app.email,
      nextOfKinName: app.nextOfKinName,
      nextOfKinRelationship: app.nextOfKinRelationship,
      nextOfKinPhone: app.nextOfKinPhone,
      nextOfKinAddress: app.nextOfKinAddress,
      emergencyContactName: app.emergencyContactName,
      emergencyContactRelationship: app.emergencyContactRelationship,
      emergencyContactPhone: app.emergencyContactPhone,
      emergencyContactAddress: app.emergencyContactAddress,
    },
    documents: docs.map(d => ({
      id: d.id,
      fileType: d.fileType,
      fileName: d.fileName,
      filePath: d.filePath,
      fileUrl: d.fileUrl,
      uploadedAt: d.createdAt,
    })),
    guarantorInfo: {
      guarantorFullName: app.guarantorFullName,
      guarantorAddress: app.guarantorAddress,
      guarantorOccupation: app.guarantorOccupation,
      guarantorPlaceOfWork: app.guarantorPlaceOfWork,
      guarantorPhone: app.guarantorPhone,
      guarantorEmail: app.guarantorEmail,
      guarantorRelationship: app.guarantorRelationship,
      guarantorYearsKnown: app.guarantorYearsKnown,
      guarantorIdType: app.guarantorIdType,
      guarantorIdNumber: app.guarantorIdNumber,
      guarantorIdIssueDate: app.guarantorIdIssueDate,
      guarantorIdExpiryDate: app.guarantorIdExpiryDate,
      witnessName: app.witnessName,
      witnessAddress: app.witnessAddress,
      witnessPhone: app.witnessPhone,
      declarationAccepted: app.declarationAccepted,
    },
    agreementAccepted: app.agreedToTerms,
    agreementSignedAt: app.agreementSignedAt?.toISOString() ?? null,
    createdAt: app.createdAt,
  };
}

// POST /applications — start application (step 1)
router.post("/applications", async (req, res): Promise<void> => {
  const parsed = StartApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { jobId, expectedStartDate, applicationSource, coverLetter } = parsed.data;

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
  if (!job) {
    res.status(400).json({ error: "Job not found" });
    return;
  }

  const token = randomUUID();
  const [application] = await db.insert(applicationsTable).values({
    token,
    jobId,
    expectedStartDate,
    applicationSource,
    coverLetter,
    currentStep: 1,
    status: "draft",
  }).returning();

  res.status(201).json({
    id: application.id,
    token: application.token,
    resumeUrl: `/apply/${application.token}`,
  });
});

// GET /applications/resume/:token
router.get("/applications/resume/:token", async (req, res): Promise<void> => {
  const params = ResumeApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const { token } = params.data;
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.token, token));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, application.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, application.id));
  res.json(buildApplicationResume({ ...application, jobTitle: job?.title ?? "Unknown" }, docs));
});

// PATCH /applications/:token/personal — step 2
router.patch("/applications/:token/personal", async (req, res): Promise<void> => {
  const params = SavePersonalInfoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const body = SavePersonalInfoBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.token, params.data.token));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const d = body.data;
  const [updated] = await db.update(applicationsTable).set({
    fullName: d.fullName,
    dateOfBirth: d.dateOfBirth,
    gender: d.gender,
    nationality: d.nationality,
    stateOfOrigin: d.stateOfOrigin,
    lga: d.lga,
    maritalStatus: d.maritalStatus,
    address: d.address,
    phone: d.phone,
    email: d.email,
    nextOfKinName: d.nextOfKinName,
    nextOfKinRelationship: d.nextOfKinRelationship,
    nextOfKinPhone: d.nextOfKinPhone,
    nextOfKinAddress: d.nextOfKinAddress,
    emergencyContactName: d.emergencyContactName,
    emergencyContactRelationship: d.emergencyContactRelationship,
    emergencyContactPhone: d.emergencyContactPhone,
    emergencyContactAddress: d.emergencyContactAddress,
    currentStep: Math.max(application.currentStep, 3),
  }).where(eq(applicationsTable.token, params.data.token)).returning();
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, updated.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, updated.id));
  res.json(buildApplicationResume({ ...updated, jobTitle: job?.title ?? "Unknown" }, docs));
});

// PATCH /applications/:token/guarantor — step 4
router.patch("/applications/:token/guarantor", async (req, res): Promise<void> => {
  const params = SaveGuarantorInfoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const body = SaveGuarantorInfoBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.token, params.data.token));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const d = body.data;
  const [updated] = await db.update(applicationsTable).set({
    guarantorFullName: d.guarantorFullName,
    guarantorAddress: d.guarantorAddress,
    guarantorOccupation: d.guarantorOccupation,
    guarantorPlaceOfWork: d.guarantorPlaceOfWork,
    guarantorPhone: d.guarantorPhone,
    guarantorEmail: d.guarantorEmail,
    guarantorRelationship: d.guarantorRelationship,
    guarantorYearsKnown: d.guarantorYearsKnown,
    guarantorIdType: d.guarantorIdType,
    guarantorIdNumber: d.guarantorIdNumber,
    guarantorIdIssueDate: d.guarantorIdIssueDate,
    guarantorIdExpiryDate: d.guarantorIdExpiryDate,
    witnessName: d.witnessName,
    witnessAddress: d.witnessAddress,
    witnessPhone: d.witnessPhone,
    declarationAccepted: d.declarationAccepted,
    currentStep: Math.max(application.currentStep, 5),
  }).where(eq(applicationsTable.token, params.data.token)).returning();
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, updated.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, updated.id));
  res.json(buildApplicationResume({ ...updated, jobTitle: job?.title ?? "Unknown" }, docs));
});

// PATCH /applications/:token/agreement — step 5
router.patch("/applications/:token/agreement", async (req, res): Promise<void> => {
  const params = SaveAgreementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const body = SaveAgreementBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.token, params.data.token));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? req.socket.remoteAddress ?? null;
  const [updated] = await db.update(applicationsTable).set({
    agreedToTerms: body.data.agreedToTerms,
    fullNameConfirmation: body.data.fullNameConfirmation,
    signatureData: body.data.signatureData,
    agreementSignedAt: new Date(),
    agreementIpAddress: ip,
    currentStep: Math.max(application.currentStep, 6),
  }).where(eq(applicationsTable.token, params.data.token)).returning();
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, updated.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, updated.id));
  res.json(buildApplicationResume({ ...updated, jobTitle: job?.title ?? "Unknown" }, docs));
});

// POST /applications/:token/submit — step 6
router.post("/applications/:token/submit", async (req, res): Promise<void> => {
  const params = SubmitApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.token, params.data.token));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  if (!application.fullName || !application.agreedToTerms) {
    res.status(400).json({ error: "Application is incomplete. Please complete all required steps." });
    return;
  }
  const [updated] = await db.update(applicationsTable).set({
    status: "pending",
    currentStep: 6,
  }).where(eq(applicationsTable.token, params.data.token)).returning();
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, updated.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, updated.id));

  // Send confirmation email asynchronously
  if (updated.email && updated.fullName) {
    sendApplicationSubmittedEmail(updated.email, updated.fullName, updated.token).catch(() => {});
  }

  res.json(buildApplicationResume({ ...updated, jobTitle: job?.title ?? "Unknown" }, docs));
});

export default router;
