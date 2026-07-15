import PDFDocument from "pdfkit";
import { randomUUID } from "crypto";
import { uploadFile } from "./storage";
import type { Application } from "@workspace/db";

interface ApplicationWithJob extends Application {
  jobTitle: string;
  documents: Array<{ fileType: string; fileName: string }>;
  notes: Array<{ content: string; createdBy: string | null; createdAt: Date }>;
}

/**
 * Generate a PDF summary for an application and upload it to storage.
 * Returns the public URL (R2 or local) of the generated file.
 */
export async function generateApplicationPdf(application: ApplicationWithJob): Promise<string> {
  const buffer = await buildPdfBuffer(application);
  const key = `generated-pdf/application-${application.id}-${randomUUID()}.pdf`;
  return uploadFile(buffer, key, "application/pdf");
}

function buildPdfBuffer(application: ApplicationWithJob): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.rect(0, 0, doc.page.width, 80).fill("#1e3a5f");
    doc.fillColor("white").fontSize(22).text("KAMPULSE HANDLING SOLUTIONS LTD", 50, 25, { align: "center" });
    doc.fontSize(12).text("Employee Application — Confidential", 50, 52, { align: "center" });

    doc.moveDown(3);
    doc.fillColor("#1e3a5f").fontSize(16).text("Application Summary", { underline: true });
    doc.fillColor("#333");
    doc.fontSize(11).text(`Application ID: ${application.id}`);
    doc.text(`Status: ${application.status.replace(/_/g, " ").toUpperCase()}`);
    doc.text(`Position: ${application.jobTitle}`);
    doc.text(`Date Applied: ${new Date(application.createdAt).toLocaleDateString("en-NG")}`);
    doc.text(`Application Source: ${application.applicationSource ?? "N/A"}`);
    doc.text(`Expected Start Date: ${application.expectedStartDate ?? "N/A"}`);

    if (application.coverLetter) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(13).text("Cover Letter");
      doc.fillColor("#333").fontSize(10).text(application.coverLetter);
    }

    // Personal Info
    if (application.fullName) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Personal Information", { underline: true });
      doc.fillColor("#333").fontSize(11);
      doc.text(`Full Name: ${application.fullName}`);
      doc.text(`Date of Birth: ${application.dateOfBirth ?? "N/A"}`);
      doc.text(`Gender: ${application.gender ?? "N/A"}`);
      doc.text(`Nationality: ${application.nationality ?? "N/A"}`);
      doc.text(`Phone: ${application.phone ?? "N/A"}`);
      doc.text(`Email: ${application.email ?? "N/A"}`);
      doc.text(`Address: ${application.address ?? "N/A"}`);
    }

    // Employment History
    if (application.previousEmployer) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Employment History", { underline: true });
      doc.fillColor("#333").fontSize(11);
      doc.text(`Previous Employer: ${application.previousEmployer}`);
      doc.text(`Previous Job Title: ${application.previousJobTitle ?? "N/A"}`);
      doc.text(`Reason for Leaving: ${application.reasonForLeaving ?? "N/A"}`);
    }

    // Guarantor Info
    if (application.guarantorName) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Guarantor Information", { underline: true });
      doc.fillColor("#333").fontSize(11);
      doc.text(`Guarantor Name: ${application.guarantorName}`);
      doc.text(`Relationship: ${application.guarantorRelationship ?? "N/A"}`);
      doc.text(`Phone: ${application.guarantorPhone ?? "N/A"}`);
      doc.text(`Address: ${application.guarantorAddress ?? "N/A"}`);
    }

    // Documents submitted
    if (application.documents?.length) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Documents Submitted", { underline: true });
      doc.fillColor("#333").fontSize(11);
      for (const d of application.documents) {
        doc.text(`• ${d.fileType.replace(/_/g, " ")}: ${d.fileName}`);
      }
    }

    // Admin Notes
    if (application.notes?.length) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Admin Notes", { underline: true });
      doc.fillColor("#333").fontSize(11);
      for (const note of application.notes) {
        doc.text(`[${new Date(note.createdAt).toLocaleDateString()}] ${note.createdBy ?? "Admin"}: ${note.content}`);
        doc.moveDown(0.3);
      }
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(9).fillColor("#888").text(
      `Generated on ${new Date().toLocaleString("en-NG")} — Kampulse Handling Solutions Ltd`,
      { align: "center" },
    );

    doc.end();
  });
}
