import { pgTable, text, serial, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { jobsTable } from "./jobs";

export const applicationStatusEnum = pgEnum("application_status", ["draft", "pending", "under_review", "approved", "rejected"]);

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  jobId: integer("job_id").notNull().references(() => jobsTable.id),
  status: applicationStatusEnum("status").notNull().default("draft"),
  currentStep: integer("current_step").notNull().default(1),
  // Step 1 fields
  applicationSource: text("application_source"),
  expectedStartDate: text("expected_start_date"),
  coverLetter: text("cover_letter"),
  // Step 2 - Personal Info
  fullName: text("full_name"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  nationality: text("nationality"),
  stateOfOrigin: text("state_of_origin"),
  lga: text("lga"),
  maritalStatus: text("marital_status"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  // Next of Kin
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinRelationship: text("next_of_kin_relationship"),
  nextOfKinPhone: text("next_of_kin_phone"),
  nextOfKinAddress: text("next_of_kin_address"),
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactRelationship: text("emergency_contact_relationship"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactAddress: text("emergency_contact_address"),
  // Computer Literacy
  computerLiteracy: text("computer_literacy"),
  // Step 4 - Guarantor
  guarantorFullName: text("guarantor_full_name"),
  guarantorAddress: text("guarantor_address"),
  guarantorOccupation: text("guarantor_occupation"),
  guarantorPlaceOfWork: text("guarantor_place_of_work"),
  guarantorPhone: text("guarantor_phone"),
  guarantorEmail: text("guarantor_email"),
  guarantorRelationship: text("guarantor_relationship"),
  guarantorYearsKnown: integer("guarantor_years_known"),
  guarantorIdType: text("guarantor_id_type"),
  guarantorIdNumber: text("guarantor_id_number"),
  guarantorIdIssueDate: text("guarantor_id_issue_date"),
  guarantorIdExpiryDate: text("guarantor_id_expiry_date"),
  witnessName: text("witness_name"),
  witnessAddress: text("witness_address"),
  witnessPhone: text("witness_phone"),
  declarationAccepted: boolean("declaration_accepted"),
  // Step 5 - Agreement
  agreedToTerms: boolean("agreed_to_terms"),
  fullNameConfirmation: text("full_name_confirmation"),
  signatureData: text("signature_data"),
  agreementSignedAt: timestamp("agreement_signed_at", { withTimezone: true }),
  agreementIpAddress: text("agreement_ip_address"),
  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
