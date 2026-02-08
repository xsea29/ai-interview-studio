import { CreditCard, Calendar, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { planConfigs, type PlanType } from "@/lib/planFeatureConfig";
import type { Organization, OrgBilling } from "@/hooks/useOrganizations";

interface OrgDetailBillingProps {
  org: Organization;
  billing: OrgBilling | null;
}

export function OrgDetailBilling({ org, billing }: OrgDetailBillingProps) {
  const planConfig = planConfigs[org.plan as PlanType] || planConfigs.starter;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Current Plan
          </CardTitle>
          <CardDescription>Billing & subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border-2 border-primary/20 bg-primary/5">
              <Badge className={planConfig.className}>{planConfig.label}</Badge>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${billing?.amount ?? planConfig.price.monthly}
                </span>
                <span className="text-muted-foreground">
                  /{billing?.billing_cycle === "annual" ? "yr" : "mo"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {planConfig.features.length} features included
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Next Billing</p>
                  <p className="text-sm text-muted-foreground">
                    {billing?.next_billing_date
                      ? new Date(billing.next_billing_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Auto-Renew</p>
                  <p className="text-sm text-muted-foreground">
                    {billing?.auto_renew ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Billing Status</p>
                <Badge
                  variant="outline"
                  className={
                    billing?.status === "active"
                      ? "bg-success/15 text-success border-success/30 mt-1"
                      : "bg-warning/15 text-warning border-warning/30 mt-1"
                  }
                >
                  {billing?.status || "Active"}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Billing Cycle</p>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {billing?.billing_cycle || "monthly"}
                </p>
              </div>
              {billing?.recipient_email && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">Invoice Recipient</p>
                  <p className="text-sm text-muted-foreground mt-1">{billing.recipient_email}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Available subscription tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.entries(planConfigs) as [PlanType, typeof planConfigs.starter][]).map(
              ([key, cfg]) => (
                <div
                  key={key}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    org.plan === key ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={cfg.className}>{cfg.label}</Badge>
                    {org.plan === key && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold">
                    ${cfg.price.monthly}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cfg.features.length} features
                  </p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
