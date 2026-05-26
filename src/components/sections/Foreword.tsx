"use client";

import { motion } from "framer-motion";
import { FOREWORD_AUTHORS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection, fadeInUp, staggerContainer } from "@/lib/animations";

export function Foreword() {
  return (
    <AnimatedSection id="foreword" className="relative py-24 md:py-32 section-glow">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Foreword & Preface"
          title="Institutional Endorsement"
          description="Leaders at the forefront of Africa's regulatory evolution lend their voice to this work."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {FOREWORD_AUTHORS.map((author) => (
            <motion.div
              key={author.name}
              variants={fadeInUp}
              className="glass-card rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald-500/5 pointer-events-none" />
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-gold/20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-[family-name:var(--font-sora)] font-bold text-emerald-400">
                    {author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-medium tracking-widest uppercase mb-2">
                  {author.role}
                </p>
                <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                  {author.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {author.credential}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
