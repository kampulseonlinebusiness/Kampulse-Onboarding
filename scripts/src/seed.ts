import { db, usersTable, jobsTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Seed admin user
  const existing = await db.select().from(usersTable);
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash("Admin@kampulse123", 12);
    await db.insert(usersTable).values({
      email: "admin@kampulse.com",
      name: "Super Admin",
      passwordHash,
      role: "super_admin",
    });
    console.log("Created admin user: admin@kampulse.com / Admin@kampulse123");
  } else {
    console.log("Admin users already exist, skipping.");
  }

  // Seed job
  const existingJobs = await db.select().from(jobsTable);
  if (existingJobs.length === 0) {
    await db.insert(jobsTable).values({
      title: "Betshop Cashier",
      location: "Osubi, Delta State",
      salary: "₦70,000 Monthly",
      workingHours: "Monday–Saturday, 8:00 AM – 5:00 PM",
      transportAllowance: "₦2,000 Daily / ₦12,000 Weekly",
      overtime: "₦2,000 per approved overtime session",
      description: "Responsible for cash handling, customer transactions, record keeping, and maintaining shop order at the Osubi, Delta State location.",
      status: "active",
    });
    console.log("Created Betshop Cashier job listing.");
  } else {
    console.log("Jobs already exist, skipping.");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
