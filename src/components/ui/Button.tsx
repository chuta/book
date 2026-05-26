"use client";

import { motion } from "framer-motion";
import { trackCTA } from "@/lib/analytics";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  trackingLabel?: string;
  trackingLocation?: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20",
  secondary:
    "bg-transparent border border-white/20 text-foreground hover:border-emerald-500/50 hover:bg-white/5",
  ghost: "bg-transparent text-muted hover:text-foreground hover:bg-white/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  trackingLabel,
  trackingLocation,
  className = "",
  children,
  onClick,
  disabled,
  type = "button",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (trackingLabel && trackingLocation) {
      trackCTA(trackingLabel, trackingLocation);
    }
    onClick?.(e);
  };

  if (href) {
    const isExternal = href.startsWith("http");

    return (
      <motion.a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={classes}
        onClick={() => {
          if (trackingLabel && trackingLocation) {
            trackCTA(trackingLabel, trackingLocation);
          }
        }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  );
}
