import type { PhysicalBookFormat } from "@/lib/physical/constants";

export type PhysicalPreorder = {
  id: string;
  payment_reference: string;
  korapay_reference: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  book_slug: string;
  book_title: string;
  format: PhysicalBookFormat;
  quantity: number;
  unit_price_ngn_kobo: number;
  shipping_ngn_kobo: number;
  total_ngn_kobo: number;
  street_address: string;
  city: string;
  state: string;
  country: string;
  payment_status: "pending" | "paid" | "failed";
  fulfillment_status: "pending" | "processing" | "shipped" | "delivered";
  payment_verified: boolean;
  admin_notified: boolean;
  confirmation_sent: boolean;
};

export type PhysicalPreorderRequest = {
  bookSlug: string;
  format: PhysicalBookFormat;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
};
