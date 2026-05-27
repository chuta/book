import { initializeKorapayCharge, verifyKorapayCharge } from "@/lib/korapay/client";
import {
  createPendingOrder,
  createPurchaseEntitlement,
  ensureUserForEmail,
  generateMagicLink,
  getOrderByPaymentReference,
  getProductById,
  getProductBySlug,
  logWebhookEvent,
  updateOrderAfterVerification,
} from "@/lib/db/commerce";
import { sendPurchaseSuccessEmail } from "@/lib/email/purchase";

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://book.klarify.africa"
  );
}

export async function startCheckout(input: {
  productSlug: string;
  email: string;
  name?: string;
}): Promise<{ checkoutUrl: string; reference: string }> {
  const product = await getProductBySlug(input.productSlug);
  if (!product) {
    throw new Error("Product not found");
  }

  const order = await createPendingOrder({
    productId: product.id,
    customerEmail: input.email,
    customerName: input.name,
    amountNgnKobo: product.price_ngn_kobo,
  });

  const siteUrl = getSiteUrl();
  const init = await initializeKorapayCharge({
    amount: product.price_ngn_kobo,
    currency: "NGN",
    reference: order.payment_reference,
    redirect_url: `${siteUrl}/checkout/success`,
    notification_url: `${siteUrl}/api/webhooks/korapay`,
    narration: product.title.slice(0, 120),
    customer: {
      email: input.email,
      name: input.name,
    },
    metadata: {
      order_id: order.id,
      product_slug: product.slug,
    },
    channels: ["bank_transfer", "card", "pay_with_bank"],
  });

  return {
    checkoutUrl: init.data!.checkout_url,
    reference: order.payment_reference,
  };
}

export async function fulfillPaidOrder(
  paymentReference: string,
  korapayReference: string
): Promise<{ fulfilled: boolean; reason?: string }> {
  const order = await getOrderByPaymentReference(paymentReference);
  if (!order) {
    return { fulfilled: false, reason: "order_not_found" };
  }

  if (order.status === "paid" && order.payment_verified) {
    return { fulfilled: false, reason: "already_fulfilled" };
  }

  const verification = await verifyKorapayCharge(korapayReference);
  const charge = verification.data;

  if (!charge || charge.status !== "success") {
    await updateOrderAfterVerification({
      orderId: order.id,
      korapayReference,
      status: "failed",
    });
    return { fulfilled: false, reason: "payment_not_successful" };
  }

  const paidKobo = Math.round(parseFloat(charge.amount_paid || "0") * 100);
  if (paidKobo < order.amount_ngn_kobo) {
    await updateOrderAfterVerification({
      orderId: order.id,
      korapayReference,
      status: "failed",
    });
    return { fulfilled: false, reason: "underpaid" };
  }

  const { userId, isNewUser } = await ensureUserForEmail({
    email: order.customer_email,
    fullName: order.customer_name ?? undefined,
  });

  await updateOrderAfterVerification({
    orderId: order.id,
    korapayReference,
    status: "paid",
    userId,
  });

  const created = await createPurchaseEntitlement({
    userId,
    productId: order.product_id,
    orderId: order.id,
  });

  if (created || isNewUser) {
    const magicLink = await generateMagicLink(order.customer_email);
    const product = await getProductById(order.product_id);

    await sendPurchaseSuccessEmail({
      email: order.customer_email,
      name: order.customer_name,
      productTitle: product?.title,
      magicLink,
    });
  }

  return { fulfilled: true };
}

export async function processKorapayWebhook(input: {
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
    payload: input,
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
    const result = await fulfillPaidOrder(merchantReference, korapayReference);
    await logWebhookEvent({
      eventType: input.event,
      paymentReference: merchantReference,
      payload: input,
      status: result.fulfilled ? "processed" : "ignored",
      errorMessage: result.reason,
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "fulfillment_failed";
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

export async function verifyCheckoutReturn(reference: string): Promise<{
  status: "paid" | "pending" | "failed" | "unknown";
}> {
  const order = await getOrderByPaymentReference(reference);
  if (!order) {
    return { status: "unknown" };
  }

  if (order.status === "paid") {
    return { status: "paid" };
  }

  try {
    const verification = await verifyKorapayCharge(reference);
    if (verification.data?.status === "success") {
      await fulfillPaidOrder(reference, verification.data.reference);
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
