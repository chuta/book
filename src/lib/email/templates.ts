import {
  BOOK_PURCHASE,
  KLARIFY_LOGO_URL,
  LAUNCH_EVENT,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import type { RegistrationPayload } from "./types";
import { REGISTRATION_LABELS } from "./types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Klarify</title>
</head>
<body style="margin:0;padding:0;background:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050508;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#0c0c12;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 16px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <a href="https://klarify.africa" style="text-decoration:none;">
                <img
                  src="${KLARIFY_LOGO_URL}"
                  alt="Klarify"
                  width="100"
                  height="28"
                  style="display:block;border:0;outline:none;height:auto;max-width:100px;width:100px;"
                />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#f4f4f5;font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.08);color:#a1a1aa;font-size:12px;line-height:1.6;">
              <p style="margin:0 0 8px;">Klarify · Compliance OS for African fintech &amp; digital assets</p>
              <p style="margin:0;"><a href="${SITE_URL}" style="color:#10b981;text-decoration:none;">book.klarify.africa</a> · <a href="https://klarify.africa" style="color:#10b981;text-decoration:none;">klarify.africa</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function fieldRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#a1a1aa;font-size:13px;width:120px;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f4f4f5;font-size:14px;">${escapeHtml(value)}</td>
  </tr>`;
}

function purchaseLinksHtml(): string {
  return `<p style="margin:24px 0 8px;font-size:14px;color:#a1a1aa;">Get the book:</p>
  <p style="margin:0 0 8px;"><a href="${BOOK_PURCHASE.nigeria.url}" style="color:#10b981;text-decoration:none;">Buy in Nigeria (Naira)</a></p>
  <p style="margin:0;"><a href="${BOOK_PURCHASE.international.url}" style="color:#10b981;text-decoration:none;">Buy Internationally (USD)</a></p>`;
}

export function adminNotificationEmail(data: RegistrationPayload, registrationId: string) {
  const label = REGISTRATION_LABELS[data.type];
  const subject = `[Book Landing] New ${label}: ${data.name}`;

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#ffffff;">New registration</h1>
    <p style="margin:0 0 24px;color:#a1a1aa;">A new submission arrived on <strong style="color:#f4f4f5;">book.klarify.africa</strong>.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
      ${fieldRow("Type", label)}
      ${fieldRow("Name", data.name)}
      ${fieldRow("Email", data.email)}
      ${fieldRow("Organization", data.organization || "—")}
      ${fieldRow("Role", data.role)}
      ${fieldRow("Country", data.country)}
      ${fieldRow("Registration ID", registrationId)}
    </table>
    <p style="margin:0;color:#a1a1aa;font-size:13px;">Reply directly to this registrant from your inbox, or follow up from hello@klarify.africa.</p>
  `);

  const text = [
    `New registration — ${label}`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Organization: ${data.organization || "—"}`,
    `Role: ${data.role}`,
    `Country: ${data.country}`,
    `Registration ID: ${registrationId}`,
  ].join("\n");

  return { subject, html, text };
}

export function userConfirmationEmail(data: RegistrationPayload) {
  const firstName = data.name.split(" ")[0] || data.name;
  const label = REGISTRATION_LABELS[data.type];

  if (data.type === "launch") {
    const subject = `You're registered — ${LAUNCH_EVENT.title}`;

    const html = layout(`
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">You're on the list, ${escapeHtml(firstName)}.</h1>
      <p style="margin:0 0 20px;color:#a1a1aa;">Thank you for registering for the virtual launch of <strong style="color:#f4f4f5;">${escapeHtml(SITE_NAME)}</strong>.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;margin-bottom:24px;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#10b981;">Event details</p>
            <p style="margin:0 0 6px;color:#ffffff;font-size:16px;font-weight:600;">${escapeHtml(LAUNCH_EVENT.date)}</p>
            <p style="margin:0 0 6px;color:#f4f4f5;">${escapeHtml(LAUNCH_EVENT.time)} · ${escapeHtml(LAUNCH_EVENT.venue)}</p>
            <p style="margin:0;color:#a1a1aa;font-size:14px;">We'll send joining details closer to the date.</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;color:#f4f4f5;">Can't wait? You can get the book now:</p>
      ${purchaseLinksHtml()}
      <p style="margin:24px 0 0;color:#a1a1aa;font-size:14px;">Questions? Reply to this email — we're at hello@klarify.africa.</p>
    `);

    const text = [
      `Hi ${firstName},`,
      "",
      `You're registered for the virtual launch of ${SITE_NAME}.`,
      "",
      `Date: ${LAUNCH_EVENT.date}`,
      `Time: ${LAUNCH_EVENT.time}`,
      `Venue: ${LAUNCH_EVENT.venue}`,
      "",
      "We'll send joining details closer to the date.",
      "",
      `Nigeria: ${BOOK_PURCHASE.nigeria.url}`,
      `International: ${BOOK_PURCHASE.international.url}`,
      "",
      "Questions? hello@klarify.africa",
    ].join("\n");

    return { subject, html, text };
  }

  const subject = `Thanks for your interest — ${label}`;

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">Thank you, ${escapeHtml(firstName)}.</h1>
    <p style="margin:0 0 20px;color:#a1a1aa;">We've received your ${escapeHtml(label.toLowerCase())} request and will keep you updated.</p>
    ${purchaseLinksHtml()}
    <p style="margin:24px 0 0;color:#a1a1aa;font-size:14px;">Reply to this email anytime at hello@klarify.africa.</p>
  `);

  const text = [
    `Hi ${firstName},`,
    "",
    `We've received your ${label.toLowerCase()} request.`,
    "",
    `Nigeria: ${BOOK_PURCHASE.nigeria.url}`,
    `International: ${BOOK_PURCHASE.international.url}`,
  ].join("\n");

  return { subject, html, text };
}

