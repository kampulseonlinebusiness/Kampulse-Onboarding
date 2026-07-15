import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetJobParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/jobs", async (_req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.status, "active"));
  res.json(jobs.map(j => ({
    id: j.id, title: j.title, location: j.location, salary: j.salary,
    workingHours: j.workingHours, transportAllowance: j.transportAllowance,
    overtime: j.overtime, description: j.description, photoUrl: j.photoUrl,
    status: j.status, createdAt: j.createdAt,
  })));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid job ID" });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json({
    id: job.id, title: job.title, location: job.location, salary: job.salary,
    workingHours: job.workingHours, transportAllowance: job.transportAllowance,
    overtime: job.overtime, description: job.description, photoUrl: job.photoUrl,
    status: job.status, createdAt: job.createdAt,
  });
});

export default router;
