"use client";

import { useState } from "react";
import { PhysicalPreOrderModal } from "@/components/commerce/PhysicalPreOrderModal";
import { trackCTA } from "@/lib/analytics";

interface PhysicalPreOrderCTAProps {
  location: string;
}

export function PhysicalPreOrderCTA({ location }: PhysicalPreOrderCTAProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-6 border-t border-white/10 pt-6">
        <h3 className="text-sm font-medium uppercase tracking-widest text-emerald-400 mb-4">
          Hard Copy
        </h3>
        <button
          type="button"
          onClick={() => {
            trackCTA("Pre-Order Hard Copy", location);
            setOpen(true);
          }}
          className="group flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground group-hover:text-emerald-400 transition-colors">
              Pre-Order Hard Copy
            </p>
            <p className="text-xs text-muted mt-1 leading-snug">
              Hardback ₦45,000 · Softback ₦35,000 · + ₦10,000 shipping (Nigeria)
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-emerald-400">Order →</span>
        </button>
      </div>

      <PhysicalPreOrderModal
        open={open}
        onClose={() => setOpen(false)}
        location={location}
      />
    </>
  );
}
