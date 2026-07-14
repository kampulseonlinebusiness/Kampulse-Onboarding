import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetJobParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/jobs", async (_req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.status, "active"));
  res.json(jobs);
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
  res.json(job);
});

export default router;
