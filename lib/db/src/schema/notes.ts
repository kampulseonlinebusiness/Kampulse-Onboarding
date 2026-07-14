import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { applicationsTable } from "./applications";

export const adminNotesTable = pgTable("admin_notes", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applicationsTable.id),
  content: text("content").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAdminNoteSchema = createInsertSchema(adminNotesTable).omit({ id: true, createdAt: true });
export type InsertAdminNote = z.infer<typeof insertAdminNoteSchema>;
export type AdminNote = typeof adminNotesTable.$inferSelect;
