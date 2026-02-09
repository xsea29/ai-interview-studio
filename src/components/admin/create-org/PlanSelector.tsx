import { Check, X, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planConfigs, getDefaultFeaturesForPlan, type PlanType } from "@/lib/planFeatureConfig";
import { initialFeatures, categoryConfig, type FeatureFlagCategory } from "@/lib/featureFlagConfig";

interface PlanSelectorProps {
  plan: PlanType;
  onPlanChange: (plan: PlanType) => void;
  billingCycle: "monthly" | "annual";
  onBillingCycleChange: (cycle: "monthly" | "annual") => void;
}

export function PlanSelector({
  plan,
  onPlanChange,
  billingCycle,
  onBillingCycleChange,
}: PlanSelectorProps) {
  const planFeatures = getDefaultFeaturesForPlan(plan);
  const planConfig = planConfigs[plan];
  const enabledCount = Object.values(planFeatures).filter(Boolean).length;

  const featuresByCategory = initialFeatures.reduce(
    (acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f);
      return acc;
    },
    {} as Record<FeatureFlagCategory, typeof initialFeatures>
  );

  const price = billingCycle === "monthly" ? planConfig.price.monthly : planConfig.price.annual;
  const monthlyEquivalent = billingCycle === "annual" ? Math.round(planConfig.price.annual / 12) : planConfig.price.monthly;
  const savings = billingCycle === "annual"
    ? planConfig.price.monthly * 12 - planConfig.price.annual
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Subscription Plan</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select the plan that best matches their needs
        </p>
      </div>

      {/* Plan Cards */}
      <div className="space-y-3">
        {(Object.entries(planConfigs) as [PlanType, typeof planConfigs.starter][]).map(
          ([key, cfg]) => {
            const isSelected = plan === key;
            const featureCount = getDefaultFeaturesForPlan(key);
            const count = Object.values(featureCount).filter(Boolean).length;

            return (
              <button
                key={key}
                onClick={() => onPlanChange(key)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{count} features included</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${billingCycle === "monthly" ? cfg.price.monthly : Math.round(cfg.price.annual / 12)}
                    </p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Billing Cycle */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Billing Cycle</label>
        <Select value={billingCycle} onValueChange={(v) => onBillingCycleChange(v as "monthly" | "annual")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annual">Annual (save ~17%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pricing Summary */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium">{planConfig.label}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cost</span>
          <span className="font-bold text-foreground">
            ${price}<span className="font-normal text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
          </span>
        </div>
        {billingCycle === "annual" && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly equivalent</span>
              <span className="font-medium">${monthlyEquivalent}/mo</span>
            </div>
            <div className="flex justify-between text-sm text-success">
              <span>Annual savings</span>
              <span className="font-semibold">${savings}</span>
            </div>
          </>
        )}
      </div>

      {/* Feature List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">
            Features ({enabledCount}/{initialFeatures.length})
          </p>
          <Badge variant="secondary" className={planConfig.className}>
            {planConfig.label}
          </Badge>
        </div>

        <ScrollArea className="h-[280px]">
          <div className="space-y-4 pr-3">
            {(Object.entries(featuresByCategory) as [FeatureFlagCategory, typeof initialFeatures][]).map(
              ([cat, features]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {categoryConfig[cat].label}
                  </p>
                  <div className="space-y-1">
                    {features.map((f) => {
                      const isEnabled = planFeatures[f.id];
                      return (
                        <div
                          key={f.id}
                          className={`flex items-center justify-between py-1.5 px-2 rounded text-sm ${
                            isEnabled ? "" : "opacity-50"
                          }`}
                        >
                          <span className={isEnabled ? "text-foreground" : "text-muted-foreground"}>
                            {f.name}
                          </span>
                          {isEnabled ? (
                            <Check className="h-3.5 w-3.5 text-success shrink-0" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
