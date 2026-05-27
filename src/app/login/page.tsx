"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";
import { SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isSupabaseBrowserConfigured()) {
      setError("Library sign-in is not configured yet.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://book.klarify.africa";

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/library`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-10">
        <Link href="/" className="mb-10 inline-flex items-center gap-3">
          <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-10 w-auto" />
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
            Klarify Library
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Sign in to your library</h1>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Use the email from your purchase. We will send a secure magic link — no password required.
          </p>

          {sent ? (
            <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200">
              Check your inbox for a sign-in link. It may take a minute to arrive.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-muted">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-emerald-500/40"
                  placeholder="you@company.com"
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
                {loading ? "Sending link…" : "Email me a sign-in link"}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-muted">
            Haven&apos;t purchased yet?{" "}
            <Link href="/#author" className="text-emerald-400 hover:underline">
              Get the book
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
