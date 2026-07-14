import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT ?? "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM ?? "noreply@kampulse.com";
const BASE_URL = process.env.APP_URL ?? "https://kampulse.replit.app";

function emailStyles() {
  return `
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f6fb; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #1e3a5f; padding: 24px 32px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
    .body { padding: 32px; color: #333333; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 4px; font-weight: bold; margin: 8px 0; }
    .footer { background: #f4f6fb; padding: 16px 32px; text-align: center; color: #888; font-size: 12px; }
    .btn { display: inline-block; background: #1e3a5f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
  `;
}

export async function sendApplicationSubmittedEmail(applicantEmail: string, applicantName: string, token: string): Promise<void> {
  if (!process.env.SMTP_USER) {
    logger.info({ applicantEmail }, "Email not configured, skipping sendApplicationSubmittedEmail");
    return;
  }
  const resumeUrl = `${BASE_URL}/apply/${token}`;
  try {
    await transporter.sendMail({
      from: FROM,
      to: applicantEmail,
      subject: "Application Received — Kampulse Handling Solutions Ltd",
      html: `
        <style>${emailStyles()}</style>
        <div class="container">
          <div class="header"><h1>Kampulse Handling Solutions Ltd</h1></div>
          <div class="body">
            <p>Dear ${applicantName},</p>
            <p>Thank you for submitting your application to Kampulse Handling Solutions Ltd. We have received your application and it is currently under review.</p>
            <p><strong>Your application reference link:</strong></p>
            <p><a href="${resumeUrl}" class="btn">View My Application</a></p>
            <p>Please save this link — you may need it to check your application status or provide additional information.</p>
            <p>We will contact you within 3-5 business days regarding next steps.</p>
            <p>Best regards,<br/>HR Team<br/>Kampulse Handling Solutions Ltd</p>
          </div>
          <div class="footer">Osubi, Delta State, Nigeria</div>
        </div>
      `,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send application submitted email");
  }
}

export async function sendStatusUpdateEmail(applicantEmail: string, applicantName: string, status: string): Promise<void> {
  if (!process.env.SMTP_USER) {
    logger.info({ applicantEmail }, "Email not configured, skipping sendStatusUpdateEmail");
    return;
  }
  const statusMessages: Record<string, { subject: string; body: string; color: string }> = {
    under_review: {
      subject: "Your Application is Under Review — Kampulse",
      body: "Your application is now under review by our HR team. We will notify you of the outcome soon.",
      color: "#f59e0b",
    },
    approved: {
      subject: "Congratulations! Your Application has been Approved — Kampulse",
      body: "We are pleased to inform you that your application has been approved. Our HR team will contact you shortly with the next steps for onboarding.",
      color: "#10b981",
    },
    rejected: {
      subject: "Application Update — Kampulse Handling Solutions Ltd",
      body: "We appreciate your interest in joining Kampulse Handling Solutions Ltd. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We encourage you to apply for future openings.",
      color: "#ef4444",
    },
  };

  const msg = statusMessages[status];
  if (!msg) return;

  try {
    await transporter.sendMail({
      from: FROM,
      to: applicantEmail,
      subject: msg.subject,
      html: `
        <style>${emailStyles()}</style>
        <div class="container">
          <div class="header"><h1>Kampulse Handling Solutions Ltd</h1></div>
          <div class="body">
            <p>Dear ${applicantName},</p>
            <p>${msg.body}</p>
            <p>Best regards,<br/>HR Team<br/>Kampulse Handling Solutions Ltd</p>
          </div>
          <div class="footer">Osubi, Delta State, Nigeria</div>
        </div>
      `,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send status update email");
  }
}
