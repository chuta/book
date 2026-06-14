import { bootstrapResendContactProperties } from "../src/lib/email/contact-properties";
import { getResend } from "../src/lib/email/resend";
import { loadEnvFiles } from "../src/lib/scripts/load-env";

async function main(): Promise<void> {
  loadEnvFiles();

  if (!process.env.RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY is not set. Add it to .env.local or export it in your shell."
    );
    process.exit(1);
  }

  console.log("Bootstrapping Resend contact properties...\n");

  try {
    await bootstrapResendContactProperties(getResend());
    console.log("\nDone. Registration contact sync should work now.");
  } catch (error) {
    console.error(
      "\nBootstrap failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
