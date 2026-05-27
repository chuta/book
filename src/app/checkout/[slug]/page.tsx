import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import { getProductBySlug } from "@/lib/db/commerce";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      notFound();
    }

    return <CheckoutForm product={product} />;
  } catch {
    notFound();
  }
}
