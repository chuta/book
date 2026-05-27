"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AUTHOR, BOOK_PRODUCT_SLUGS, NIGERIAN_STATES } from "@/lib/constants";
import {
  calculatePhysicalOrderTotalKobo,
  formatNgnFromKobo,
  PHYSICAL_BOOK_FORMATS,
  PHYSICAL_FULFILLMENT_DAYS,
  PHYSICAL_SHIP_COUNTRY,
  PHYSICAL_SHIPPING_NGN_KOBO,
  type PhysicalBookFormat,
} from "@/lib/physical/constants";
import { trackCTA } from "@/lib/analytics";

interface PhysicalPreOrderModalProps {
  open: boolean;
  onClose: () => void;
  location: string;
}

type FormState = {
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

const initialForm: FormState = {
  bookSlug: BOOK_PRODUCT_SLUGS.foundersGuide,
  format: "hardback",
  quantity: 1,
  name: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
};

export function PhysicalPreOrderModal({
  open,
  onClose,
  location,
}: PhysicalPreOrderModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricing = useMemo(
    () => calculatePhysicalOrderTotalKobo(form.format, form.quantity),
    [form.format, form.quantity]
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/preorder/physical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookSlug: form.bookSlug,
          format: form.format,
          quantity: form.quantity,
          name: form.name,
          email: form.email,
          phone: form.phone,
          streetAddress: form.streetAddress,
          city: form.city,
          state: form.state,
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      trackCTA("Pre-Order Hard Copy Submit", location);
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pre-order failed.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none focus:border-emerald-500/40";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="physical-preorder-title"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
                  Physical book · Nigeria only
                </p>
                <h2
                  id="physical-preorder-title"
                  className="mt-2 text-2xl font-semibold leading-snug"
                >
                  Pre-order hard copy
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Pay now via Korapay. Delivery within {PHYSICAL_FULFILLMENT_DAYS} days
                  after payment confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm text-muted">Book</label>
                <select
                  value={form.bookSlug}
                  onChange={(e) => updateField("bookSlug", e.target.value)}
                  className={inputClass}
                  required
                >
                  {AUTHOR.books.map((book) => (
                    <option key={book.productSlug} value={book.productSlug}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm text-muted">Format</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(PHYSICAL_BOOK_FORMATS) as PhysicalBookFormat[]).map(
                    (formatKey) => (
                      <label
                        key={formatKey}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-4 transition ${
                          form.format === formatKey
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={formatKey}
                          checked={form.format === formatKey}
                          onChange={() => updateField("format", formatKey)}
                          className="accent-emerald-500"
                        />
                        <div>
                          <p className="font-medium">{PHYSICAL_BOOK_FORMATS[formatKey].label}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {formatNgnFromKobo(PHYSICAL_BOOK_FORMATS[formatKey].priceNgnKobo)} each
                          </p>
                        </div>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="quantity" className="block text-sm text-muted">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={20}
                  value={form.quantity}
                  onChange={(e) =>
                    updateField("quantity", Math.max(1, Number(e.target.value) || 1))
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 sm:col-span-2">
                  <label htmlFor="name" className="block text-sm text-muted">
                    Full name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="phone" className="block text-sm text-muted">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Delivery address ({PHYSICAL_SHIP_COUNTRY})</p>
                <input
                  placeholder="Street address"
                  value={form.streetAddress}
                  onChange={(e) => updateField("streetAddress", e.target.value)}
                  className={inputClass}
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={inputClass}
                    required
                  />
                  <select
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm">
                <div className="flex justify-between gap-4 text-muted">
                  <span>
                    {PHYSICAL_BOOK_FORMATS[form.format].label} × {form.quantity}
                  </span>
                  <span>
                    {formatNgnFromKobo(pricing.unitPriceNgnKobo * form.quantity)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-4 text-muted">
                  <span>Shipping (Nigeria)</span>
                  <span>{formatNgnFromKobo(PHYSICAL_SHIPPING_NGN_KOBO)}</span>
                </div>
                <div className="mt-3 flex justify-between gap-4 border-t border-white/10 pt-3 font-medium text-foreground">
                  <span>Total</span>
                  <span>{formatNgnFromKobo(pricing.totalNgnKobo)}</span>
                </div>
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
                {loading ? "Redirecting to Korapay…" : "Pay & pre-order"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
