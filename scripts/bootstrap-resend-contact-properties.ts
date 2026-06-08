import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { bootstrapResendContactProperties } from "../src/lib/email/contact-properties";
import { getResend } from "../src/lib/email/resend";

function loadEnvFile(filename: string): void {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;

  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main(): Promise<void> {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

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
