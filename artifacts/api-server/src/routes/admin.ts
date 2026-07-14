import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  applicationsTable,
  jobsTable,
  documentsTable,
  statusHistoryTable,
  adminNotesTable,
} from "@workspace/db";
import { eq, desc, sql, and, gte, count } from "drizzle-orm";
import {
  ListAdminApplicationsQueryParams,
  GetAdminApplicationParams,
  UpdateApplicationStatusParams,
  UpdateApplicationStatusBody,
  AddApplicationNoteParams,
  AddApplicationNoteBody,
  GenerateApplicationPdfParams,
  GetRecentActivityQueryParams,
  CreateAdminJobBody,
  UpdateAdminJobBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { generateApplicationPdf } from "../lib/pdf";
import { sendStatusUpdateEmail } from "../lib/email";

const router: IRouter = Router();

// All admin routes require auth
router.use(requireAuth);

// GET /admin/jobs — list all jobs (any status)
router.get("/admin/jobs", async (_req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.createdAt));
  res.json(jobs.map(j => ({
    id: j.id,
    title: j.title,
    location: j.location,
    salary: j.salary,
    workingHours: j.workingHours,
    transportAllowance: j.transportAllowance,
    overtime: j.overtime,
    description: j.description,
    status: j.status,
    createdAt: j.createdAt,
  })));
});

// POST /admin/jobs — create job
router.post("/admin/jobs", async (req, res): Promise<void> => {
  const parsed = CreateAdminJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [job] = await db.insert(jobsTable).values({
    title: d.title,
    location: d.location,
    salary: d.salary,
    workingHours: d.workingHours,
    transportAllowance: d.transportAllowance ?? null,
    overtime: d.overtime ?? null,
    description: d.description ?? null,
    status: d.status,
  }).returning();
  res.status(201).json({
    id: job.id, title: job.title, location: job.location, salary: job.salary,
    workingHours: job.workingHours, transportAllowance: job.transportAllowance,
    overtime: job.overtime, description: job.description, status: job.status,
    createdAt: job.createdAt,
  });
});

// PATCH /admin/jobs/:id — update job
router.patch("/admin/jobs/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const parsed = UpdateAdminJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [existing] = await db.select({ id: jobsTable.id }).from(jobsTable).where(eq(jobsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  const [job] = await db.update(jobsTable).set({
    title: d.title,
    location: d.location,
    salary: d.salary,
    workingHours: d.workingHours,
    transportAllowance: d.transportAllowance ?? null,
    overtime: d.overtime ?? null,
    description: d.description ?? null,
    status: d.status,
  }).where(eq(jobsTable.id, id)).returning();
  res.json({
    id: job.id, title: job.title, location: job.location, salary: job.salary,
    workingHours: job.workingHours, transportAllowance: job.transportAllowance,
    overtime: job.overtime, description: job.description, status: job.status,
    createdAt: job.createdAt,
  });
});

// GET /admin/stats
router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [totalRow] = await db.select({ count: count() }).from(applicationsTable);
  const [pendingRow] = await db.select({ count: count() }).from(applicationsTable).where(eq(applicationsTable.status, "pending"));
  const [reviewRow] = await db.select({ count: count() }).from(applicationsTable).where(eq(applicationsTable.status, "under_review"));
  const [approvedRow] = await db.select({ count: count() }).from(applicationsTable).where(eq(applicationsTable.status, "approved"));
  const [rejectedRow] = await db.select({ count: count() }).from(applicationsTable).where(eq(applicationsTable.status, "rejected"));
  const [jobsRow] = await db.select({ count: count() }).from(jobsTable).where(eq(jobsTable.status, "active"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [todayRow] = await db.select({ count: count() }).from(applicationsTable).where(
    and(
      eq(applicationsTable.status, "pending"),
      gte(applicationsTable.createdAt, today),
    )
  );

  // Weekly counts for last 7 days
  const weeklyRows = await db.execute(sql`
    SELECT DATE(created_at AT TIME ZONE 'UTC') as date, COUNT(*)::int as count
    FROM applications
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at AT TIME ZONE 'UTC')
    ORDER BY date
  `);

  res.json({
    total: totalRow.count,
    pending: pendingRow.count,
    underReview: reviewRow.count,
    approved: approvedRow.count,
    rejected: rejectedRow.count,
    todaySubmissions: todayRow.count,
    activeJobs: jobsRow.count,
    weeklySubmissions: (weeklyRows.rows as Array<{ date: string; count: number }>).map(r => ({
      date: String(r.date),
      count: Number(r.count),
    })),
  });
});

