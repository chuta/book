import { NextRequest, NextResponse } from "next/server";
import { processRegistration } from "@/lib/email/automation";
import { isResendConfigured } from "@/lib/email/resend";
import type { RegistrationPayload } from "@/lib/email/types";
import type { RegistrationType } from "@/lib/constants";

const VALID_TYPES: RegistrationType[] = ["launch", "klarify", "book-updates"];

function isValidType(value: string): value is RegistrationType {
  return VALID_TYPES.includes(value as RegistrationType);
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
      return NextResponse.json({ error: "Invalid registration type" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!isResendConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Registration] Dev mode — no RESEND_API_KEY:", body);
        return NextResponse.json({
          success: true,
          dev: true,
          message: "Registration logged (Resend not configured)",
        });
      }

      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      );
    }

    const result = await processRegistration({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      organization: body.organization?.trim(),
      role: body.role,
      country: body.country,
      type: body.type,
    });

    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
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
