import {
  CreditCard,
  Users,
  Clock,
  Globe,
  Shield,
  Key,
  Check,
  X,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Organization, OrgBilling } from "@/hooks/useOrganizations";

interface OrgDetailOverviewProps {
  org: Organization;
  billing: OrgBilling | null;
}

export function OrgDetailOverview({ org, billing }: OrgDetailOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Plan</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold capitalize">{org.plan}</span>
            </div>
            {billing && (
              <p className="text-xs text-muted-foreground mt-1">
                ${billing.amount}/{billing.billing_cycle === "monthly" ? "mo" : "yr"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Status</span>
            </div>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={
                  org.status === "active"
                    ? "bg-success/15 text-success border-success/30"
                    : org.status === "suspended"
                      ? "bg-destructive/15 text-destructive border-destructive/30"
                      : "bg-warning/15 text-warning border-warning/30"
                }
              >
                {org.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Retention</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold">{org.retention_days}</span>
              <span className="text-muted-foreground"> days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Globe className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Data Residency</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold">{org.data_residency || "US"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access & Compliance */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Access & Compliance
          </CardTitle>
          <CardDescription>Security and compliance settings for this organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Globe,
                label: "Data Residency",
                sub: "Primary data location",
                value: <Badge variant="secondary">{org.data_residency || "US"}</Badge>,
              },
              {
                icon: Clock,
                label: "Data Retention",
                sub: "Interview data kept for",
                value: <Badge variant="secondary">{org.retention_days} days</Badge>,
              },
              {
                icon: Shield,
                label: "Consent Configured",
                sub: "Candidate consent flow",
                value: org.consent_configured ? (
                  <Check className="h-5 w-5 text-success" />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                ),
              },
              {
                icon: Key,
                label: "SSO Enabled",
                sub: "Single sign-on",
                value: org.sso_enabled ? (
                  <Check className="h-5 w-5 text-success" />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                ),
              },
              {
                icon: Shield,
                label: "GDPR Compliant",
                sub: "EU regulation status",
                value: org.gdpr_compliant ? (
                  <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                    Compliant
                  </Badge>
                ) : (
                  <Badge variant="destructive">Non-Compliant</Badge>
                ),
              },
              {
                icon: Building2,
                label: "Industry",
                sub: org.industry || "Not specified",
                value: <Badge variant="secondary" className="capitalize">{org.industry || "—"}</Badge>,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
                {item.value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
