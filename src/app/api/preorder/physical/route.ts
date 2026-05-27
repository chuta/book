import { NextResponse } from "next/server";
import { AUTHOR, NIGERIAN_STATES } from "@/lib/constants";
import {
  isValidPhysicalFormat,
  startPhysicalPreorderCheckout,
} from "@/lib/physical/checkout";
import type { PhysicalPreorderRequest } from "@/lib/physical/types";
import { isKorapayConfigured } from "@/lib/korapay/client";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const VALID_BOOK_SLUGS = new Set<string>(
  AUTHOR.books.map((book) => book.productSlug).filter(Boolean)
);

const VALID_STATES = new Set<string>(NIGERIAN_STATES);

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isKorapayConfigured()) {
    return NextResponse.json(
      { error: "Pre-order checkout is not configured yet." },
      { status: 503 }
    );
  }

  let body: PhysicalPreorderRequest;
  try {
    body = (await request.json()) as PhysicalPreorderRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const streetAddress = body.streetAddress?.trim();
  const city = body.city?.trim();
  const state = body.state?.trim();
  const bookSlug = body.bookSlug?.trim();
  const format = body.format;
  const quantity = Number(body.quantity);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid name and email are required." }, { status: 400 });
  }

  if (!phone || phone.length < 7) {
    return NextResponse.json({ error: "Valid phone number is required." }, { status: 400 });
  }

  if (!streetAddress || !city || !state || !VALID_STATES.has(state)) {
    return NextResponse.json(
      { error: "Complete delivery address with a valid Nigerian state is required." },
      { status: 400 }
    );
  }

  if (!bookSlug || !VALID_BOOK_SLUGS.has(bookSlug)) {
    return NextResponse.json({ error: "Select a valid book." }, { status: 400 });
  }

  if (!format || !isValidPhysicalFormat(format)) {
    return NextResponse.json({ error: "Select hardback or softback." }, { status: 400 });
  }

  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
    return NextResponse.json({ error: "Quantity must be between 1 and 20." }, { status: 400 });
  }

  try {
    const result = await startPhysicalPreorderCheckout({
      bookSlug,
      format,
      quantity,
      name,
      email,
      phone,
      streetAddress,
      city,
      state,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start pre-order checkout.";
    console.error("[Physical pre-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
