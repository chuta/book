"use client";

import { Button } from "@/components/ui/Button";
import { BookPurchaseCTA } from "@/components/ui/BookPurchaseCTA";
import { AnimatedSection } from "@/lib/animations";
import { FadeIn } from "@/lib/animations";

export function FinalCTA() {
  return (
    <AnimatedSection id="cta" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
            Africa&apos;s Next Generation of Builders Must Become{" "}
            <span className="gradient-text">Trust-Ready</span>.
          </h2>
          <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
            Register for the virtual launch or get the book — be part of the
            regulatory intelligence ecosystem.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col items-center gap-8">
            <Button
              href="#launch"
              size="lg"
              trackingLabel="Register for Launch"
              trackingLocation="final-cta"
            >
              Register for Launch
            </Button>

            <div className="w-full max-w-2xl">
              <BookPurchaseCTA
                location="final-cta"
                layout="cards"
                align="center"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </AnimatedSection>
  );
}
