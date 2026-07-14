import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ensureUploadDirs } from "./uploads";
import type { Application } from "@workspace/db";

ensureUploadDirs();

const PDF_DIR = path.resolve(process.cwd(), "uploads", "generated-pdf");

interface ApplicationWithJob extends Application {
  jobTitle: string;
  documents: Array<{ fileType: string; fileName: string }>;
  notes: Array<{ content: string; createdBy: string | null; createdAt: Date }>;
}

export async function generateApplicationPdf(application: ApplicationWithJob): Promise<string> {
  const filename = `application-${application.id}-${randomUUID()}.pdf`;
  const filepath = path.join(PDF_DIR, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

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
      doc.text(`Full Name: ${application.fullName ?? "N/A"}`);
      doc.text(`Date of Birth: ${application.dateOfBirth ?? "N/A"}`);
      doc.text(`Gender: ${application.gender ?? "N/A"}`);
      doc.text(`Nationality: ${application.nationality ?? "N/A"}`);
      doc.text(`State of Origin: ${application.stateOfOrigin ?? "N/A"}`);
      doc.text(`LGA: ${application.lga ?? "N/A"}`);
      doc.text(`Marital Status: ${application.maritalStatus ?? "N/A"}`);
      doc.text(`Address: ${application.address ?? "N/A"}`);
      doc.text(`Phone: ${application.phone ?? "N/A"}`);
      doc.text(`Email: ${application.email ?? "N/A"}`);
      const literacyLabel = application.computerLiteracy === "proficient"
        ? "Yes — Proficient"
        : application.computerLiteracy === "basic"
          ? "Yes — Basic Knowledge"
          : application.computerLiteracy === "none"
            ? "No — Not computer literate"
            : "N/A";
      doc.text(`Computer Literacy: ${literacyLabel}`);

      doc.moveDown(0.5);
      doc.fillColor("#1e3a5f").fontSize(12).text("Next of Kin");
      doc.fillColor("#333").fontSize(11);
      doc.text(`Name: ${application.nextOfKinName ?? "N/A"}`);
      doc.text(`Relationship: ${application.nextOfKinRelationship ?? "N/A"}`);
      doc.text(`Phone: ${application.nextOfKinPhone ?? "N/A"}`);
    }

    // Guarantor
    if (application.guarantorFullName) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Guarantor Information", { underline: true });
      doc.fillColor("#333").fontSize(11);
      doc.text(`Name: ${application.guarantorFullName ?? "N/A"}`);
      doc.text(`Address: ${application.guarantorAddress ?? "N/A"}`);
      doc.text(`Occupation: ${application.guarantorOccupation ?? "N/A"}`);
      doc.text(`Place of Work: ${application.guarantorPlaceOfWork ?? "N/A"}`);
      doc.text(`Phone: ${application.guarantorPhone ?? "N/A"}`);
      doc.text(`Relationship: ${application.guarantorRelationship ?? "N/A"}`);
      doc.text(`Years Known: ${application.guarantorYearsKnown ?? "N/A"}`);
      doc.text(`ID Type: ${application.guarantorIdType ?? "N/A"}`);
      doc.text(`ID Number: ${application.guarantorIdNumber ?? "N/A"}`);
    }

    // Documents
    if (application.documents.length > 0) {
      doc.moveDown();
      doc.fillColor("#1e3a5f").fontSize(14).text("Uploaded Documents", { underline: true });
      doc.fillColor("#333").fontSize(11);
      for (const doc_ of application.documents) {
        doc.text(`• ${doc_.fileType.replace(/_/g, " ")}: ${doc_.fileName}`);
      }
    }

    // Agreement
    doc.moveDown();
    doc.fillColor("#1e3a5f").fontSize(14).text("Employment Agreement", { underline: true });
    doc.fillColor("#333").fontSize(11);
    doc.text(`Agreement Accepted: ${application.agreedToTerms ? "Yes" : "No"}`);
    doc.text(`Name Confirmation: ${application.fullNameConfirmation ?? "N/A"}`);
    if (application.agreementSignedAt) {
      doc.text(`Signed At: ${new Date(application.agreementSignedAt).toLocaleString("en-NG")}`);
    }
    doc.text(`IP Address: ${application.agreementIpAddress ?? "N/A"}`);

    // Admin Notes
    if (application.notes.length > 0) {
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
    doc.fontSize(9).fillColor("#888").text(`Generated on ${new Date().toLocaleString("en-NG")} — Kampulse Handling Solutions Ltd`, { align: "center" });

    doc.end();
    stream.on("finish", () => resolve(`/api/uploads/files/generated-pdf/${filename}`));
    stream.on("error", reject);
  });
}
