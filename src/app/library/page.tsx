import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserPurchases } from "@/lib/db/commerce";
import {
  createSupabaseServerClient,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/browser-server";
import { SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  if (!isSupabaseAuthConfigured()) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/library");
  }

  let purchases: Awaited<ReturnType<typeof getUserPurchases>> = [];
  try {
    purchases = await getUserPurchases(user.id);
  } catch {
    purchases = [];
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted sm:inline">{user.email}</span>
            <Link href="/login" className="text-muted hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
          Your library
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Purchased books</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Download your PDF and full pack (Mac .app + Windows .EXE in ZIP). Links expire after 60 seconds for security — click again anytime.
        </p>

        {purchases.length === 0 ? (
          <div className="mt-12 glass-card rounded-2xl p-8 text-center">
            <p className="text-muted">No purchases yet for this account.</p>
            <Link
              href="/checkout/founders-guide"
              className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-medium text-[#041008] hover:bg-emerald-400"
            >
              Buy the Founder&apos;s Guide
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {purchases.map((purchase) => (
              <article key={purchase.id} className="glass-card overflow-hidden rounded-2xl">
                <div className="flex gap-5 p-6">
                  {purchase.product.cover_image && (
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <Image
                        src={purchase.product.cover_image}
                        alt={purchase.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-lg font-medium leading-snug">
                      {purchase.product.title}
                    </h2>
                    <p className="mt-2 text-xs text-muted">
                      Purchased{" "}
                      {new Date(purchase.created_at).toLocaleDateString("en-NG", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 px-6 py-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
                    Downloads
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {purchase.assets.map((asset) => (
                      <a
                        key={asset.id}
                        href={`/api/download/${purchase.product_id}?asset=${asset.asset_type}`}
                        className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm transition hover:border-emerald-500/30 hover:text-emerald-400"
                      >
                        {asset.label}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
