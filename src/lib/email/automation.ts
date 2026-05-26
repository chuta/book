import { LAUNCH_EVENT } from "@/lib/constants";
import { getEmailConfig, getResend } from "./resend";
import {
  adminNotificationEmail,
  launchFollowUpEmail,
  userConfirmationEmail,
} from "./templates";
import type {
  FollowUpSchedule,
  RegistrationPayload,
  RegistrationResult,
} from "./types";

/** 9:00 AM WAT on June 5 and June 11, 2026 */
const FOLLOW_UP_SCHEDULES: Omit<FollowUpSchedule, "subject">[] = [
  { key: "followup-7d", scheduledAt: "2026-06-05T08:00:00.000Z" },
  { key: "followup-1d", scheduledAt: "2026-06-11T08:00:00.000Z" },
];

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? fullName,
    lastName: parts.slice(1).join(" "),
  };
}

function getUpcomingFollowUps(): FollowUpSchedule[] {
  const now = Date.now();

  return FOLLOW_UP_SCHEDULES.filter(
    (item) => new Date(item.scheduledAt).getTime() > now
  ).map((item) => ({
    ...item,
    subject:
      item.key === "followup-1d"
        ? `Tomorrow: Virtual Launch — ${LAUNCH_EVENT.date}`
        : `One week to go — Virtual Launch on ${LAUNCH_EVENT.date}`,
  }));
}

async function syncContact(data: RegistrationPayload): Promise<boolean> {
  const resend = getResend();
  const { segmentId } = getEmailConfig();
  const { firstName, lastName } = splitName(data.name);

  const { error } = await resend.contacts.create({
    email: data.email,
    firstName,
    lastName: lastName || undefined,
    unsubscribed: false,
    properties: {
      organization: data.organization ?? "",
      role: data.role,
      country: data.country,
      registrationType: data.type,
      source: "book.klarify.africa",
    },
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  });

  if (error) {
    // Contact may already exist — attempt update instead
    const { error: updateError } = await resend.contacts.update({
      email: data.email,
      firstName,
      lastName: lastName || undefined,
      properties: {
        organization: data.organization ?? "",
        role: data.role,
        country: data.country,
        registrationType: data.type,
        source: "book.klarify.africa",
      },
    });

    if (updateError) {
      console.warn("[Resend] Contact sync failed:", updateError.message);
      return false;
    }
  }

  return true;
}

async function sendAdminNotification(
  data: RegistrationPayload,
  registrationId: string
): Promise<boolean> {
  const resend = getResend();
  const { from, adminEmail } = getEmailConfig();
  const email = adminNotificationEmail(data, registrationId);

  const { error } = await resend.emails.send(
    {
      from,
      to: [adminEmail],
      replyTo: [data.email],
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: [
        { name: "category", value: "registration-admin" },
        { name: "registration_type", value: data.type },
      ],
    },
    { idempotencyKey: `registration-admin/${registrationId}` }
  );

  if (error) {
    console.error("[Resend] Admin notification failed:", error.message);
    return false;
  }

  return true;
}

async function sendUserConfirmation(
  data: RegistrationPayload,
  registrationId: string
): Promise<boolean> {
  const resend = getResend();
  const { from, replyTo } = getEmailConfig();
  const email = userConfirmationEmail(data);

  const { error } = await resend.emails.send(
    {
      from,
      to: [data.email],
      replyTo: [replyTo],
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: [
        { name: "category", value: "registration-confirmation" },
        { name: "registration_type", value: data.type },
      ],
    },
    { idempotencyKey: `registration-confirm/${registrationId}` }
  );

  if (error) {
    console.error("[Resend] Confirmation email failed:", error.message);
    return false;
  }

  return true;
}

async function scheduleLaunchFollowUps(
  data: RegistrationPayload,
  registrationId: string
): Promise<string[]> {
  if (data.type !== "launch") return [];

  const resend = getResend();
  const { from, replyTo } = getEmailConfig();
  const followUps = getUpcomingFollowUps();
  const scheduled: string[] = [];

  for (const followUp of followUps) {
    const email = launchFollowUpEmail(data, followUp.key);

    const { error } = await resend.emails.send(
      {
        from,
        to: [data.email],
        replyTo: [replyTo],
        subject: email.subject,
        html: email.html,
        text: email.text,
        scheduledAt: followUp.scheduledAt,
        tags: [
          { name: "category", value: "registration-followup" },
          { name: "followup", value: followUp.key },
        ],
      },
      {
        idempotencyKey: `registration-${followUp.key}/${registrationId}`,
      }
    );

    if (error) {
      console.error(`[Resend] Follow-up ${followUp.key} failed:`, error.message);
      continue;
    }

    scheduled.push(followUp.key);
  }

  return scheduled;
}

export async function processRegistration(
  data: RegistrationPayload,
  registrationId: string
): Promise<RegistrationResult> {
  const [adminSent, confirmationSent, contactSynced, followUps] =
    await Promise.all([
      sendAdminNotification(data, registrationId),
      sendUserConfirmation(data, registrationId),
      syncContact(data),
      scheduleLaunchFollowUps(data, registrationId),
    ]);

  if (!adminSent && !confirmationSent) {
    throw new Error("Failed to send registration emails");
  }

  return {
    registrationId,
    emailsSent: {
      admin: adminSent,
      confirmation: confirmationSent,
      followUps,
    },
    contactSynced,
  };
}
