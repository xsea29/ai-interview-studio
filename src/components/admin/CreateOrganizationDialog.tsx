import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { initialFeatures, categoryConfig, type FeatureFlagCategory } from "@/lib/featureFlagConfig";
import { planConfigs, getDefaultFeaturesForPlan, type PlanType } from "@/lib/planFeatureConfig";
import { useCreateOrganization, type CreateOrgInput } from "@/hooks/useOrganizations";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({ open, onOpenChange }: CreateOrganizationDialogProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [plan, setPlan] = useState<PlanType>("starter");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [step, setStep] = useState<"details" | "preview">("details");

  const createOrg = useCreateOrganization();

  const planFeatures = getDefaultFeaturesForPlan(plan);
  const planConfig = planConfigs[plan];

  const handleSubmit = async () => {
    const input: CreateOrgInput = {
      name,
      domain,
      industry,
      size,
      plan,
      ownerEmail,
      billingCycle,
    };
    await createOrg.mutateAsync(input);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName("");
    setDomain("");
    setIndustry("");
    setSize("");
    setPlan("starter");
    setOwnerEmail("");
    setBillingCycle("monthly");
    setStep("details");
  };

  const featuresByCategory = initialFeatures.reduce(
    (acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f);
      return acc;
    },
    {} as Record<FeatureFlagCategory, typeof initialFeatures>
  );

  const enabledCount = Object.values(planFeatures).filter(Boolean).length;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            {step === "details"
              ? "Enter organization details and select a plan."
              : "Review features included with the selected plan."}
          </DialogDescription>
        </DialogHeader>

        {step === "details" ? (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="acme.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1–50</SelectItem>
                    <SelectItem value="51-200">51–200</SelectItem>
                    <SelectItem value="201-500">201–500</SelectItem>
                    <SelectItem value="501-1000">501–1,000</SelectItem>
                    <SelectItem value="1001+">1,001+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Subscription Plan</Label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.entries(planConfigs) as [PlanType, typeof planConfigs.starter][]).map(
                  ([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setPlan(key)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        plan === key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <p className="font-semibold text-sm">{cfg.label}</p>
                      <p className="text-2xl font-bold mt-1">
                        ${billingCycle === "monthly" ? cfg.price.monthly : cfg.price.annual}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cfg.features.length} features
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <Select
                  value={billingCycle}
                  onValueChange={(v) => setBillingCycle(v as "monthly" | "annual")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual (save ~17%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="admin@acme.com"
                />
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{name || "New Organization"}</p>
                  <p className="text-sm text-muted-foreground">{domain || "—"}</p>
                </div>
                <Badge className={planConfig.className}>{planConfig.label}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {enabledCount} of {initialFeatures.length} features enabled
              </p>

              {(Object.entries(featuresByCategory) as [FeatureFlagCategory, typeof initialFeatures][]).map(
                ([cat, features]) => (
                  <div key={cat}>
                    <h4 className="text-sm font-medium mb-2">{categoryConfig[cat].label}</h4>
                    <div className="space-y-1">
                      {features.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between py-1.5 px-3 rounded text-sm"
                        >
                          <span className={planFeatures[f.id] ? "" : "text-muted-foreground"}>
                            {f.name}
                          </span>
                          {planFeatures[f.id] ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="gap-2">
          {step === "preview" && (
            <Button variant="outline" onClick={() => setStep("details")}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === "details" ? (
            <Button
              onClick={() => setStep("preview")}
              disabled={!name.trim()}
              className="ai-gradient text-primary-foreground"
            >
              Review Features
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createOrg.isPending}
              className="ai-gradient text-primary-foreground"
            >
              {createOrg.isPending ? "Creating..." : "Create Organization"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
