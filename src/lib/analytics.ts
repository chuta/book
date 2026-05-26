export type AnalyticsEvent =
  | "registration_submit"
  | "cta_click"
  | "scroll_depth"
  | "form_error";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", event, properties);
  }

  // Plausible
  if (typeof window.plausible === "function") {
    window.plausible(event, { props: properties });
  }

  // PostHog
  if (typeof window.posthog?.capture === "function") {
    window.posthog.capture(event, properties);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event, properties);
  }
}

export function trackCTA(label: string, location: string) {
  trackEvent("cta_click", { label, location });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: EventProperties }) => void;
    posthog?: { capture: (event: string, properties?: EventProperties) => void };
  }
}
