import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type BookRegistrationRow = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  role: string;
  country: string;
  registration_type: string;
  admin_notified: boolean;
  confirmation_sent: boolean;
  resend_contact_synced: boolean;
  follow_ups_scheduled: string[];
  created_at: string;
  updated_at: string;
};

let supabaseAdmin: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase is not configured");
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}

export const REGISTRATIONS_TABLE = "book_virtual_event_registrations";
