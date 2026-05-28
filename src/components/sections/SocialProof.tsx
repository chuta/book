"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LandingIcon } from "@/components/ui/LandingIcon";
import { AnimatedSection, fadeInUp, staggerContainer } from "@/lib/animations";

export function SocialProof() {
  return (
    <AnimatedSection id="testimonials" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Ecosystem Voices"
          title="What Leaders Are Saying"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.blockquote
              key={testimonial.author}
              variants={fadeInUp}
              className="glass-card rounded-2xl p-8 flex flex-col"
            >
              <div className="mb-4 text-emerald-400">
                <LandingIcon name="chat-bubble-bottom-center-text" className="h-8 w-8" />
              </div>
              <p className="text-muted leading-relaxed flex-1 mb-6">
                {testimonial.quote}
              </p>
              <footer>
                <p className="font-semibold text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted mt-1">{testimonial.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
