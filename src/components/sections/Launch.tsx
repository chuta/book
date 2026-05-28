"use client";

import { LAUNCH_EVENT } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RegistrationForm } from "@/components/ui/RegistrationForm";
import { LandingIcon } from "@/components/ui/LandingIcon";
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
                  <div className="mb-2 flex items-center gap-2 text-emerald-400">
                    <LandingIcon name="calendar-days" className="h-4 w-4" />
                    <p className="text-xs text-muted uppercase tracking-wider">Date</p>
                  </div>
                  <p className="font-semibold">{LAUNCH_EVENT.date}</p>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <div className="mb-2 flex items-center gap-2 text-emerald-400">
                    <LandingIcon name="clock" className="h-4 w-4" />
                    <p className="text-xs text-muted uppercase tracking-wider">Time</p>
                  </div>
                  <p className="font-semibold">{LAUNCH_EVENT.time}</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="mb-2 flex items-center gap-2 text-emerald-400">
                  <LandingIcon name="map-pin" className="h-4 w-4" />
                  <p className="text-xs text-muted uppercase tracking-wider">Venue</p>
                </div>
                <p className="font-semibold">{LAUNCH_EVENT.venue}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-4">Key Discussion Themes</p>
                <ul className="space-y-3">
                  {LAUNCH_EVENT.themes.map((theme) => (
                    <li key={theme} className="flex items-start gap-3 text-sm text-muted">
                      <LandingIcon name="check-circle" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
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
