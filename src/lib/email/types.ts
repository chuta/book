import type { RegistrationType } from "@/lib/constants";

export interface RegistrationPayload {
  name: string;
  email: string;
  organization?: string;
  role: string;
  country: string;
  type: RegistrationType;
}

export const REGISTRATION_LABELS: Record<RegistrationType, string> = {
  launch: "Virtual Launch Registration",
  klarify: "Klarify Waitlist",
  "book-updates": "Book Updates",
};

export interface FollowUpSchedule {
  key: "followup-7d" | "followup-1d";
  scheduledAt: string;
  subject: string;
}

export interface RegistrationResult {
  registrationId: string;
  emailsSent: {
    admin: boolean;
    confirmation: boolean;
    followUps: string[];
  };
  contactSynced: boolean;
}
