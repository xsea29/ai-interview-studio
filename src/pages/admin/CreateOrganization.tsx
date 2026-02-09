import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OrgDetailsForm, type OrgFormData } from "@/components/admin/create-org/OrgDetailsForm";
import { PlanSelector } from "@/components/admin/create-org/PlanSelector";
import { OrgReviewStep } from "@/components/admin/create-org/OrgReviewStep";
import { OrgSuccessStep } from "@/components/admin/create-org/OrgSuccessStep";
import { useCreateOrganization, type CreateOrgInput, type Organization } from "@/hooks/useOrganizations";
import type { PlanType } from "@/lib/planFeatureConfig";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;

type Step = "details" | "review" | "success";

export default function CreateOrganization() {
  const navigate = useNavigate();
  const createOrg = useCreateOrganization();

  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState<OrgFormData>({
    name: "",
    domain: "",
    industry: "",
    size: "",
    ownerEmail: "",
    dataResidency: "US",
  });
  const [plan, setPlan] = useState<PlanType>("starter");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [createdOrg, setCreatedOrg] = useState<Organization | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = "Organization name is required";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      errs.name = "Name must be less than 100 characters";
    }

    if (formData.domain && !DOMAIN_REGEX.test(formData.domain)) {
      errs.domain = "Enter a valid domain (e.g., acme.com)";
    }

    if (!formData.ownerEmail.trim()) {
      errs.ownerEmail = "Owner email is required";
    } else if (!EMAIL_REGEX.test(formData.ownerEmail)) {
      errs.ownerEmail = "Enter a valid email address";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep("review");
    }
  };

  const handleCreate = async () => {
    const input: CreateOrgInput = {
      name: formData.name.trim(),
      domain: formData.domain.trim(),
      industry: formData.industry,
      size: formData.size,
      plan,
      ownerEmail: formData.ownerEmail.trim(),
      billingCycle,
    };
    const org = await createOrg.mutateAsync(input);
    setCreatedOrg(org);
    setStep("success");
  };

  const progressValue = step === "details" ? 50 : 100;
  const stepLabel =
    step === "details"
      ? "Set up a new organization with plan features. Owner will complete setup during onboarding."
      : step === "review"
        ? "Verify all details before creating the organization."
        : "";

  if (step === "success" && createdOrg) {
    return (
      <div className="space-y-6 animate-fade-in">
        <OrgSuccessStep
          organization={createdOrg}
          onViewOrganization={() => navigate(`/admin/organizations/${createdOrg.id}`)}
          onBackToList={() => navigate("/admin/organizations")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/organizations")}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Organizations
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Organization</h1>
          <p className="text-muted-foreground mt-1">{stepLabel}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress value={progressValue} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Step {step === "details" ? 1 : 2} of 2
          </p>
        </div>
      </div>

      {/* Content */}
      {step === "details" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <OrgDetailsForm data={formData} onChange={setFormData} errors={errors} />
            </CardContent>
          </Card>

          {/* Right: Plan Selector */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <PlanSelector
                plan={plan}
                onPlanChange={setPlan}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <OrgReviewStep
          formData={formData}
          plan={plan}
          billingCycle={billingCycle}
          confirmed={confirmed}
          onConfirmedChange={setConfirmed}
          onEditDetails={() => setStep("details")}
        />
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => {
            if (step === "review") {
              setStep("details");
            } else {
              navigate("/admin/organizations");
            }
          }}
        >
          {step === "review" ? (
            <>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Details
            </>
          ) : (
            "Cancel"
          )}
        </Button>

        <div className="flex gap-3">
          {step === "details" && (
            <Button variant="outline" onClick={() => navigate("/admin/organizations")}>
              Cancel
            </Button>
          )}
          {step === "details" ? (
            <Button
              onClick={handleNext}
              disabled={!formData.name.trim()}
              className="ai-gradient text-primary-foreground"
            >
              Review & Continue
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={createOrg.isPending || !confirmed}
              className="ai-gradient text-primary-foreground"
            >
              {createOrg.isPending ? "Creating..." : "Create Organization"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
