export type BookProduct = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_ngn_kobo: number;
  cover_image: string | null;
  flipbook_path: string | null;
  preview_max_page: number;
  active: boolean;
};

export type BookProductAsset = {
  id: string;
  product_id: string;
  asset_type: "pdf" | "zip" | "epub";
  label: string;
  storage_path: string;
  file_name: string;
  sort_order: number;
};

export type BookOrder = {
  id: string;
  user_id: string | null;
  product_id: string;
  customer_email: string;
  customer_name: string | null;
  payment_reference: string;
  korapay_reference: string | null;
  amount_ngn_kobo: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  payment_verified: boolean;
};

export type BookPurchaseWithProduct = {
  id: string;
  product_id: string;
  download_count: number;
  last_downloaded_at: string | null;
  created_at: string;
  product: Pick<
    BookProduct,
    "id" | "title" | "slug" | "cover_image" | "description"
  >;
  assets: Pick<
    BookProductAsset,
    "id" | "asset_type" | "label" | "file_name" | "sort_order"
  >[];
};

export type CheckoutRequest = {
  productSlug: string;
  email: string;
  name?: string;
};
