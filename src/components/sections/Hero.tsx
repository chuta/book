"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BookPurchaseCTA } from "@/components/ui/BookPurchaseCTA";
import { ReadOnlineLinks } from "@/components/ui/ReadOnlineLinks";
import { HERO_HEADLINES, LAUNCH_EVENT, SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";
import { FadeIn } from "@/lib/animations";

export function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HERO_HEADLINES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      <div className="grid-pattern absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Messaging */}
          <div className="space-y-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400 font-medium">
                  Virtual Launch · {LAUNCH_EVENT.date} · {LAUNCH_EVENT.time}
                </span>
              </div>
            </FadeIn>

            {/* Headline carousel — grid stack sizes to tallest headline */}
            <div className="grid">
              {HERO_HEADLINES.map((headline, i) => (
                <motion.h1
                  key={headline}
                  initial={false}
                  animate={{
                    opacity: i === headlineIndex ? 1 : 0,
                    y: i === headlineIndex ? 0 : 8,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={i !== headlineIndex}
                  className={`col-start-1 row-start-1 font-[family-name:var(--font-sora)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] ${
                    i !== headlineIndex ? "pointer-events-none select-none" : ""
                  }`}
                >
                  {headline}
                </motion.h1>
              ))}
            </div>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                A practical guide for founders, institutions, and innovators navigating
                blockchain, fintech, digital assets, and compliance across African
                regulated markets.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col gap-6">
                <Button
                  href="#launch"
                  size="lg"
                  trackingLabel="Register for Virtual Launch"
                  trackingLocation="hero"
                  className="w-full sm:w-auto"
                >
                  Register for Virtual Launch
                </Button>
                <BookPurchaseCTA location="hero" layout="cards" align="left" />
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/30 to-gold/30 border-2 border-background"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted">
                  Join founders, compliance teams, and institutions preparing for launch
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right — Visuals */}
          <FadeIn delay={0.2} className="relative">
            <div className="relative max-w-xs mx-auto lg:max-w-none">
              {/* Glow behind book */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-gold/10 rounded-3xl blur-3xl animate-pulse-glow" />

              {/* Book mockup */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Image
                  src="/images/book-3d.png"
                  alt="The Founder's Guide to Building in Regulated Markets — 3D book mockup"
                  width={500}
                  height={600}
                  priority
                  className="w-full max-w-xs lg:max-w-md mx-auto drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating UI cards — desktop only */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-4 top-16 glass-card rounded-xl p-4 z-20 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Readiness Score</p>
                    <p className="text-lg font-semibold text-emerald-400">87/100</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -right-4 bottom-24 glass-card rounded-xl p-4 z-20 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                    <span className="text-gold text-lg">📋</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Classification</p>
                    <p className="text-sm font-semibold">VASP Ready</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-8 top-4 glass-card rounded-xl p-3 z-20 shadow-xl hidden lg:block"
              >
                <Image
                  src={SITE_LOGO}
                  alt={SITE_LOGO_ALT}
                  width={100}
                  height={36}
                  className="h-8 w-auto opacity-90"
                />
              </motion.div>
            </div>

            <FadeIn delay={0.35} className="relative z-10 mt-8 max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <ReadOnlineLinks />
            </FadeIn>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
