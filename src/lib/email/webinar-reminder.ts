import {
  listRegistrationsByType,
  toRegistrationPayload,
} from "@/lib/db/registrations";
import { getEmailConfig, getResend, isResendConfigured } from "./resend";
import { launchStartingSoonEmail } from "./templates";

const REMINDER_TAG = "webinar-reminder-1h";
const BATCH_SIZE = 50;

export interface WebinarReminderResult {
  total: number;
  sent: number;
  failed: Array<{ email: string; error: string }>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendWebinarReminderEmails(options?: {
  dryRun?: boolean;
  email?: string;
}): Promise<WebinarReminderResult> {
  if (!isResendConfigured()) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const rows = await listRegistrationsByType("launch");
  const filterEmail = options?.email?.toLowerCase();
  const targets = filterEmail
    ? rows.filter((row) => row.email === filterEmail)
    : rows;

  if (filterEmail && targets.length === 0) {
    throw new Error(`No launch registration found for ${filterEmail}`);
  }

  const result: WebinarReminderResult = {
    total: targets.length,
    sent: 0,
    failed: [],
  };

  if (options?.dryRun) {
    return result;
  }

  const resend = getResend();
  const { from, replyTo } = getEmailConfig();

  for (let index = 0; index < targets.length; index += BATCH_SIZE) {
    const chunk = targets.slice(index, index + BATCH_SIZE);

    for (const row of chunk) {
      const data = toRegistrationPayload(row);
      const email = launchStartingSoonEmail(data);

      const { error } = await resend.emails.send(
        {
          from,
          to: [data.email],
          replyTo: [replyTo],
          subject: email.subject,
          html: email.html,
          text: email.text,
          tags: [
            { name: "category", value: "registration-followup" },
            { name: "followup", value: REMINDER_TAG },
          ],
        },
        { idempotencyKey: `${REMINDER_TAG}/${row.id}` }
      );

      if (error) {
        result.failed.push({ email: data.email, error: error.message });
        continue;
      }

      result.sent += 1;
    }

    if (index + BATCH_SIZE < targets.length) {
      await sleep(600);
    }
  }

  return result;
}
