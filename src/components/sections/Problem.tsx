"use client";

import { motion } from "framer-motion";
import { PAIN_POINTS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LandingIcon } from "@/components/ui/LandingIcon";
import { AnimatedSection, fadeInUp, staggerContainer } from "@/lib/animations";

export function Problem() {
  return (
    <AnimatedSection
      id="problem"
      className="relative py-24 md:py-32 section-glow"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="The Challenge"
          title="African Startups Are Building Faster Than Regulatory Understanding."
          description="Innovation outpaces compliance infrastructure. Founders face critical gaps that threaten growth, partnerships, and institutional trust."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {PAIN_POINTS.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeInUp}
              className="glass-card glass-card-hover rounded-2xl p-6 group"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <LandingIcon name={point.icon} className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                {point.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
