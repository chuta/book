import { NextRequest, NextResponse } from "next/server";
import {
  createRegistration,
  DuplicateRegistrationError,
  updateRegistrationEmailStatus,
} from "@/lib/db/registrations";
import { processRegistration } from "@/lib/email/automation";
import { isResendConfigured } from "@/lib/email/resend";
import type { RegistrationPayload } from "@/lib/email/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { RegistrationType } from "@/lib/constants";

const VALID_TYPES: RegistrationType[] = ["launch", "klarify", "book-updates"];

function isValidType(value: string): value is RegistrationType {
  return VALID_TYPES.includes(value as RegistrationType);
}

function normalizePayload(body: RegistrationPayload): RegistrationPayload {
  return {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    organization: body.organization?.trim(),
    role: body.role,
    country: body.country,
    type: body.type,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationPayload = await request.json();

    if (!body.name || !body.email || !body.role || !body.country || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidType(body.type)) {
      return NextResponse.json(
        { error: "Invalid registration type" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const data = normalizePayload(body);

    if (!isSupabaseConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Registration] SUPABASE_URL or service role key missing");
        return NextResponse.json({
          success: true,
          dev: true,
          message: "Registration skipped (Supabase not configured in dev)",
        });
      }
      return NextResponse.json(
        { error: "Registration storage is not configured" },
        { status: 503 }
      );
    }

    if (!isResendConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Registration] RESEND_API_KEY missing");
      } else {
        return NextResponse.json(
          { error: "Email service is not configured" },
          { status: 503 }
        );
      }
    }

    // 1. Persist registration first (source of truth)
    let record;
    try {
      record = await createRegistration(data);
    } catch (error) {
      if (error instanceof DuplicateRegistrationError) {
        return NextResponse.json(
          {
            error: "You're already registered. Check your inbox for confirmation details.",
            alreadyRegistered: true,
          },
          { status: 409 }
        );
      }
      throw error;
    }

    // 2. Send emails (dev mode: skip if Resend not configured)
    if (!isResendConfigured()) {
      return NextResponse.json({
        success: true,
        dev: true,
        registrationId: record.id,
        message: "Registration saved (Resend not configured in dev)",
      });
    }

    const result = await processRegistration(data, record.id);

    // 3. Update row with email delivery status
    await updateRegistrationEmailStatus(record.id, {
      adminNotified: result.emailsSent.admin,
      confirmationSent: result.emailsSent.confirmation,
      resendContactSynced: result.contactSynced,
      followUpsScheduled: result.emailsSent.followUps,
    });

    return NextResponse.json({
      success: true,
      registrationId: record.id,
    });
  } catch (error) {
    console.error("[Registration Error]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Registration failed",
      },
      { status: 500 }
    );
  }
}
