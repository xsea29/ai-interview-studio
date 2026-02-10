import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Mail,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type PageState = "loading" | "invalid" | "preview" | "signup" | "verify-email" | "accepting";

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

const InviteJoinPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<PageState>("loading");
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const validateToken = useCallback(async () => {
    if (!token) {
      setState("invalid");
      setErrorMessage("No invite token provided.");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("validate-invite", {
        body: { token },
      });

      if (error || data?.error) {
        setState("invalid");
        setErrorMessage(data?.error || error?.message || "Invalid invite.");
        return;
      }

      setInviteData(data);
      setState("preview");
    } catch {
      setState("invalid");
      setErrorMessage("Failed to validate invite. Please try again.");
    }
  }, [token]);

  // Handle post-verification redirect
  const acceptInvite = useCallback(async () => {
    if (!token) return;
    setState("accepting");

    try {
      const { data, error } = await supabase.functions.invoke("accept-invite", {
        body: { token },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Failed to accept invite");
        setState("preview");
        return;
      }

      toast.success("Welcome! Redirecting to onboarding...");
      navigate(`/onboarding/${data.organizationId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setState("preview");
    }
  }, [token, navigate]);

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      // User just verified email, try to accept invite
      acceptInvite();
      return;
    }
    validateToken();
  }, [validateToken, searchParams, acceptInvite]);

  // Listen for auth state changes (email verification)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && state === "verify-email") {
        acceptInvite();
      }
    });
    return () => subscription.unsubscribe();
  }, [state, acceptInvite]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: inviteData.email,
        password: formData.password,
        options: {
          data: {
            display_name: `${formData.firstName} ${formData.lastName}`.trim(),
          },
          emailRedirectTo: `${window.location.origin}/onboarding/join/${token}?verified=true`,
        },
      });

      if (error) {
        toast.error(error.message);
        setSubmitting(false);
        return;
      }

      setState("verify-email");
    } catch {
      toast.error("Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  const enabledFeatureCount = inviteData?.features.filter((f) => f.enabled).length ?? 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          {state === "loading" && <LoadingState />}
          {state === "invalid" && <InvalidState message={errorMessage} />}
          {state === "preview" && inviteData && (
            <PreviewState
              data={inviteData}
              featureCount={enabledFeatureCount}
              onGetStarted={() => setState("signup")}
            />
          )}
          {state === "signup" && inviteData && (
            <SignupState
              email={inviteData.email}
              orgName={inviteData.organization.name}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSignup}
              submitting={submitting}
              onBack={() => setState("preview")}
            />
          )}
          {state === "verify-email" && inviteData && (
            <VerifyEmailState email={inviteData.email} />
          )}
          {state === "accepting" && <AcceptingState />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function LoadingState() {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Validating your invite...</p>
      </CardContent>
    </Card>
  );
}

function InvalidState({ message }: { message: string }) {
  return (
    <Card className="card-elevated border-destructive/30">
      <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Invalid Invite</h2>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Contact your administrator if you believe this is an error.
        </p>
      </CardContent>
    </Card>
  );
}

function PreviewState({
  data,
  featureCount,
  onGetStarted,
}: {
  data: InviteData;
  featureCount: number;
  onGetStarted: () => void;
}) {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-8 pb-6 space-y-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Join {data.organization.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              You've been invited to set up this organization
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-muted/50 rounded-xl p-4">
          <InfoRow label="Plan">
            <Badge variant="secondary" className="capitalize">
              {data.organization.plan}
            </Badge>
          </InfoRow>
          {data.organization.industry && (
            <InfoRow label="Industry">{data.organization.industry}</InfoRow>
          )}
          {data.organization.size && (
            <InfoRow label="Size">{data.organization.size}</InfoRow>
          )}
          <InfoRow label="Features">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {featureCount} enabled
            </span>
          </InfoRow>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
          <Shield className="h-4 w-4 text-accent-foreground shrink-0" />
          <span>Your data is encrypted and stored securely. You'll set up your account in the next step.</span>
        </div>

        <Button onClick={onGetStarted} className="w-full ai-gradient text-primary-foreground" size="lg">
          Get Started
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
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

function SignupState({
  email,
  orgName,
  formData,
  setFormData,
  onSubmit,
  submitting,
  onBack,
}: {
  email: string;
  orgName: string;
  formData: { firstName: string; lastName: string; password: string };
  setFormData: (d: typeof formData) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onBack: () => void;
}) {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-8 pb-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Create Your Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your account for {orgName}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled className="mt-1.5 bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="mt-1.5"
                placeholder="Jane"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="mt-1.5"
                placeholder="Smith"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="mt-1.5"
              placeholder="Min 8 characters"
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full ai-gradient text-primary-foreground" size="lg">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Account
          </Button>

          <Button type="button" variant="ghost" onClick={onBack} className="w-full text-sm">
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function VerifyEmailState({ email }: { email: string }) {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-8 pb-8 flex flex-col items-center gap-5 text-center">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Check Your Email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the link in the email to verify your account and continue.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3">
          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
          <span>You'll be redirected automatically after verification.</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AcceptingState() {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Setting up your organization...</p>
      </CardContent>
    </Card>
  );
}

export default InviteJoinPage;
