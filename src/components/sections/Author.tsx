"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AUTHOR } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection, fadeInUp } from "@/lib/animations";
import { FadeIn } from "@/lib/animations";

export function Author() {
  return (
    <AnimatedSection id="author" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <FadeIn className="lg:col-span-2 lg:sticky lg:top-28">
            <div className="relative max-w-sm mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-gold/10 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-3xl p-2 overflow-hidden">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/author-headshot.png"
                    alt={AUTHOR.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <p className="text-center text-sm text-muted mt-4">{AUTHOR.title}</p>
            </div>
          </FadeIn>

          <div className="lg:col-span-3">
            <SectionHeader
              label="About the Author"
              title={AUTHOR.name}
              align="left"
            />

            <FadeIn delay={0.1}>
              <div className="space-y-5 -mt-8 mb-10">
                {AUTHOR.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-muted leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </FadeIn>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-3 mb-10"
            >
              {AUTHOR.credentials.map((credential) => (
                <div
                  key={credential}
                  className="flex items-start gap-3 glass-card rounded-xl px-4 py-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                  <span className="text-sm text-muted leading-snug">{credential}</span>
                </div>
              ))}
            </motion.div>

            <FadeIn delay={0.2}>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-emerald-400 mb-4">
                  Read Online
                </h3>
                <div className="space-y-3">
                  {AUTHOR.books.map((book) => (
                    <a
                      key={book.readOnlinePath}
                      href={book.readOnlinePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 glass-card glass-card-hover rounded-xl px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground group-hover:text-emerald-400 transition-colors leading-snug">
                          {book.title}
                        </p>
                        <p className="text-xs text-muted mt-1">Preview: TOC, foreword, preface & introduction</p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                        Read Online
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
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
