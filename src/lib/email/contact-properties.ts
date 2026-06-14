import type { Resend } from "resend";
import type { RegistrationPayload } from "./types";

export const REGISTRATION_SOURCE = "book.klarify.africa";

export const REGISTRATION_CONTACT_PROPERTIES = [
  { key: "organization", type: "string" as const, fallbackValue: "" },
  { key: "role", type: "string" as const },
  { key: "country", type: "string" as const },
  { key: "registrationType", type: "string" as const },
  { key: "source", type: "string" as const, fallbackValue: REGISTRATION_SOURCE },
] as const;

export function buildRegistrationContactProperties(
  data: Pick<RegistrationPayload, "organization" | "role" | "country" | "type">
) {
  return {
    organization: data.organization ?? "",
    role: data.role,
    country: data.country,
    registrationType: data.type,
    source: REGISTRATION_SOURCE,
  };
}

function isAlreadyExistsError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already exists") ||
    normalized.includes("already a contact property") ||
    normalized.includes("already been taken")
  );
}

export async function bootstrapResendContactProperties(
  resend: Resend
): Promise<void> {
  for (const property of REGISTRATION_CONTACT_PROPERTIES) {
    const { data, error } = await resend.contactProperties.create({
      key: property.key,
      type: property.type,
      ...("fallbackValue" in property && property.fallbackValue !== undefined
        ? { fallbackValue: property.fallbackValue }
        : {}),
    });

    if (error) {
      if (isAlreadyExistsError(error.message)) {
        console.log(`  skip ${property.key} (already exists)`);
        continue;
      }

      throw new Error(`Failed to create "${property.key}": ${error.message}`);
    }

    console.log(`  created ${property.key} (${data?.id})`);
  }
}
