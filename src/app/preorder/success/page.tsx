import Link from "next/link";
import { verifyPhysicalPreorderReturn } from "@/lib/physical/checkout";
import { PHYSICAL_FULFILLMENT_DAYS } from "@/lib/physical/constants";
import { SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PreorderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  let status: "paid" | "pending" | "failed" | "unknown" = "unknown";

  if (reference) {
    try {
      const result = await verifyPhysicalPreorderReturn(reference);
      status = result.status;
    } catch {
      status = "pending";
    }
  }

  const title =
    status === "paid"
      ? "Pre-order confirmed"
      : status === "pending"
        ? "Payment processing"
        : "Checking payment status";

  const message =
    status === "paid"
      ? `Thank you. Your physical book pre-order is confirmed. Check your email for receipt and delivery details. We aim to fulfill within ${PHYSICAL_FULFILLMENT_DAYS} days.`
      : status === "pending"
        ? "We are waiting for Korapay to confirm your payment. You will receive an email once it is confirmed."
        : "If you completed payment, check your email shortly or contact hello@klarify.africa.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-10">
        <Link href="/" className="mb-10 inline-flex items-center gap-3">
          <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-10 w-auto" />
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
            Physical pre-order
          </p>
          <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
          <p className="mt-4 text-muted leading-relaxed">{message}</p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex justify-center rounded-xl bg-emerald-500 px-5 py-3.5 font-medium text-[#041008] transition hover:bg-emerald-400"
            >
              Back to book site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
