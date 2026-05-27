import { randomBytes } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { LIBRARY_BUCKET } from "@/lib/commerce/constants";
import type {
  BookOrder,
  BookProduct,
  BookProductAsset,
  BookPurchaseWithProduct,
} from "@/lib/commerce/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const TABLES = {
  products: "book_products",
  assets: "book_product_assets",
  orders: "book_orders",
  purchases: "book_purchases",
  downloadLogs: "book_download_logs",
  webhookEvents: "book_webhook_events",
  profiles: "book_profiles",
} as const;

export function createPaymentReference(): string {
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `KBOOK-${stamp}-${rand}`.toUpperCase();
}

export async function getProductBySlug(
  slug: string
): Promise<BookProduct | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLES.products)
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as BookProduct | null;
}

export async function getProductById(
  id: string
): Promise<BookProduct | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLES.products)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as BookProduct | null;
}

export async function createPendingOrder(input: {
  productId: string;
  customerEmail: string;
  customerName?: string;
  amountNgnKobo: number;
}): Promise<BookOrder> {
  const supabase = getSupabaseAdmin();
  const paymentReference = createPaymentReference();

  const { data, error } = await supabase
    .from(TABLES.orders)
    .insert({
      product_id: input.productId,
      customer_email: input.customerEmail.toLowerCase().trim(),
      customer_name: input.customerName?.trim() || null,
      payment_reference: paymentReference,
      amount_ngn_kobo: input.amountNgnKobo,
      currency: "NGN",
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create order");
  }

  return data as BookOrder;
}

export async function getOrderByPaymentReference(
  reference: string
): Promise<BookOrder | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLES.orders)
    .select("*")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as BookOrder | null;
}

export async function updateOrderAfterVerification(input: {
  orderId: string;
  korapayReference: string;
  status: "paid" | "failed";
  userId?: string | null;
}): Promise<BookOrder> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(TABLES.orders)
    .update({
      korapay_reference: input.korapayReference,
      status: input.status,
      payment_verified: input.status === "paid",
      user_id: input.userId ?? null,
    })
    .eq("id", input.orderId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update order");
  }

  return data as BookOrder;
}

export async function logWebhookEvent(input: {
  eventType?: string;
  paymentReference?: string;
  payload: unknown;
  status: "received" | "processed" | "ignored" | "failed";
  errorMessage?: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from(TABLES.webhookEvents).insert({
    provider: "korapay",
    event_type: input.eventType ?? null,
    payment_reference: input.paymentReference ?? null,
    payload: input.payload,
    status: input.status,
    error_message: input.errorMessage ?? null,
  });
}

async function findUserIdByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<string | null> {
  const normalized = email.toLowerCase().trim();

  const { data: profile } = await supabase
    .from(TABLES.profiles)
    .select("id")
    .eq("email", normalized)
    .maybeSingle();

  if (profile?.id) {
    return profile.id;
  }

  const { data: listData, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (error) {
    throw new Error(error.message);
  }

  const match = listData.users.find(
    (user) => user.email?.toLowerCase() === normalized
  );

  return match?.id ?? null;
}

export async function ensureUserForEmail(input: {
  email: string;
  fullName?: string;
}): Promise<{ userId: string; isNewUser: boolean }> {
  const supabase = getSupabaseAdmin();
  const email = input.email.toLowerCase().trim();
  const existingId = await findUserIdByEmail(supabase, email);

  if (existingId) {
    return { userId: existingId, isNewUser: false };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: input.fullName ? { full_name: input.fullName } : undefined,
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Failed to provision library account");
  }

  return { userId: data.user.id, isNewUser: true };
}

export async function createPurchaseEntitlement(input: {
  userId: string;
  productId: string;
  orderId: string;
}): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from(TABLES.purchases)
    .select("id")
    .eq("order_id", input.orderId)
    .maybeSingle();

  if (existing) {
    return false;
  }

  const { error } = await supabase.from(TABLES.purchases).insert({
    user_id: input.userId,
    product_id: input.productId,
    order_id: input.orderId,
  });

  if (error) {
    if (error.code === "23505") {
      return false;
    }
    throw new Error(error.message);
  }

  return true;
}

export async function getUserPurchases(
  userId: string
): Promise<BookPurchaseWithProduct[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(TABLES.purchases)
    .select(
      `
      id,
      product_id,
      download_count,
      last_downloaded_at,
      created_at,
      product:book_products (
        id,
        title,
        slug,
        cover_image,
        description
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rawPurchases = data ?? [];

  const purchases = rawPurchases.map((row) => {
    const product = Array.isArray(row.product) ? row.product[0] : row.product;
    return {
      id: row.id as string,
      product_id: row.product_id as string,
      download_count: row.download_count as number,
      last_downloaded_at: row.last_downloaded_at as string | null,
      created_at: row.created_at as string,
      product: product as BookPurchaseWithProduct["product"],
    };
  });

  if (purchases.length === 0) {
    return [];
  }

  const productIds = purchases.map((p) => p.product_id);
  const { data: assets, error: assetsError } = await supabase
    .from(TABLES.assets)
    .select("id, product_id, asset_type, label, file_name, sort_order")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  if (assetsError) {
    throw new Error(assetsError.message);
  }

  const assetsByProduct = new Map<string, BookPurchaseWithProduct["assets"]>();
  for (const asset of assets ?? []) {
    const row = asset as BookProductAsset & { product_id: string };
    const list = assetsByProduct.get(row.product_id) ?? [];
    list.push({
      id: row.id,
      asset_type: row.asset_type,
      label: row.label,
      file_name: row.file_name,
      sort_order: row.sort_order,
    });
    assetsByProduct.set(row.product_id, list);
  }

  return purchases.map((purchase) => ({
    ...purchase,
    product: purchase.product,
    assets: assetsByProduct.get(purchase.product_id) ?? [],
  }));
}

export async function userOwnsProduct(
  userId: string,
  productId: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLES.purchases)
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function getProductAsset(
  productId: string,
  assetType: string
): Promise<BookProductAsset | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLES.assets)
    .select("*")
    .eq("product_id", productId)
    .eq("asset_type", assetType)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as BookProductAsset | null;
}

export async function createSignedDownloadUrl(
  storagePath: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(LIBRARY_BUCKET)
    .createSignedUrl(storagePath, 60);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Failed to create download URL");
  }

  return data.signedUrl;
}

export async function logDownload(input: {
  userId: string;
  productId: string;
  assetId: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();

  await supabase.from(TABLES.downloadLogs).insert({
    user_id: input.userId,
    product_id: input.productId,
    asset_id: input.assetId,
    ip_address: input.ipAddress ?? null,
    user_agent: input.userAgent ?? null,
  });

  const { data: purchase } = await supabase
    .from(TABLES.purchases)
    .select("id, download_count")
    .eq("user_id", input.userId)
    .eq("product_id", input.productId)
    .maybeSingle();

  if (purchase) {
    await supabase
      .from(TABLES.purchases)
      .update({
        download_count: (purchase.download_count ?? 0) + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq("id", purchase.id);
  }
}

export async function generateMagicLink(email: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://book.klarify.africa";

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: email.toLowerCase().trim(),
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/library`,
    },
  });

  if (error || !data.properties?.action_link) {
    console.warn("[Auth] Magic link generation failed:", error?.message);
    return null;
  }

  return data.properties.action_link;
}
