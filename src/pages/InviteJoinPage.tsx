import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InviteBrandingPanel } from "@/components/invite/InviteBrandingPanel";
import { InvitePreviewCard } from "@/components/invite/InvitePreviewCard";
import { InviteSignupForm } from "@/components/invite/InviteSignupForm";
import { InviteEmailVerification } from "@/components/invite/InviteEmailVerification";
import {
  InviteLoadingScreen,
  InviteInvalidScreen,
  InviteAcceptingScreen,
} from "@/components/invite/InviteStatusScreens";

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
      acceptInvite();
      return;
    }
    validateToken();
  }, [validateToken, searchParams, acceptInvite]);

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

  // Full-screen states (no split panel)
  if (state === "loading") return <InviteLoadingScreen />;
  if (state === "invalid") return <InviteInvalidScreen message={errorMessage} />;
  if (state === "accepting") return <InviteAcceptingScreen />;

  // Split-panel layout for preview, signup, and verification
  return (
    <div className="min-h-screen flex">
      <InviteBrandingPanel
        orgName={inviteData?.organization.name}
        plan={inviteData?.organization.plan}
        industry={inviteData?.organization.industry}
      />

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {state === "preview" && inviteData && (
          <InvitePreviewCard
            data={inviteData}
            featureCount={enabledFeatureCount}
            onGetStarted={() => setState("signup")}
          />
        )}
        {state === "signup" && inviteData && (
          <InviteSignupForm
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
          <InviteEmailVerification email={inviteData.email} onVerified={acceptInvite} />
        )}
      </div>
    </div>
  );
};

export default InviteJoinPage;
