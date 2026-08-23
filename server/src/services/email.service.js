import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function isSmtpConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function createTransport() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export const emailService = {
  isConfigured: isSmtpConfigured,

  async sendPasswordReset({ to, resetUrl }) {
    if (!isSmtpConfigured()) {
      if (env.NODE_ENV !== "production") {
        console.warn(
          "SMTP is not configured. Password reset email was not sent.",
        );
      }

      return false;
    }

    const transporter = createTransport();
    const from = env.SMTP_FROM || env.SMTP_USER;

    await transporter.sendMail({
      from,
      to,
      subject: "Reset your LoanPro password",
      text: `A password reset was requested for your account. Open this link to choose a new password (valid for 24 hours):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>A password reset was requested for your account.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link is valid for 24 hours. If you did not request this, you can ignore this email.</p>`,
    });

    return true;
  },
};
