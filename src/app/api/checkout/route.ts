import { NextResponse } from "next/server";
import { startCheckout } from "@/lib/commerce/checkout";
import type { CheckoutRequest } from "@/lib/commerce/types";
import { isKorapayConfigured } from "@/lib/korapay/client";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isKorapayConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 503 }
    );
  }

  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const productSlug = body.productSlug?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  if (!productSlug) {
    return NextResponse.json({ error: "Product is required." }, { status: 400 });
  }

  try {
    const result = await startCheckout({
      productSlug,
      email,
      name: body.name?.trim(),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start checkout.";
    console.error("[Checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
