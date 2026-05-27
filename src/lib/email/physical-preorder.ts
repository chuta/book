import {
  physicalPreorderAdminEmail,
  physicalPreorderCustomerEmail,
} from "@/lib/email/templates";
import { getEmailConfig, getResend, isResendConfigured } from "@/lib/email/resend";
import {
  PHYSICAL_BOOK_FORMATS,
  PHYSICAL_FULFILLMENT_DAYS,
} from "@/lib/physical/constants";
import type { PhysicalPreorder } from "@/lib/physical/types";

export async function sendPhysicalPreorderEmails(
  order: PhysicalPreorder
): Promise<void> {
  if (!isResendConfigured()) {
    console.warn("[Email] Resend not configured — skipping physical pre-order emails");
    return;
  }

  const resend = getResend();
  const { from, replyTo, adminEmail } = getEmailConfig();
  const formatLabel = PHYSICAL_BOOK_FORMATS[order.format].label;

  const customer = physicalPreorderCustomerEmail({
    name: order.customer_name,
    orderId: order.id,
    bookTitle: order.book_title,
    formatLabel,
    quantity: order.quantity,
    unitPriceKobo: order.unit_price_ngn_kobo,
    shippingKobo: order.shipping_ngn_kobo,
    totalKobo: order.total_ngn_kobo,
    streetAddress: order.street_address,
    city: order.city,
    state: order.state,
    fulfillmentDays: PHYSICAL_FULFILLMENT_DAYS,
  });

  const admin = physicalPreorderAdminEmail({
    name: order.customer_name,
    email: order.customer_email,
    phone: order.customer_phone,
    orderId: order.id,
    paymentReference: order.payment_reference,
    bookTitle: order.book_title,
    formatLabel,
    quantity: order.quantity,
    totalKobo: order.total_ngn_kobo,
    streetAddress: order.street_address,
    city: order.city,
    state: order.state,
  });

  const [customerResult, adminResult] = await Promise.all([
    resend.emails.send({
      from,
      to: order.customer_email,
      replyTo,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    }),
    resend.emails.send({
      from,
      to: adminEmail,
      replyTo: order.customer_email,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    }),
  ]);

  if (customerResult.error) {
    console.warn("[Email] Physical pre-order customer email failed:", customerResult.error.message);
  }

  if (adminResult.error) {
    console.warn("[Email] Physical pre-order admin email failed:", adminResult.error.message);
  }
}
