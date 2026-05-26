import type { RegistrationType } from "@/lib/constants";
import type { RegistrationPayload } from "@/lib/email/types";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  REGISTRATIONS_TABLE,
  type BookRegistrationRow,
} from "@/lib/supabase/server";

export class DuplicateRegistrationError extends Error {
  constructor(email: string, type: RegistrationType) {
    super(`Already registered: ${email} (${type})`);
    this.name = "DuplicateRegistrationError";
  }
}

export class RegistrationPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationPersistenceError";
  }
}

export async function createRegistration(
  data: RegistrationPayload
): Promise<BookRegistrationRow> {
  if (!isSupabaseConfigured()) {
    throw new RegistrationPersistenceError("Database is not configured");
  }

  const supabase = getSupabaseAdmin();

  const { data: row, error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .insert({
      name: data.name,
      email: data.email,
      organization: data.organization ?? null,
      role: data.role,
      country: data.country,
      registration_type: data.type,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new DuplicateRegistrationError(data.email, data.type);
    }

    console.error("[Supabase] Insert failed:", error.message);
    throw new RegistrationPersistenceError("Failed to save registration");
  }

  return row as BookRegistrationRow;
}

export interface RegistrationEmailStatus {
  adminNotified: boolean;
  confirmationSent: boolean;
  resendContactSynced: boolean;
  followUpsScheduled: string[];
}

export async function updateRegistrationEmailStatus(
  registrationId: string,
  status: RegistrationEmailStatus
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .update({
      admin_notified: status.adminNotified,
      confirmation_sent: status.confirmationSent,
      resend_contact_synced: status.resendContactSynced,
      follow_ups_scheduled: status.followUpsScheduled,
    })
    .eq("id", registrationId);

  if (error) {
    console.error("[Supabase] Status update failed:", error.message);
  }
}

export async function getRegistrationByEmailAndType(
  email: string,
  type: RegistrationType
): Promise<BookRegistrationRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .select("*")
    .eq("email", email)
    .eq("registration_type", type)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] Lookup failed:", error.message);
    return null;
  }

  return data as BookRegistrationRow | null;
}
