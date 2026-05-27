"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatNgnFromKobo } from "@/lib/commerce/constants";
import { BOOK_PURCHASE, SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";

type ProductPreview = {
  title: string;
  description: string | null;
  price_ngn_kobo: number;
  slug: string;
};

export function CheckoutForm({ product }: { product: ProductPreview }) {
  const params = useParams();
  const slug = (params.slug as string) || product.slug;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: slug,
          email,
          name: name || undefined,
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-10">
        <Link href="/" className="mb-10 inline-flex items-center gap-3">
          <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-10 w-auto" />
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
            Secure checkout · NGN only
          </p>
          <h1 className="mt-3 text-2xl font-semibold leading-snug">{product.title}</h1>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            {product.description}
          </p>
          <p className="mt-6 text-3xl font-semibold text-white">
            {formatNgnFromKobo(product.price_ngn_kobo)}
          </p>
          <p className="mt-2 text-sm text-muted">
            Includes PDF and full pack (Mac .app + Windows .EXE in ZIP).
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-muted">
                Email for your library access
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground outline-none focus:border-emerald-500/40"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="name" className="mb-2 block text-sm text-muted">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground outline-none focus:border-emerald-500/40"
                placeholder="Your name"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-medium text-[#041008] transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Redirecting to Korapay…" : "Pay with Korapay (NGN)"}
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Also available on
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href={BOOK_PURCHASE.nigeria.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Selar (Nigeria)
              </a>
              <a
                href={BOOK_PURCHASE.international.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Gumroad (International / USD)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
