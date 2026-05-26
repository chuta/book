"use client";

import { motion } from "framer-motion";
import { KLARIFY_FEATURES } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { AnimatedSection, fadeInUp, staggerContainer } from "@/lib/animations";
import { FadeIn } from "@/lib/animations";

const PRODUCT_TOUR_URL = "https://klarify.africa/product-tour";

export function Klarify() {
  return (
    <AnimatedSection id="klarify" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Introducing Klarify"
          title="The Book Gives You the Framework. Klarify Helps You Execute It."
          description="Compliance intelligence, readiness infrastructure, and regulatory guidance, built for founders who need to move from strategy to execution. The book gives you the map. Klarify gives you the GPS. The book explains the rules. Klarify runs the playbook."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12"
        >
          {KLARIFY_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">
                    {feature.title}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {feature.metric}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <FadeIn>
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-gold/5 pointer-events-none" />
              <div className="relative">
                <p className="text-xs text-emerald-400 font-medium tracking-widest uppercase mb-3">
                  Product Tour
                </p>
                <h3 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-semibold mb-4">
                  See inside Klarify
                </h3>
                <p className="text-muted leading-relaxed mb-8 max-w-lg mx-auto">
                  Walk through the dashboard; Readiness Score, compliance roadmap,
                  document generator, ARIP tracker, and more. No account required.
                </p>
                <Button
                  href={PRODUCT_TOUR_URL}
                  size="lg"
                  trackingLabel="Explore Product Tour"
                  trackingLocation="klarify-section"
                  className="inline-flex"
                >
                  Explore the Product Tour
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </AnimatedSection>
  );
}
