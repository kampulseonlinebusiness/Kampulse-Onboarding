import app from "./app";
import { logger } from "./lib/logger";
import { db, usersTable, jobsTable } from "@workspace/db";
import { hashPassword } from "./lib/auth";

/** Creates the initial admin user and a sample job if the DB is empty.
 *  Runs once at startup — safe to call on every boot (no-ops when data exists). */
async function seedIfEmpty(): Promise<void> {
  try {
    const existingUsers = await db.select().from(usersTable);
    if (existingUsers.length === 0) {
      const passwordHash = await hashPassword("Admin@kampulse123");
      await db.insert(usersTable).values({
        email: "admin@kampulse.com",
        name: "Super Admin",
        passwordHash,
        role: "super_admin",
      });
      logger.info("Seeded initial admin user: admin@kampulse.com");
    }

    const existingJobs = await db.select().from(jobsTable);
    if (existingJobs.length === 0) {
      await db.insert(jobsTable).values({
        title: "Betshop Cashier",
        location: "Osubi, Delta State",
        salary: "₦70,000 Monthly",
        workingHours: "Monday–Saturday, 8:00 AM – 5:00 PM",
        transportAllowance: "₦2,000 Daily / ₦12,000 Weekly",
        overtime: "₦2,000 per approved overtime session",
        description:
          "Responsible for cash handling, customer transactions, record keeping, and maintaining shop order at the Osubi, Delta State location.",
        status: "active",
      });
      logger.info("Seeded initial job listing.");
    }
  } catch (err) {
    // Log but never crash the server over a seeding failure.
    logger.warn({ err }, "Seed step failed — continuing startup");
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  await seedIfEmpty();
});
