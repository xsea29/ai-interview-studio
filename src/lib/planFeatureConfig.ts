import { initialFeatures } from "./featureFlagConfig";

export type PlanType = "starter" | "professional" | "enterprise";

export interface PlanConfig {
  label: string;
  price: { monthly: number; annual: number };
  features: string[];
  className: string;
}

export const planConfigs: Record<PlanType, PlanConfig> = {
  starter: {
    label: "Starter",
    price: { monthly: 99, annual: 990 },
    className: "bg-muted text-muted-foreground",
    features: [
      "video-interviews",
      "audio-interviews",
      "ai-evaluation",
      "calendar-sync",
      "gdpr-module",
      "encryption-enabled",
      "usage-tracking",
      "plan-upgrade",
    ],
  },
  professional: {
    label: "Professional",
    price: { monthly: 299, annual: 2990 },
    className: "bg-primary/15 text-primary",
    features: [
      "video-interviews",
      "audio-interviews",
      "realtime-transcription",
      "ai-evaluation",
      "advanced-analytics",
      "custom-reports",
      "ats-api-sync",
      "webhooks",
      "calendar-sync",
      "mfa-enabled",
      "email-customization",
      "gdpr-module",
      "audit-logging",
      "encryption-enabled",
      "usage-tracking",
      "plan-upgrade",
    ],
  },
  enterprise: {
    label: "Enterprise",
    price: { monthly: 799, annual: 7990 },
    className: "bg-accent text-accent-foreground",
    features: initialFeatures.map((f) => f.id), // All features
  },
};

export function getDefaultFeaturesForPlan(plan: PlanType): Record<string, boolean> {
  const planFeatures = planConfigs[plan].features;
  const result: Record<string, boolean> = {};
  for (const f of initialFeatures) {
    result[f.id] = planFeatures.includes(f.id);
  }
  return result;
}

export function getPlanPrice(plan: PlanType, cycle: "monthly" | "annual"): number {
  return planConfigs[plan].price[cycle];
}