export function launchFollowUpEmail(data: RegistrationPayload, variant: "followup-7d" | "followup-1d") {
  const firstName = data.name.split(" ")[0] || data.name;
  const isFinal = variant === "followup-1d";

  const subject = isFinal
    ? `Tomorrow: Virtual Launch — ${LAUNCH_EVENT.date}`
    : `One week to go — Virtual Launch on ${LAUNCH_EVENT.date}`;

  const headline = isFinal
    ? `${escapeHtml(firstName)}, the launch is tomorrow.`
    : `${escapeHtml(firstName)}, one week until the launch.`;

  const bodyCopy = isFinal
    ? "This is your final reminder for the virtual launch. We'll share the joining link shortly — keep an eye on your inbox."
    : "The virtual launch is one week away. Mark your calendar and get ready for a conversation on regulatory readiness across African markets.";

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">${headline}</h1>
    <p style="margin:0 0 20px;color:#a1a1aa;">${bodyCopy}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#10b981;">Virtual launch</p>
          <p style="margin:0 0 6px;color:#ffffff;font-size:16px;font-weight:600;">${escapeHtml(LAUNCH_EVENT.date)}</p>
          <p style="margin:0;color:#f4f4f5;">${escapeHtml(LAUNCH_EVENT.time)} · ${escapeHtml(LAUNCH_EVENT.venue)}</p>
        </td>
      </tr>
    </table>
    ${purchaseLinksHtml()}
  `);

  const text = [
    `Hi ${firstName},`,
    "",
    bodyCopy,
    "",
    `${LAUNCH_EVENT.date} · ${LAUNCH_EVENT.time} · ${LAUNCH_EVENT.venue}`,
    "",
    `Nigeria: ${BOOK_PURCHASE.nigeria.url}`,
    `International: ${BOOK_PURCHASE.international.url}`,
  ].join("\n");

  return { subject, html, text };
}

export function purchaseSuccessEmail(input: {
  name?: string | null;
  productTitle?: string;
  libraryUrl: string;
  magicLink?: string | null;
}) {
  const firstName = input.name?.split(" ")[0] || "there";
  const title = input.productTitle || SITE_NAME;
  const subject = "Your Klarify Library access is ready";

  const loginBlock = input.magicLink
    ? `<p style="margin:0 0 16px;"><a href="${escapeHtml(input.magicLink)}" style="display:inline-block;background:#10b981;color:#041008;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;">Sign in to your library</a></p>
       <p style="margin:0 0 24px;color:#a1a1aa;font-size:13px;">This secure link expires soon. You can always request a new one from the login page.</p>`
    : `<p style="margin:0 0 24px;color:#a1a1aa;font-size:14px;">Visit the library and sign in with this email address to access your downloads.</p>`;

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">Payment confirmed, ${escapeHtml(firstName)}.</h1>
    <p style="margin:0 0 20px;color:#a1a1aa;">Your purchase of <strong style="color:#f4f4f5;">${escapeHtml(title)}</strong> is ready in your personal library.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#10b981;">Included formats</p>
          <p style="margin:0;color:#f4f4f5;">PDF · Full pack (Mac .app + Windows .EXE in ZIP)</p>
        </td>
      </tr>
    </table>
    ${loginBlock}
    <p style="margin:0 0 16px;"><a href="${escapeHtml(input.libraryUrl)}" style="color:#10b981;text-decoration:none;">Open your library →</a></p>
    <p style="margin:0;color:#a1a1aa;font-size:14px;">Questions? Reply to this email at hello@klarify.africa.</p>
  `);

  const text = [
    `Hi ${firstName},`,
    "",
    `Your purchase of ${title} is ready.`,
    "",
    `Library: ${input.libraryUrl}`,
    input.magicLink ? `Sign in: ${input.magicLink}` : "",
    "",
    "Included: PDF and full pack (Mac .app + Windows .EXE in ZIP).",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

function formatNgnEmail(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export function physicalPreorderCustomerEmail(input: {
  name: string;
  orderId: string;
  bookTitle: string;
  formatLabel: string;
  quantity: number;
  unitPriceKobo: number;
  shippingKobo: number;
  totalKobo: number;
  streetAddress: string;
  city: string;
  state: string;
  fulfillmentDays: number;
}) {
  const firstName = input.name.split(" ")[0] || input.name;
  const subject = "Physical book pre-order confirmed";

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">Pre-order confirmed, ${escapeHtml(firstName)}.</h1>
    <p style="margin:0 0 20px;color:#a1a1aa;">Thank you for your payment. We have received your physical book pre-order and will begin processing it shortly.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
      ${fieldRow("Order ID", input.orderId)}
      ${fieldRow("Book", input.bookTitle)}
      ${fieldRow("Format", input.formatLabel)}
      ${fieldRow("Quantity", String(input.quantity))}
      ${fieldRow("Unit price", formatNgnEmail(input.unitPriceKobo))}
      ${fieldRow("Shipping (Nigeria)", formatNgnEmail(input.shippingKobo))}
      ${fieldRow("Total paid", formatNgnEmail(input.totalKobo))}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#10b981;">Delivery address</p>
          <p style="margin:0;color:#f4f4f5;line-height:1.6;">${escapeHtml(input.streetAddress)}<br/>${escapeHtml(input.city)}, ${escapeHtml(input.state)}<br/>Nigeria</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;color:#f4f4f5;">Expected fulfillment: within <strong>${input.fulfillmentDays} days</strong> of payment confirmation.</p>
    <p style="margin:0;color:#a1a1aa;font-size:14px;">We will email you when your order ships. Questions? Reply to hello@klarify.africa.</p>
  `);

  const text = [
    `Hi ${firstName},`,
    "",
    "Your physical book pre-order is confirmed.",
    "",
    `Order ID: ${input.orderId}`,
    `Book: ${input.bookTitle}`,
    `Format: ${input.formatLabel}`,
    `Quantity: ${input.quantity}`,
    `Total: ${formatNgnEmail(input.totalKobo)}`,
    "",
    `Delivery: ${input.streetAddress}, ${input.city}, ${input.state}, Nigeria`,
    "",
    `Expected fulfillment within ${input.fulfillmentDays} days.`,
  ].join("\n");

  return { subject, html, text };
}

export function physicalPreorderAdminEmail(input: {
  name: string;
  email: string;
  phone: string;
  orderId: string;
  paymentReference: string;
  bookTitle: string;
  formatLabel: string;
  quantity: number;
  totalKobo: number;
  streetAddress: string;
  city: string;
  state: string;
}) {
  const subject = `[Physical Pre-Order] ${input.name} — ${input.bookTitle}`;

  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#ffffff;">New paid physical pre-order</h1>
    <p style="margin:0 0 24px;color:#a1a1aa;">A customer completed payment for a hard copy pre-order on <strong style="color:#f4f4f5;">book.klarify.africa</strong>.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
      ${fieldRow("Order ID", input.orderId)}
      ${fieldRow("Payment ref", input.paymentReference)}
      ${fieldRow("Name", input.name)}
      ${fieldRow("Email", input.email)}
      ${fieldRow("Phone", input.phone)}
      ${fieldRow("Book", input.bookTitle)}
      ${fieldRow("Format", input.formatLabel)}
      ${fieldRow("Quantity", String(input.quantity))}
      ${fieldRow("Total paid", formatNgnEmail(input.totalKobo))}
      ${fieldRow("Address", `${input.streetAddress}, ${input.city}, ${input.state}, Nigeria`)}
    </table>
    <p style="margin:0;color:#a1a1aa;font-size:13px;">Update fulfillment status in Supabase: book_physical_preorders.</p>
  `);

  const text = [
    "New paid physical pre-order",
    "",
    `Order ID: ${input.orderId}`,
    `Payment ref: ${input.paymentReference}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Book: ${input.bookTitle} (${input.formatLabel}) x${input.quantity}`,
    `Total: ${formatNgnEmail(input.totalKobo)}`,
    `Address: ${input.streetAddress}, ${input.city}, ${input.state}, Nigeria`,
  ].join("\n");

  return { subject, html, text };
}
