import { motion } from "framer-motion";
import { Building2, Sparkles, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InviteData {
  email: string;
  organization: {
    id: string;
    name: string;
    plan: string;
    domain: string | null;
    industry: string | null;
    size: string | null;
  };
  features: Array<{ feature_name: string; enabled: boolean }>;
}

interface InvitePreviewCardProps {
  data: InviteData;
  featureCount: number;
  onGetStarted: () => void;
}

export function InvitePreviewCard({ data, featureCount, onGetStarted }: InvitePreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Mobile branding */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg ai-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">InterviewFlux</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Building2 className="w-3.5 h-3.5" />
          Organization Invitation
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Join {data.organization.name}
        </h2>
        <p className="text-muted-foreground mt-1">
          You've been invited to set up and manage this organization on InterviewFlux.
        </p>
      </div>

      {/* Org details */}
      <div className="space-y-3 bg-muted/50 rounded-xl p-5 mb-6 border border-border">
        <InfoRow label="Organization">{data.organization.name}</InfoRow>
        <InfoRow label="Plan">
          <Badge variant="secondary" className="capitalize font-medium">
            {data.organization.plan}
          </Badge>
        </InfoRow>
        {data.organization.industry && (
          <InfoRow label="Industry">{data.organization.industry}</InfoRow>
        )}
        {data.organization.size && (
          <InfoRow label="Team Size">{data.organization.size}</InfoRow>
        )}
        <InfoRow label="Features">
          <span className="flex items-center gap-1.5 text-primary font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            {featureCount} enabled
          </span>
        </InfoRow>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 text-xs text-muted-foreground bg-accent/50 rounded-lg p-4 mb-6 border border-accent">
        <Shield className="h-4 w-4 text-accent-foreground shrink-0 mt-0.5" />
        <span>Your data is encrypted end-to-end and stored securely. You'll create your account in the next step.</span>
      </div>

      <Button
        onClick={onGetStarted}
        className="w-full h-11 ai-gradient text-primary-foreground font-medium group"
        size="lg"
      >
        Get Started
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </motion.div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  );
}