// GET /admin/applications
router.get("/admin/applications", async (req, res): Promise<void> => {
  const query = ListAdminApplicationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { status, search, page = 1, limit = 20 } = query.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (status) conditions.push(eq(applicationsTable.status, status as typeof applicationsTable.status.enumValues[number]));
  if (search) {
    conditions.push(
      sql`(${applicationsTable.fullName} ILIKE ${`%${search}%`} OR ${applicationsTable.email} ILIKE ${`%${search}%`} OR ${applicationsTable.phone} ILIKE ${`%${search}%`})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalRow] = await db.select({ count: count() }).from(applicationsTable)
    .where(whereClause);

  const rows = await db
    .select({
      id: applicationsTable.id,
      status: applicationsTable.status,
      currentStep: applicationsTable.currentStep,
      fullName: applicationsTable.fullName,
      email: applicationsTable.email,
      phone: applicationsTable.phone,
      jobId: applicationsTable.jobId,
      createdAt: applicationsTable.createdAt,
      updatedAt: applicationsTable.updatedAt,
    })
    .from(applicationsTable)
    .where(whereClause)
    .orderBy(desc(applicationsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const jobIds = [...new Set(rows.map(r => r.jobId))];
  const jobs = jobIds.length > 0 ? await db.select().from(jobsTable).where(
    sql`${jobsTable.id} = ANY(${sql.raw(`ARRAY[${jobIds.join(",")}]::int[]`)})`
  ) : [];
  const jobMap = new Map(jobs.map(j => [j.id, j.title]));

  res.json({
    applications: rows.map(r => ({
      id: r.id,
      status: r.status,
      currentStep: r.currentStep,
      jobTitle: jobMap.get(r.jobId) ?? "Unknown",
      applicantName: r.fullName,
      applicantEmail: r.email,
      applicantPhone: r.phone,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    total: totalRow.count,
    page,
    limit,
  });
});

// GET /admin/applications/:id
router.get("/admin/applications/:id", async (req, res): Promise<void> => {
  const params = GetAdminApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, params.data.id));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, application.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, application.id));
  const history = await db.select().from(statusHistoryTable)
    .where(eq(statusHistoryTable.applicationId, application.id))
    .orderBy(desc(statusHistoryTable.createdAt));
  const notes = await db.select().from(adminNotesTable)
    .where(eq(adminNotesTable.applicationId, application.id))
    .orderBy(desc(adminNotesTable.createdAt));

  res.json({
    id: application.id,
    token: application.token,
    status: application.status,
    currentStep: application.currentStep,
    jobId: application.jobId,
    jobTitle: job?.title ?? "Unknown",
    applicationSource: application.applicationSource,
    expectedStartDate: application.expectedStartDate,
    coverLetter: application.coverLetter,
    ipAddress: application.agreementIpAddress,
    personalInfo: {
      fullName: application.fullName,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender,
      nationality: application.nationality,
      stateOfOrigin: application.stateOfOrigin,
      lga: application.lga,
      maritalStatus: application.maritalStatus,
      address: application.address,
      phone: application.phone,
      email: application.email,
      nextOfKinName: application.nextOfKinName,
      nextOfKinRelationship: application.nextOfKinRelationship,
      nextOfKinPhone: application.nextOfKinPhone,
      nextOfKinAddress: application.nextOfKinAddress,
      emergencyContactName: application.emergencyContactName,
      emergencyContactRelationship: application.emergencyContactRelationship,
      emergencyContactPhone: application.emergencyContactPhone,
      emergencyContactAddress: application.emergencyContactAddress,
      computerLiteracy: application.computerLiteracy,
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
      guarantorFullName: application.guarantorFullName,
      guarantorAddress: application.guarantorAddress,
      guarantorOccupation: application.guarantorOccupation,
      guarantorPlaceOfWork: application.guarantorPlaceOfWork,
      guarantorPhone: application.guarantorPhone,
      guarantorEmail: application.guarantorEmail,
      guarantorRelationship: application.guarantorRelationship,
      guarantorYearsKnown: application.guarantorYearsKnown,
      guarantorIdType: application.guarantorIdType,
      guarantorIdNumber: application.guarantorIdNumber,
      guarantorIdIssueDate: application.guarantorIdIssueDate,
      guarantorIdExpiryDate: application.guarantorIdExpiryDate,
      witnessName: application.witnessName,
      witnessAddress: application.witnessAddress,
      witnessPhone: application.witnessPhone,
      declarationAccepted: application.declarationAccepted,
    },
    agreementAccepted: application.agreedToTerms,
    agreementSignedAt: application.agreementSignedAt?.toISOString() ?? null,
    signatureData: application.signatureData,
    notes: notes.map(n => ({
      id: n.id,
      content: n.content,
      createdBy: n.createdBy,
      createdAt: n.createdAt,
    })),
    statusHistory: history.map(h => ({
      id: h.id,
      status: h.status,
      note: h.note,
      changedBy: h.changedBy,
      createdAt: h.createdAt,
    })),
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  });
});

// PATCH /admin/applications/:id/status
router.patch("/admin/applications/:id/status", async (req, res): Promise<void> => {
  const params = UpdateApplicationStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const body = UpdateApplicationStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, params.data.id));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const [updated] = await db.update(applicationsTable).set({
    status: body.data.status as typeof applicationsTable.status.enumValues[number],
  }).where(eq(applicationsTable.id, params.data.id)).returning();

  // Record status history
  await db.insert(statusHistoryTable).values({
    applicationId: application.id,
    status: body.data.status,
    note: body.data.note ?? null,
    changedBy: req.user?.name ?? req.user?.email ?? null,
  });

  // Send email notification
  if (application.email && application.fullName) {
    sendStatusUpdateEmail(application.email, application.fullName, body.data.status).catch(() => {});
  }

  // Return full detail
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, updated.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, updated.id));
  const history = await db.select().from(statusHistoryTable)
    .where(eq(statusHistoryTable.applicationId, updated.id))
    .orderBy(desc(statusHistoryTable.createdAt));
  const notes = await db.select().from(adminNotesTable)
    .where(eq(adminNotesTable.applicationId, updated.id))
    .orderBy(desc(adminNotesTable.createdAt));

  res.json({
    id: updated.id,
    token: updated.token,
    status: updated.status,
    currentStep: updated.currentStep,
    jobId: updated.jobId,
    jobTitle: job?.title ?? "Unknown",
    applicationSource: updated.applicationSource,
    expectedStartDate: updated.expectedStartDate,
    coverLetter: updated.coverLetter,
    ipAddress: updated.agreementIpAddress,
    personalInfo: { fullName: updated.fullName, email: updated.email, phone: updated.phone },
    documents: docs.map(d => ({ id: d.id, fileType: d.fileType, fileName: d.fileName, filePath: d.filePath, fileUrl: d.fileUrl, uploadedAt: d.createdAt })),
    guarantorInfo: { guarantorFullName: updated.guarantorFullName },
    agreementAccepted: updated.agreedToTerms,
    agreementSignedAt: updated.agreementSignedAt?.toISOString() ?? null,
    signatureData: updated.signatureData,
    notes: notes.map(n => ({ id: n.id, content: n.content, createdBy: n.createdBy, createdAt: n.createdAt })),
    statusHistory: history.map(h => ({ id: h.id, status: h.status, note: h.note, changedBy: h.changedBy, createdAt: h.createdAt })),
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
});

// POST /admin/applications/:id/notes
router.post("/admin/applications/:id/notes", async (req, res): Promise<void> => {
  const params = AddApplicationNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const body = AddApplicationNoteBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [application] = await db.select({ id: applicationsTable.id }).from(applicationsTable).where(eq(applicationsTable.id, params.data.id));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const [note] = await db.insert(adminNotesTable).values({
    applicationId: params.data.id,
    content: body.data.content,
    createdBy: req.user?.name ?? req.user?.email ?? null,
  }).returning();
  res.status(201).json({ id: note.id, content: note.content, createdBy: note.createdBy, createdAt: note.createdAt });
});

// GET /admin/applications/:id/pdf
router.get("/admin/applications/:id/pdf", async (req, res): Promise<void> => {
  const params = GenerateApplicationPdfParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [application] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, params.data.id));
  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, application.jobId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.applicationId, application.id));
  const notes = await db.select().from(adminNotesTable).where(eq(adminNotesTable.applicationId, application.id));

  const pdfUrl = await generateApplicationPdf({
    ...application,
    jobTitle: job?.title ?? "Unknown",
    documents: docs.map(d => ({ fileType: d.fileType, fileName: d.fileName })),
    notes: notes.map(n => ({ content: n.content, createdBy: n.createdBy, createdAt: n.createdAt })),
  });

  res.json({ pdfUrl });
});

// GET /admin/recent-activity
router.get("/admin/recent-activity", async (req, res): Promise<void> => {
  const query = GetRecentActivityQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 10) : 10;

  const rows = await db
    .select({
      id: statusHistoryTable.id,
      status: statusHistoryTable.status,
      applicationId: statusHistoryTable.applicationId,
      changedBy: statusHistoryTable.changedBy,
      createdAt: statusHistoryTable.createdAt,
      applicantName: applicationsTable.fullName,
    })
    .from(statusHistoryTable)
    .leftJoin(applicationsTable, eq(statusHistoryTable.applicationId, applicationsTable.id))
    .orderBy(desc(statusHistoryTable.createdAt))
    .limit(limit);

  res.json(rows.map(r => ({
    id: r.id,
    type: "status_change",
    description: `Application status changed to ${r.status.replace(/_/g, " ")}`,
    applicationId: r.applicationId,
    applicantName: r.applicantName,
    createdAt: r.createdAt,
  })));
});

export default router;
