"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES, ROLES, type RegistrationType } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

interface RegistrationFormProps {
  type: RegistrationType;
  submitLabel?: string;
  compact?: boolean;
}

interface FormData {
  name: string;
  email: string;
  organization: string;
  role: string;
  country: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  organization: "",
  role: "",
  country: "",
};

export function RegistrationForm({
  type,
  submitLabel = "Submit",
  compact = false,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      trackEvent("registration_submit", { type, country: formData.country, role: formData.role });
      setStatus("success");
      setFormData(initialFormData);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      trackEvent("form_error", { type, error: errorMessage });
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-colors text-sm";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">You&apos;re registered!</h3>
        <p className="text-muted">
          Check your inbox for a confirmation email from Klarify. We&apos;ll send
          launch reminders and joining details as the event approaches.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          Register another person
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? "" : "max-w-lg"}`}>
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="organization"
          placeholder="Organization"
          value={formData.organization}
          onChange={handleChange}
          className={inputClass}
        />
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          className={`${inputClass} ${!formData.role ? "text-muted/60" : ""}`}
        >
          <option value="" disabled>
            Select role
          </option>
          {ROLES.map((role) => (
            <option key={role} value={role} className="bg-surface text-foreground">
              {role}
            </option>
          ))}
        </select>
        <select
          name="country"
          required
          value={formData.country}
          onChange={handleChange}
          className={`${inputClass} ${!formData.country ? "text-muted/60" : ""} ${compact ? "sm:col-span-2" : ""}`}
        >
          <option value="" disabled>
            Select country
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country} className="bg-surface text-foreground">
              {country}
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-sm"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-emerald-500/20"
      >
        {status === "loading" ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
