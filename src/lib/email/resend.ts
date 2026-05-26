import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getEmailConfig() {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@klarify.africa";
  const fromName = process.env.RESEND_FROM_NAME ?? "Klarify";
  const adminEmail = process.env.RESEND_ADMIN_EMAIL ?? "hello@klarify.africa";
  const segmentId = process.env.RESEND_SEGMENT_ID;

  return {
    from: `${fromName} <${fromEmail}>`,
    fromEmail,
    adminEmail,
    replyTo: adminEmail,
    segmentId,
  };
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
