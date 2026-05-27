"use client";

import { motion } from "framer-motion";
import { BOOK_PURCHASE, BOOK_PRODUCT_SLUGS } from "@/lib/constants";
import { trackCTA } from "@/lib/analytics";

type BookPurchaseLayout = "inline" | "stacked" | "cards";
type BookPurchaseAlign = "left" | "center";

interface BookPurchaseCTAProps {
  location: string;
  layout?: BookPurchaseLayout;
  align?: BookPurchaseAlign;
  showLabel?: boolean;
  productSlug?: string;
}

interface PurchaseOptionProps {
  href: string;
  label: string;
  description: string;
  currency: string;
  location: string;
  variant: "korapay" | "nigeria" | "international";
  external?: boolean;
}

function PurchaseOption({
  href,
  label,
  description,
  currency,
  location,
  variant,
  external = true,
}: PurchaseOptionProps) {
  const trackingLabel =
    variant === "korapay"
      ? "Pay with Korapay"
      : variant === "nigeria"
        ? "Buy in Nigeria"
        : "Buy Internationally";

  const currencyClass =
    variant === "korapay"
      ? "bg-emerald-500/20 text-emerald-300"
      : variant === "nigeria"
        ? "bg-emerald-500/15 text-emerald-400"
        : "bg-gold/15 text-gold-light";

  return (
    <motion.a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => trackCTA(trackingLabel, location)}
      className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tracking-wide ${currencyClass}`}
      >
        {currency}
      </div>
      <div className="min-w-0 text-left">
        <p className="font-medium text-foreground group-hover:text-white transition-colors">
          {label}
        </p>
        <p className="text-xs text-muted mt-0.5 leading-snug">{description}</p>
      </div>
      <svg
        className="h-4 w-4 shrink-0 text-muted group-hover:text-emerald-400 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </motion.a>
  );
}

export function BookPurchaseCTA({
  location,
  layout = "cards",
  align = "left",
  showLabel = true,
  productSlug = BOOK_PRODUCT_SLUGS.foundersGuide,
}: BookPurchaseCTAProps) {
  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const optionsClass =
    align === "center"
      ? "mx-auto flex w-full max-w-xl flex-col gap-3 sm:gap-4"
      : "flex w-full max-w-xl flex-col gap-3 sm:gap-4";

  const options = (
    <>
      <PurchaseOption
        href={BOOK_PURCHASE.korapay.checkoutPath(productSlug)}
        label={BOOK_PURCHASE.korapay.label}
        description={BOOK_PURCHASE.korapay.description}
        currency={BOOK_PURCHASE.korapay.currency}
        location={location}
        variant="korapay"
        external={false}
      />
      <PurchaseOption
        href={BOOK_PURCHASE.nigeria.url}
        label={BOOK_PURCHASE.nigeria.label}
        description={BOOK_PURCHASE.nigeria.description}
        currency={BOOK_PURCHASE.nigeria.currency}
        location={location}
        variant="nigeria"
      />
      <PurchaseOption
        href={BOOK_PURCHASE.international.url}
        label={BOOK_PURCHASE.international.label}
        description={BOOK_PURCHASE.international.description}
        currency={BOOK_PURCHASE.international.currency}
        location={location}
        variant="international"
      />
    </>
  );

  return (
    <div className={`flex flex-col gap-4 w-full ${alignClass}`}>
      {showLabel && (
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Get the Book
        </p>
      )}

      {layout === "cards" && (
        <div className={optionsClass}>{options}</div>
      )}

      {layout === "inline" && (
        <div
          className={`${optionsClass} xl:max-w-none xl:flex-row xl:gap-4`}
        >
          {options}
        </div>
      )}

      {layout === "stacked" && (
        <div className={optionsClass}>{options}</div>
      )}
    </div>
  );
}
