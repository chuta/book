import { loadEnvFiles } from "../src/lib/scripts/load-env";
import { sendWebinarThankYouEmails } from "../src/lib/email/webinar-thank-you";

function printUsage(): void {
  console.log(`Usage:
  npm run send:webinar-thank-you              # dry run — list registrant count
  npm run send:webinar-thank-you -- --send      # send to all launch registrants
  npm run send:webinar-thank-you -- --send --email=user@example.com
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  loadEnvFiles();

  const shouldSend = args.includes("--send");
  const emailArg = args.find((arg) => arg.startsWith("--email="));
  const email = emailArg?.slice("--email=".length).trim().toLowerCase();

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    process.exit(1);
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
    process.exit(1);
  }

  const result = await sendWebinarThankYouEmails({
    dryRun: !shouldSend,
    email,
  });

  if (!shouldSend) {
    console.log(
      `Dry run: ${result.total} launch registrant(s) would receive the thank-you email.`
    );
    console.log("Run with --send to deliver immediately.");
    return;
  }

  console.log(`Sent: ${result.sent}/${result.total}`);

  if (result.failed.length > 0) {
    console.error("\nFailed deliveries:");
    for (const failure of result.failed) {
      console.error(`  ${failure.email}: ${failure.error}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    "Webinar thank-you send failed:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
});
