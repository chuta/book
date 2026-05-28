"use client";

import { motion } from "framer-motion";
import { PERSONAS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LandingIcon } from "@/components/ui/LandingIcon";
import { AnimatedSection, fadeInUp, staggerContainer } from "@/lib/animations";

export function WhoFor() {
  return (
    <AnimatedSection id="audience" className="relative py-24 md:py-32 section-glow">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Audience"
          title="Built for the Entire Ecosystem"
          description="From founders building their first product to regulators shaping the frameworks that govern them."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {PERSONAS.map((persona) => (
            <motion.div
              key={persona.title}
              variants={fadeInUp}
              className="glass-card glass-card-hover rounded-2xl p-6 text-center group"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <LandingIcon name={persona.icon} className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {persona.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {persona.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
