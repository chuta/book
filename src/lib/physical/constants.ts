export const PHYSICAL_BOOK_FORMATS = {
  hardback: {
    label: "Hardback",
    priceNgnKobo: 4_500_000,
  },
  softback: {
    label: "Softback",
    priceNgnKobo: 3_500_000,
  },
} as const;

export type PhysicalBookFormat = keyof typeof PHYSICAL_BOOK_FORMATS;

export const PHYSICAL_SHIPPING_NGN_KOBO = 1_000_000;

export const PHYSICAL_FULFILLMENT_DAYS = 14;

export const PHYSICAL_SHIP_COUNTRY = "Nigeria";

export function calculatePhysicalOrderTotalKobo(
  format: PhysicalBookFormat,
  quantity: number
): {
  unitPriceNgnKobo: number;
  shippingNgnKobo: number;
  totalNgnKobo: number;
} {
  const unitPriceNgnKobo = PHYSICAL_BOOK_FORMATS[format].priceNgnKobo;
  const shippingNgnKobo = PHYSICAL_SHIPPING_NGN_KOBO;
  const totalNgnKobo = unitPriceNgnKobo * quantity + shippingNgnKobo;

  return { unitPriceNgnKobo, shippingNgnKobo, totalNgnKobo };
}

export function formatNgnFromKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}
