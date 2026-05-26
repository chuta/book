import Image from "next/image";
import { SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <Image
              src={SITE_LOGO}
              alt={SITE_LOGO_ALT}
              width={140}
              height={48}
              className="h-9 w-auto mb-4"
            />
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Compliance intelligence and regulatory readiness infrastructure for
              Africa&apos;s regulated innovation ecosystem.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About the Book", href: "#about" },
                { label: "Klarify Platform", href: "#klarify" },
                { label: "Virtual Launch", href: "#launch" },
                { label: "About the Author", href: "#author" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://klarify.africa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-emerald-400 transition-colors"
                >
                  klarify.africa
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@klarify.africa"
                  className="text-sm text-muted hover:text-emerald-400 transition-colors"
                >
                  hello@klarify.africa
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Klarify. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            The Founder&apos;s Guide to Building in Regulated Markets
          </p>
        </div>
      </div>
    </footer>
  );
}
