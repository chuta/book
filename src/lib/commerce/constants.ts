export const LIBRARY_BUCKET = "klarify-library";

export const SIGNED_URL_TTL_SECONDS = 60;

export const BOOK_PRODUCT_SLUGS = {
  foundersGuide: "founders-guide",
  seizingOpportunities: "seizing-opportunities",
} as const;

export type BookProductSlug =
  (typeof BOOK_PRODUCT_SLUGS)[keyof typeof BOOK_PRODUCT_SLUGS];

export const FLIPBOOK_PREVIEW = {
  [BOOK_PRODUCT_SLUGS.foundersGuide]: {
    maxPage: 20,
    purchasePath: "/checkout/founders-guide",
  },
  [BOOK_PRODUCT_SLUGS.seizingOpportunities]: {
    maxPage: 20,
    purchasePath: "/checkout/seizing-opportunities",
  },
} as const;

export function formatNgnFromKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}
