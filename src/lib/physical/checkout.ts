import { initializeKorapayCharge, verifyKorapayCharge } from "@/lib/korapay/client";
import { logWebhookEvent } from "@/lib/db/commerce";
import {
  getPhysicalPreorderByPaymentReference,
  isPhysicalPaymentReference,
  markPhysicalPreorderEmailsSent,
  markPhysicalPreorderFailed,
  markPhysicalPreorderPaid,
  createPendingPhysicalPreorder,
} from "@/lib/db/physical-preorders";
import { sendPhysicalPreorderEmails } from "@/lib/email/physical-preorder";
import { AUTHOR } from "@/lib/constants";
import {
  calculatePhysicalOrderTotalKobo,
  PHYSICAL_BOOK_FORMATS,
  PHYSICAL_SHIP_COUNTRY,
} from "@/lib/physical/constants";
import type { PhysicalBookFormat } from "@/lib/physical/constants";
import type { PhysicalPreorderRequest } from "@/lib/physical/types";

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://book.klarify.africa"
  );
}

function getBookTitle(slug: string): string | null {
  const book = AUTHOR.books.find((item) => item.productSlug === slug);
  return book?.title ?? null;
}

export async function startPhysicalPreorderCheckout(
  input: PhysicalPreorderRequest
): Promise<{ checkoutUrl: string; reference: string }> {
  const bookTitle = getBookTitle(input.bookSlug);
  if (!bookTitle) {
    throw new Error("Book not found");
  }

  if (!PHYSICAL_BOOK_FORMATS[input.format]) {
    throw new Error("Invalid format");
  }

  const quantity = Math.min(Math.max(Math.floor(input.quantity), 1), 20);
  const pricing = calculatePhysicalOrderTotalKobo(input.format, quantity);

  const order = await createPendingPhysicalPreorder({
    customerName: input.name,
    customerEmail: input.email,
    customerPhone: input.phone,
    bookSlug: input.bookSlug,
    bookTitle,
    format: input.format,
    quantity,
    unitPriceNgnKobo: pricing.unitPriceNgnKobo,
    shippingNgnKobo: pricing.shippingNgnKobo,
    totalNgnKobo: pricing.totalNgnKobo,
    streetAddress: input.streetAddress,
    city: input.city,
    state: input.state,
    country: PHYSICAL_SHIP_COUNTRY,
  });

  const siteUrl = getSiteUrl();
  const init = await initializeKorapayCharge({
    amount: order.total_ngn_kobo,
    currency: "NGN",
    reference: order.payment_reference,
    redirect_url: `${siteUrl}/preorder/success`,
    notification_url: `${siteUrl}/api/webhooks/korapay`,
    narration: `Physical book: ${bookTitle.slice(0, 80)}`,
    customer: {
      email: input.email,
      name: input.name,
    },
    metadata: {
      order_type: "physical",
      book_slug: input.bookSlug,
    },
    channels: ["bank_transfer", "card", "pay_with_bank"],
  });

  return {
    checkoutUrl: init.data!.checkout_url,
    reference: order.payment_reference,
  };
}

export async function fulfillPaidPhysicalPreorder(
  paymentReference: string,
  korapayReference: string
): Promise<{ fulfilled: boolean; reason?: string }> {
  const order = await getPhysicalPreorderByPaymentReference(paymentReference);
  if (!order) {
    return { fulfilled: false, reason: "order_not_found" };
  }

  if (order.payment_status === "paid" && order.payment_verified) {
    return { fulfilled: false, reason: "already_fulfilled" };
  }

  const verification = await verifyKorapayCharge(korapayReference);
  const charge = verification.data;

  if (!charge || charge.status !== "success") {
    await markPhysicalPreorderFailed({
      orderId: order.id,
      korapayReference,
    });
    return { fulfilled: false, reason: "payment_not_successful" };
  }

  const paidKobo = Math.round(parseFloat(charge.amount_paid || "0") * 100);
  if (paidKobo < order.total_ngn_kobo) {
    await markPhysicalPreorderFailed({
      orderId: order.id,
      korapayReference,
    });
    return { fulfilled: false, reason: "underpaid" };
  }

  const paidOrder = await markPhysicalPreorderPaid({
    orderId: order.id,
    korapayReference,
  });

  if (!paidOrder.confirmation_sent || !paidOrder.admin_notified) {
    await sendPhysicalPreorderEmails(paidOrder);
    await markPhysicalPreorderEmailsSent(paidOrder.id);
  }

  return { fulfilled: true };
}

export async function processPhysicalPreorderWebhook(input: {
  event: string;
  data: {
    reference?: string;
    payment_reference?: string;
    status?: string;
  };
}): Promise<{ ok: boolean; reason?: string }> {
  await logWebhookEvent({
    eventType: input.event,
    paymentReference:
      input.data.payment_reference ?? input.data.reference ?? undefined,
    payload: { ...input, order_type: "physical" },
    status: "received",
  });

  if (input.event !== "charge.success") {
    await logWebhookEvent({
      eventType: input.event,
      paymentReference:
        input.data.payment_reference ?? input.data.reference ?? undefined,
      payload: input,
      status: "ignored",
    });
    return { ok: true, reason: "ignored_event" };
  }

  const merchantReference =
    input.data.payment_reference ?? input.data.reference;
  const korapayReference = input.data.reference;

  if (!merchantReference || !korapayReference) {
    await logWebhookEvent({
      eventType: input.event,
      payload: input,
      status: "failed",
      errorMessage: "missing_reference",
    });
    return { ok: false, reason: "missing_reference" };
  }

  try {
    const result = await fulfillPaidPhysicalPreorder(
      merchantReference,
      korapayReference
    );
    await logWebhookEvent({
      eventType: input.event,
      paymentReference: merchantReference,
      payload: input,
      status: result.fulfilled ? "processed" : "ignored",
      errorMessage: result.reason,
    });
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "physical_fulfillment_failed";
    await logWebhookEvent({
      eventType: input.event,
      paymentReference: merchantReference,
      payload: input,
      status: "failed",
      errorMessage: message,
    });
    throw error;
  }
}

export async function verifyPhysicalPreorderReturn(reference: string): Promise<{
  status: "paid" | "pending" | "failed" | "unknown";
}> {
  if (!isPhysicalPaymentReference(reference)) {
    return { status: "unknown" };
  }

  const order = await getPhysicalPreorderByPaymentReference(reference);
  if (!order) {
    return { status: "unknown" };
  }

  if (order.payment_status === "paid") {
    return { status: "paid" };
  }

  try {
    const verification = await verifyKorapayCharge(reference);
    if (verification.data?.status === "success") {
      await fulfillPaidPhysicalPreorder(reference, verification.data.reference);
      return { status: "paid" };
    }
    if (
      verification.data?.status === "pending" ||
      verification.data?.status === "processing"
    ) {
      return { status: "pending" };
    }
    return { status: "failed" };
  } catch {
    return { status: "pending" };
  }
}

export function isValidPhysicalFormat(value: string): value is PhysicalBookFormat {
  return value === "hardback" || value === "softback";
}
