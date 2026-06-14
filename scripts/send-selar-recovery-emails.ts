import { loadEnvFiles } from "../src/lib/scripts/load-env";
import { getEmailConfig, getResend } from "../src/lib/email/resend";
import { selarCheckoutRecoveryEmail } from "../src/lib/email/templates";

const RECIPIENTS = [
  {
    firstName: "William",
    email: "nyirendawilliamm@gmail.com",
    country: "Zimbabwe",
    attemptedAmount: "ZMW 365.87",
  },
  {
    firstName: "Chantal",
    email: "chantalmigue.migue@gmail.com",
    country: "Kenya",
    attemptedAmount: "KSh 2,671.02",
  },
] as const;

async function main(): Promise<void> {
  loadEnvFiles();

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    process.exit(1);
  }

  const resend = getResend();
  const { from, replyTo } = getEmailConfig();

  for (const recipient of RECIPIENTS) {
    const email = selarCheckoutRecoveryEmail(recipient);

    const { data, error } = await resend.emails.send(
      {
        from,
        to: [recipient.email],
        replyTo: [replyTo],
        subject: email.subject,
        html: email.html,
        text: email.text,
        tags: [{ name: "category", value: "selar-checkout-recovery" }],
      },
      { idempotencyKey: `selar-recovery/${recipient.email}` }
    );

    if (error) {
      console.error(`Failed for ${recipient.email}:`, error.message);
      process.exit(1);
    }

    console.log(`Sent to ${recipient.email} (${data?.id})`);
  }
}

main().catch((error) => {
  console.error(
    "Selar recovery send failed:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
});
