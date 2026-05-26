"use client";

import { LAUNCH_EVENT } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RegistrationForm } from "@/components/ui/RegistrationForm";
import { AnimatedSection } from "@/lib/animations";
import { FadeIn } from "@/lib/animations";

export function Launch() {
  return (
    <AnimatedSection id="launch" className="relative py-24 md:py-32 section-glow">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Virtual Launch"
          title={LAUNCH_EVENT.title}
          description="Join founders, compliance leaders, and institutional partners for the official launch event."
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <FadeIn>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-5">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Date</p>
                  <p className="font-semibold">{LAUNCH_EVENT.date}</p>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Time</p>
                  <p className="font-semibold">{LAUNCH_EVENT.time}</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Venue</p>
                <p className="font-semibold">{LAUNCH_EVENT.venue}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-4">Key Discussion Themes</p>
                <ul className="space-y-3">
                  {LAUNCH_EVENT.themes.map((theme) => (
                    <li key={theme} className="flex items-start gap-3 text-sm text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      {theme}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Reserve Your Spot</h3>
              <RegistrationForm type="launch" submitLabel="Reserve Your Spot" />
            </div>
          </FadeIn>
        </div>
      </div>
    </AnimatedSection>
  );
}
