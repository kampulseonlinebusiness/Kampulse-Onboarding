import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { applicationsTable } from "./applications";

export const statusHistoryTable = pgTable("status_history", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applicationsTable.id),
  status: text("status").notNull(),
  note: text("note"),
  changedBy: text("changed_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStatusHistorySchema = createInsertSchema(statusHistoryTable).omit({ id: true, createdAt: true });
export type InsertStatusHistory = z.infer<typeof insertStatusHistorySchema>;
export type StatusHistory = typeof statusHistoryTable.$inferSelect;
