import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Mail,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Organization } from "@/hooks/useOrganizations";
import { planConfigs, type PlanType } from "@/lib/planFeatureConfig";

interface OrgSuccessStepProps {
  organization: Organization;
  onViewOrganization: () => void;
  onBackToList: () => void;
}

export function OrgSuccessStep({
  organization,
  onViewOrganization,
  onBackToList,
}: OrgSuccessStepProps) {
  const planConfig = planConfigs[(organization.plan as PlanType) || "starter"];

  const mockKeys = {
    production: `sk_prod_${organization.id.replace(/-/g, "").slice(0, 32)}`,
    test: `sk_test_${organization.id.replace(/-/g, "").slice(0, 32)}`,
    webhook: `https://api.aistudio.io/webhooks/${organization.id.slice(0, 8)}`,
  };

  const [showKeys, setShowKeys] = useState({
    production: false,
    test: false,
    webhook: false,
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 16) return key;
    return `${key.slice(0, 10)}...${key.slice(-6)}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Success Header */}
      <Card className="card-elevated border-success/30 bg-success/[0.03]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-success/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">
                Organization Created Successfully
              </h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{organization.name}</span> has been
                created with the{" "}
                <Badge className={planConfig.className} variant="secondary">
                  {planConfig.label}
                </Badge>{" "}
                plan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Summary */}
      <Card className="card-elevated">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            Organization Details
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{organization.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Domain</p>
              <p className="font-medium">{organization.domain || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="secondary" className="status-badge bg-warning/15 text-warning">
                Pending Activation
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Owner</p>
              <p className="font-medium">{organization.owner_email}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span>
              Invitation email sent to{" "}
              <span className="font-medium text-foreground">{organization.owner_email}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="card-elevated">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">API Keys</p>
            <p className="text-xs text-warning font-medium">⚠️ Save these securely</p>
          </div>

          <div className="space-y-3">
            <KeyRow
              label="Production Key"
              value={mockKeys.production}
              show={showKeys.production}
              onToggle={() => setShowKeys((p) => ({ ...p, production: !p.production }))}
              onCopy={() => copyToClipboard(mockKeys.production, "Production key")}
              maskFn={maskKey}
            />
            <KeyRow
              label="Test Key"
              value={mockKeys.test}
              show={showKeys.test}
              onToggle={() => setShowKeys((p) => ({ ...p, test: !p.test }))}
              onCopy={() => copyToClipboard(mockKeys.test, "Test key")}
              maskFn={maskKey}
            />
            <KeyRow
              label="Webhook URL"
              value={mockKeys.webhook}
              show={showKeys.webhook}
              onToggle={() => setShowKeys((p) => ({ ...p, webhook: !p.webhook }))}
              onCopy={() => copyToClipboard(mockKeys.webhook, "Webhook URL")}
              maskFn={maskKey}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Keys can be regenerated later from the organization settings.
          </p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="card-elevated border-primary/20 bg-primary/[0.02]">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowRight className="h-4 w-4 text-primary" />
            What Happens Next
          </div>

          <div className="space-y-3 text-sm">
            <NextStepRow
              number={1}
              title="Owner receives onboarding email"
              description={`Sent to ${organization.owner_email} with a secure setup link (expires in 24h)`}
            />
            <NextStepRow
              number={2}
              title="Owner completes onboarding"
              description="Account creation, payment, team setup, integrations, and compliance"
            />
            <NextStepRow
              number={3}
              title="Organization becomes active"
              description="Status changes from pending-activation to active, workspace ready"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBackToList}>
          Back to Organizations
        </Button>
        <Button onClick={onViewOrganization} className="ai-gradient text-primary-foreground">
          View Organization
          <ExternalLink className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

function KeyRow({
  label,
  value,
  show,
  onToggle,
  onCopy,
  maskFn,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onCopy: () => void;
  maskFn: (v: string) => string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 border border-border">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-mono truncate">{show ? value : maskFn(value)}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function NextStepRow({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
        {number}
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
