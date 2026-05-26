"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BOOK_TOPICS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection, fadeInUp, staggerContainer } from "@/lib/animations";
import { FadeIn } from "@/lib/animations";

export function AboutBook() {
  return (
    <AnimatedSection id="about" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <FadeIn>
            <SectionHeader
              label="About the Book"
              title="The Founder's Guide to Building in Regulated Markets"
              description="How African Startups Navigate Blockchain,Digital Assets & the New Rules of Money."
              align="left"
            />
            <div className="space-y-2 text-muted leading-relaxed">
              <p>
                This book exists because too many promising startups fail not from
                lack of product-market fit, but from regulatory missteps that could
                have been avoided with the right intelligence.
              </p>
              <p>
                It helps founders, compliance teams, and institutional partners
                navigate blockchain, fintech, digital assets, and policy across
                African regulated markets—with clarity, not confusion.
              </p>
              <p className="text-emerald-400 font-medium">
                The timing matters. ISA 2025, ARIP, and evolving AML/CFT frameworks
                demand a new approach to regulatory readiness.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-gold/5 rounded-3xl blur-2xl" />
            <Image
              src="/images/mockup-book.png"
              alt="Book mockup — The Founder's Guide"
              width={600}
              height={700}
              className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl"
            />
          </FadeIn>
        </div>

        <div>
          <FadeIn>
            <h3 className="text-center text-xl font-semibold mb-10 text-muted">
              Topics Covered
            </h3>
          </FadeIn>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {BOOK_TOPICS.map((topic) => (
              <motion.div
                key={topic.title}
                variants={fadeInUp}
                className="glass-card glass-card-hover rounded-xl p-5 text-center"
              >
                <h4 className="font-semibold text-foreground text-sm mb-2">
                  {topic.title}
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  {topic.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
