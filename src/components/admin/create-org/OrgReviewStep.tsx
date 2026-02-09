import { Check, Lock, Mail, Building2, CreditCard, Users, Settings, Shield, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { planConfigs, getDefaultFeaturesForPlan, type PlanType } from "@/lib/planFeatureConfig";
import { initialFeatures, categoryConfig, type FeatureFlagCategory } from "@/lib/featureFlagConfig";
import type { OrgFormData } from "./OrgDetailsForm";

interface OrgReviewStepProps {
  formData: OrgFormData;
  plan: PlanType;
  billingCycle: "monthly" | "annual";
}

const residencyLabels: Record<string, string> = {
  US: "🇺🇸 United States",
  EU: "🇪🇺 European Union",
  APAC: "🌏 Asia Pacific",
};

export function OrgReviewStep({ formData, plan, billingCycle }: OrgReviewStepProps) {
  const planConfig = planConfigs[plan];
  const planFeatures = getDefaultFeaturesForPlan(plan);
  const enabledCount = Object.values(planFeatures).filter(Boolean).length;
  const lockedCount = initialFeatures.length - enabledCount;
  const price = billingCycle === "monthly" ? planConfig.price.monthly : planConfig.price.annual;

  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + (billingCycle === "annual" ? 12 : 1));

  const featuresByCategory = initialFeatures.reduce(
    (acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f);
      return acc;
    },
    {} as Record<FeatureFlagCategory, typeof initialFeatures>
  );

  // Determine onboarding steps based on enabled features
  const onboardingSteps = [
    { label: "Account creation", always: true },
    { label: "Organization setup", always: true },
    { label: "Billing activation", always: true },
    { label: "Add team members", always: true },
    { label: "Domain verification", always: false, requires: "custom-domain" },
    { label: "Configure integrations", always: false, requires: ["ats-api-sync", "webhooks", "hris-integration"] },
    { label: "Brand identity", always: false, requires: "white-label" },
    { label: "Compliance & privacy", always: true },
  ].filter((step) => {
    if (step.always) return true;
    if (Array.isArray(step.requires)) return step.requires.some((r) => planFeatures[r]);
    return planFeatures[step.requires as string];
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Organization Summary */}
      <div className="space-y-6">
        <Card className="card-elevated">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">{formData.name}</h3>
                <p className="text-sm text-muted-foreground">{formData.domain || "No domain set"}</p>
              </div>
              <Badge className={planConfig.className}>{planConfig.label}</Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Industry</p>
                <p className="font-medium capitalize">{formData.industry || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Company Size</p>
                <p className="font-medium">{formData.size || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Owner Email</p>
                <p className="font-medium">{formData.ownerEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data Residency</p>
                <p className="font-medium">{residencyLabels[formData.dataResidency] || formData.dataResidency}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{planConfig.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-bold">
                  ${price}/{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next billing</span>
                <span className="font-medium">{nextBilling.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Auto-renewal</span>
                <span className="font-medium text-success">Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="card-elevated border-primary/20 bg-primary/[0.02]">
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              What Happens Next
            </h4>
            <div className="space-y-4">
              <StepItem
                icon={<Building2 className="h-4 w-4" />}
                title="Organization Created"
                description="Status set to pending-activation with all features assigned"
              />
              <StepItem
                icon={<Mail className="h-4 w-4" />}
                title="Email Sent to Owner"
                description={`Invitation sent to ${formData.ownerEmail} with setup link (expires 24h)`}
              />
              <StepItem
                icon={<Users className="h-4 w-4" />}
                title={`Owner Completes Onboarding (${onboardingSteps.length} steps)`}
                description={onboardingSteps.map((s) => s.label).join(" → ")}
              />
              <StepItem
                icon={<Shield className="h-4 w-4" />}
                title="Organization Activated"
                description="Status changes to active, owner redirected to dashboard"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Features Included */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Features Included
          </h3>
          <p className="text-sm text-muted-foreground">
            {enabledCount} of {initialFeatures.length}
          </p>
        </div>

        <ScrollArea className="h-[520px]">
          <div className="space-y-5 pr-3">
            {(Object.entries(featuresByCategory) as [FeatureFlagCategory, typeof initialFeatures][]).map(
              ([cat, features]) => {
                const enabledInCat = features.filter((f) => planFeatures[f.id]).length;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {categoryConfig[cat].label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {enabledInCat}/{features.length}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {features.map((f) => {
                        const isEnabled = planFeatures[f.id];
                        return (
                          <div
                            key={f.id}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                              isEnabled
                                ? "bg-success/5"
                                : "bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isEnabled ? (
                                <Check className="h-3.5 w-3.5 text-success shrink-0" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                              )}
                              <span className={isEnabled ? "text-foreground" : "text-muted-foreground"}>
                                {f.name}
                              </span>
                            </div>
                            {!isEnabled && (
                              <span className="text-[10px] text-muted-foreground/60 uppercase">
                                Upgrade
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </ScrollArea>

        {lockedCount > 0 && plan !== "enterprise" && (
          <div className="p-3 rounded-lg bg-accent/50 border border-accent text-sm">
            <p className="text-accent-foreground">
              <span className="font-semibold">Upgrade to Enterprise</span> to unlock {lockedCount} additional features including HRIS, White-label, and Custom Domain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
