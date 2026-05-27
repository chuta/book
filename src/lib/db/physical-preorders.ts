import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { PhysicalBookFormat } from "@/lib/physical/constants";
import type { PhysicalPreorder } from "@/lib/physical/types";

export const PHYSICAL_PREORDERS_TABLE = "book_physical_preorders";

export function createPhysicalPaymentReference(): string {
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `KPHYS-${stamp}-${rand}`.toUpperCase();
}

export function isPhysicalPaymentReference(reference: string): boolean {
  return reference.startsWith("KPHYS-");
}

export async function createPendingPhysicalPreorder(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookSlug: string;
  bookTitle: string;
  format: PhysicalBookFormat;
  quantity: number;
  unitPriceNgnKobo: number;
  shippingNgnKobo: number;
  totalNgnKobo: number;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
}): Promise<PhysicalPreorder> {
  const supabase = getSupabaseAdmin();
  const paymentReference = createPhysicalPaymentReference();

  const { data, error } = await supabase
    .from(PHYSICAL_PREORDERS_TABLE)
    .insert({
      payment_reference: paymentReference,
      customer_name: input.customerName.trim(),
      customer_email: input.customerEmail.toLowerCase().trim(),
      customer_phone: input.customerPhone.trim(),
      book_slug: input.bookSlug,
      book_title: input.bookTitle,
      format: input.format,
      quantity: input.quantity,
      unit_price_ngn_kobo: input.unitPriceNgnKobo,
      shipping_ngn_kobo: input.shippingNgnKobo,
      total_ngn_kobo: input.totalNgnKobo,
      street_address: input.streetAddress.trim(),
      city: input.city.trim(),
      state: input.state.trim(),
      country: input.country,
      payment_status: "pending",
      fulfillment_status: "pending",
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create pre-order");
  }

  return data as PhysicalPreorder;
}

export async function getPhysicalPreorderByPaymentReference(
  reference: string
): Promise<PhysicalPreorder | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(PHYSICAL_PREORDERS_TABLE)
    .select("*")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as PhysicalPreorder | null;
}

export async function markPhysicalPreorderPaid(input: {
  orderId: string;
  korapayReference: string;
}): Promise<PhysicalPreorder> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(PHYSICAL_PREORDERS_TABLE)
    .update({
      korapay_reference: input.korapayReference,
      payment_status: "paid",
      payment_verified: true,
      fulfillment_status: "pending",
    })
    .eq("id", input.orderId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update pre-order");
  }

  return data as PhysicalPreorder;
}

export async function markPhysicalPreorderFailed(input: {
  orderId: string;
  korapayReference: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from(PHYSICAL_PREORDERS_TABLE)
    .update({
      korapay_reference: input.korapayReference,
      payment_status: "failed",
      payment_verified: false,
    })
    .eq("id", input.orderId);
}

export async function markPhysicalPreorderEmailsSent(
  orderId: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from(PHYSICAL_PREORDERS_TABLE)
    .update({
      admin_notified: true,
      confirmation_sent: true,
    })
    .eq("id", orderId);
}
