"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SITE_LOGO, SITE_LOGO_ALT } from "@/lib/constants";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Audience", href: "#audience" },
  { label: "Klarify", href: "#klarify" },
  { label: "Author", href: "#author" },
  { label: "Launch", href: "#launch" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <a href="#" className="flex items-center gap-3">
          <Image
            src={SITE_LOGO}
            alt={SITE_LOGO_ALT}
            width={140}
            height={48}
            className="h-9 md:h-10 w-auto"
            priority
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            href="#launch"
            size="sm"
            trackingLabel="Register"
            trackingLocation="navbar"
          >
            Register
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-muted hover:text-foreground cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-muted hover:text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button
                href="#launch"
                size="sm"
                className="w-full"
                trackingLabel="Register"
                trackingLocation="navbar-mobile"
              >
                Register
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
