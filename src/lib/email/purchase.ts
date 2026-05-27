import { SITE_URL } from "@/lib/constants";
import { purchaseSuccessEmail } from "@/lib/email/templates";
import { getEmailConfig, getResend, isResendConfigured } from "@/lib/email/resend";

export async function sendPurchaseSuccessEmail(input: {
  email: string;
  name?: string | null;
  productTitle?: string;
  magicLink?: string | null;
}): Promise<boolean> {
  if (!isResendConfigured()) {
    console.warn("[Email] Resend not configured — skipping purchase email");
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || SITE_URL;
  const { subject, html, text } = purchaseSuccessEmail({
    name: input.name,
    productTitle: input.productTitle,
    libraryUrl: `${siteUrl}/library`,
    magicLink: input.magicLink,
  });

  const resend = getResend();
  const { from, replyTo } = getEmailConfig();

  const { error } = await resend.emails.send({
    from,
    to: input.email,
    replyTo,
    subject,
    html,
    text,
  });

  if (error) {
    console.warn("[Email] Purchase success email failed:", error.message);
    return false;
  }

  return true;
}
