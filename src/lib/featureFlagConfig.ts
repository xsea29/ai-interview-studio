export type FeatureFlagCategory =
  | "interviews"
  | "analytics"
  | "integrations"
  | "auth"
  | "branding"
  | "compliance"
  | "billing";

export type FeatureFlagType = "internal" | "beta" | "general";
export type FeatureFlagAvailability = "global" | "enterprise" | "business";

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: FeatureFlagCategory;
  type: FeatureFlagType;
  availability: FeatureFlagAvailability;
  enabled: boolean;
  dependsOn?: string[];
}

export const categoryConfig: Record<
  FeatureFlagCategory,
  { label: string; icon: string }
> = {
  interviews: { label: "Interviews", icon: "Video" },
  analytics: { label: "Analytics & Reporting", icon: "BarChart3" },
  integrations: { label: "Integrations", icon: "Plug" },
  auth: { label: "Authentication", icon: "Shield" },
  branding: { label: "White-Label & Branding", icon: "Palette" },
  compliance: { label: "Compliance & Security", icon: "Lock" },
  billing: { label: "Billing & Plans", icon: "CreditCard" },
};

export const typeConfig: Record<FeatureFlagType, { label: string; className: string }> = {
  internal: { label: "Internal", className: "bg-muted text-muted-foreground" },
  beta: { label: "Beta", className: "bg-warning/15 text-warning" },
  general: { label: "General", className: "bg-success/15 text-success" },
};

export const availabilityConfig: Record<
  FeatureFlagAvailability,
  { label: string; className: string }
> = {
  global: { label: "All Plans", className: "bg-primary/15 text-primary" },
  enterprise: { label: "Enterprise Only", className: "bg-accent text-accent-foreground" },
  business: { label: "Business+", className: "bg-secondary text-secondary-foreground" },
};

export const initialFeatures: FeatureFlag[] = [
  // ── Interviews ──
  {
    id: "video-interviews",
    name: "Video Interviews",
    description: "Full video recording and AI-powered facial/behavioral analysis",
    category: "interviews",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "audio-interviews",
    name: "Audio Interviews",
    description: "Audio-only interview mode with speech analysis",
    category: "interviews",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "realtime-transcription",
    name: "Real-time Transcription",
    description: "Live transcription during interviews with speaker detection",
    category: "interviews",
    type: "beta",
    availability: "business",
    enabled: false,
    dependsOn: ["video-interviews", "audio-interviews"],
  },
  {
    id: "ai-evaluation",
    name: "AI Evaluation",
    description: "Automated candidate evaluation using AI models",
    category: "interviews",
    type: "general",
    availability: "global",
    enabled: true,
  },

  // ── Analytics & Reporting ──
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Deep dive analytics with custom reports and trend analysis",
    category: "analytics",
    type: "beta",
    availability: "enterprise",
    enabled: false,
  },
  {
    id: "custom-reports",
    name: "Custom Reports",
    description: "Exportable interview analysis reports with custom templates",
    category: "analytics",
    type: "general",
    availability: "business",
    enabled: true,
    dependsOn: ["advanced-analytics"],
  },

  // ── Integrations ──
  {
    id: "ats-api-sync",
    name: "ATS API Sync",
    description: "Two-way sync with Applicant Tracking Systems",
    category: "integrations",
    type: "general",
    availability: "business",
    enabled: true,
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Real-time event notifications to external systems",
    category: "integrations",
    type: "general",
    availability: "business",
    enabled: true,
  },
  {
    id: "hris-integration",
    name: "HRIS Integration",
    description: "Connect to HR management systems for employee data sync",
    category: "integrations",
    type: "beta",
    availability: "enterprise",
    enabled: false,
  },
  {
    id: "calendar-sync",
    name: "Calendar Integration",
    description: "Schedule interviews with Google Calendar, Outlook, etc.",
    category: "integrations",
    type: "general",
    availability: "global",
    enabled: true,
  },

  // ── Authentication ──
  {
    id: "sso-support",
    name: "SSO Support",
    description: "SAML and OAuth single sign-on integration",
    category: "auth",
    type: "general",
    availability: "enterprise",
    enabled: true,
  },
  {
    id: "mfa-enabled",
    name: "Multi-Factor Authentication",
    description: "Enhanced security with TOTP and SMS-based MFA",
    category: "auth",
    type: "general",
    availability: "business",
    enabled: false,
  },
  {
    id: "rbac-advanced",
    name: "Advanced RBAC",
    description: "Granular role-based access with custom permission sets",
    category: "auth",
    type: "beta",
    availability: "enterprise",
    enabled: false,
  },

  // ── Branding ──
  {
    id: "white-label",
    name: "Branding White-Label",
    description: "Full customization of candidate-facing interface",
    category: "branding",
    type: "general",
    availability: "enterprise",
    enabled: true,
  },
  {
    id: "custom-domain",
    name: "Custom Domain",
    description: "Branded interview URLs with your own domain",
    category: "branding",
    type: "general",
    availability: "enterprise",
    enabled: false,
  },
  {
    id: "email-customization",
    name: "Email Customization",
    description: "Branded email templates for invitations and notifications",
    category: "branding",
    type: "general",
    availability: "business",
    enabled: true,
  },

  // ── Compliance & Security ──
  {
    id: "gdpr-module",
    name: "GDPR Compliance",
    description: "Enhanced EU data protection and consent management",
    category: "compliance",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "soc2-ready",
    name: "SOC2 Compliance",
    description: "Security audits, certifications, and compliance reporting",
    category: "compliance",
    type: "general",
    availability: "enterprise",
    enabled: true,
  },
  {
    id: "audit-logging",
    name: "Audit Logging",
    description: "Track all system actions with detailed audit trail",
    category: "compliance",
    type: "general",
    availability: "business",
    enabled: true,
  },
  {
    id: "encryption-enabled",
    name: "Data Encryption",
    description: "End-to-end encryption for data in-transit and at-rest",
    category: "compliance",
    type: "general",
    availability: "global",
    enabled: true,
  },

  // ── Billing ──
  {
    id: "usage-tracking",
    name: "Usage Tracking",
    description: "Monitor interview usage and credit consumption",
    category: "billing",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "plan-upgrade",
    name: "Plan Upgrade Flow",
    description: "Self-service plan upgrades and downgrades",
    category: "billing",
    type: "general",
    availability: "global",
    enabled: true,
  },

  // ── Internal / Testing ──
  {
    id: "multi-language",
    name: "Multi-Language Support",
    description: "AI interviews in 12+ languages",
    category: "interviews",
    type: "internal",
    availability: "global",
    enabled: false,
  },
  {
    id: "candidate-mobile-app",
    name: "Candidate Mobile App",
    description: "Native mobile app for candidate interviews",
    category: "interviews",
    type: "internal",
    availability: "global",
    enabled: false,
  },
  {
    id: "ai-model-v18",
    name: "AI Model v1.8",
    description: "Latest AI model with improved accuracy and speed",
    category: "interviews",
    type: "beta",
    availability: "enterprise",
    enabled: false,
  },
  {
    id: "fairness-scoring",
    name: "Fairness Scoring",
    description: "AI-powered bias detection and fairness metrics",
    category: "analytics",
    type: "beta",
    availability: "enterprise",
    enabled: true,
  },
];
