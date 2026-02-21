import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Phase Components
import AccountCreation from "@/components/onboarding/AccountCreation";
import DomainVerification from "@/components/onboarding/DomainVerification";
import OrganizationSetup from "@/components/onboarding/OrganizationSetup";
import BrandIdentitySetup from "@/components/onboarding/BrandIdentitySetup";
import UserRoleSetup from "@/components/onboarding/UserRoleSetup";
import IntegrationSetup from "@/components/onboarding/IntegrationSetup";
import ConsentPrivacySetup from "@/components/onboarding/ConsentPrivacySetup";
import BillingActivation from "@/components/onboarding/BillingActivation";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";
import { OnboardingSupportButton } from "@/components/onboarding/OnboardingSupportButton";

export interface OnboardingData {
  // Phase 1: Account Creation
  account: {
    name: string;
    email: string;
    companyName: string;
    country: string;
    industry: string;
  };
  domainVerification: {
    method: "email" | "dns" | "file";
    status: "pending" | "verified" | "failed";
    domain: string;
  };
  // Phase 2: Organization
  organization: {
    legalName: string;
    displayName: string;
    companySize: string;
    departments: string[];
    functionalRoles: string[];
    experienceBands: string[];
    passwordPolicy: "basic" | "strong" | "enterprise";
    loginMethod: "email" | "sso" | "oauth";
    sessionTimeout: number;
    allowedRegions: string[];
    interviewTypes: string[];
    defaultDuration: number;
    maxAttempts: number;
    resumeAllowed: boolean;
    accessWindow: number;
  };
  // Phase 3: Brand & Identity
  brand: {
    logo: string | null;
    brandColor: string;
    companyDescription: string;
    recruiterSignature: string;
    candidateCompanyName: string;
    recruiterEmail: string;
    supportEmail: string;
    showPoweredBy: boolean;
    inviteTemplate: string;
    reminderTemplate: string;
    expiryTemplate: string;
  };
  // Phase 4: Users & Roles
  users: {
    invitedUsers: Array<{
      email: string;
      role: "admin" | "ta_manager" | "recruiter" | "viewer";
      status: "pending" | "active";
    }>;
    mfaRequired: boolean;
  };
  // Phase 5: Integrations
  integrations: {
    mode: "csv" | "ats";
    csvMappings: Array<{ source: string; target: string }>;
    atsProvider: string | null;
    syncFrequency: "hourly" | "daily";
  };
  // Phase 6: Consent & Privacy
  consent: {
    recordingConsent: boolean;
    aiEvaluationConsent: boolean;
    retentionDays: number;
    faceVoiceProcessing: boolean;
    fairUseDisclosure: boolean;
    hardDeleteAfterRetention: boolean;
    exportOnDelete: boolean;
  };
  // Phase 7: Billing
  billing: {
    plan: "pay_per_interview" | "credits" | "subscription";
    paymentMethod: string | null;
    autoRecharge: boolean;
    credits: number;
  };
}

const phases = [
  { id: 1, name: "Account", subSteps: ["Create Account", "Verify Domain"] },
  { id: 2, name: "Organization", subSteps: ["Company Profile", "Security", "Interview Config"] },
  { id: 3, name: "Brand", subSteps: ["Visual Identity", "Email Templates"] },
  { id: 4, name: "Team", subSteps: ["Invite Users", "Set Roles"] },
  { id: 5, name: "Data", subSteps: ["Import Method", "Field Mapping"] },
  { id: 6, name: "Privacy", subSteps: ["Consent Settings", "Data Governance"] },
  { id: 7, name: "Billing", subSteps: ["Choose Plan", "Activate"] },
];

const initialData: OnboardingData = {
  account: { name: "", email: "", companyName: "", country: "", industry: "" },
  domainVerification: { method: "email", status: "pending", domain: "" },
  organization: {
    legalName: "", displayName: "", companySize: "", departments: [],
    functionalRoles: [], experienceBands: [], passwordPolicy: "strong",
    loginMethod: "email", sessionTimeout: 30, allowedRegions: [],
    interviewTypes: ["text"], defaultDuration: 30, maxAttempts: 1,
    resumeAllowed: true, accessWindow: 7,
  },
  brand: {
    logo: null, brandColor: "#00b8d4", companyDescription: "",
    recruiterSignature: "", candidateCompanyName: "", recruiterEmail: "",
    supportEmail: "", showPoweredBy: true, inviteTemplate: "",
    reminderTemplate: "", expiryTemplate: "",
  },
  users: { invitedUsers: [], mfaRequired: false },
  integrations: { mode: "csv", csvMappings: [], atsProvider: null, syncFrequency: "daily" },
  consent: {
    recordingConsent: true, aiEvaluationConsent: true, retentionDays: 90,
    faceVoiceProcessing: false, fairUseDisclosure: true,
    hardDeleteAfterRetention: true, exportOnDelete: false,
  },
  billing: { plan: "credits", paymentMethod: null, autoRecharge: false, credits: 0 },
};

const CompanyOnboarding = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const updateData = <K extends keyof OnboardingData>(
    section: K,
    updates: Partial<OnboardingData[K]>
  ) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  const goToNextStep = () => {
    const phase = phases[currentPhase - 1];
    if (currentSubStep < phase.subSteps.length - 1) {
      setCurrentSubStep(prev => prev + 1);
    } else {
      setCompletedPhases(prev => [...prev, currentPhase]);
      if (currentPhase < 7) {
        setCurrentPhase(prev => prev + 1);
        setCurrentSubStep(0);
      } else {
        setCurrentPhase(8); // Complete state
      }
    }
  };

  const skipPhase = () => {
    setCompletedPhases(prev => [...prev, currentPhase]);
    if (currentPhase < 7) {
      setCurrentPhase(prev => prev + 1);
      setCurrentSubStep(0);
    } else {
      setCurrentPhase(8);
    }
  };

  const goToPrevStep = () => {
    if (currentSubStep > 0) {
      setCurrentSubStep(prev => prev - 1);
    } else if (currentPhase > 1) {
      const prevPhase = currentPhase - 1;
      setCurrentPhase(prevPhase);
      setCurrentSubStep(phases[prevPhase - 1].subSteps.length - 1);
    }
  };

  const renderPhaseContent = () => {
    if (currentPhase === 8) {
      return <OnboardingComplete data={data} />;
    }

    switch (currentPhase) {
      case 1:
        return currentSubStep === 0 ? (
          <AccountCreation data={data} updateData={updateData} onNext={goToNextStep} />
        ) : (
          <DomainVerification data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} />
        );
      case 2:
        return <OrganizationSetup data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} step={currentSubStep} />;
      case 3:
        return <BrandIdentitySetup data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} onSkip={skipPhase} step={currentSubStep} />;
      case 4:
        return <UserRoleSetup data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} onSkip={skipPhase} step={currentSubStep} />;
      case 5:
        return <IntegrationSetup data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} onSkip={skipPhase} step={currentSubStep} />;
      case 6:
        return <ConsentPrivacySetup data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} step={currentSubStep} />;
      case 7:
        return <BillingActivation data={data} updateData={updateData} onNext={goToNextStep} onBack={goToPrevStep} onSkip={skipPhase} step={currentSubStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      {currentPhase <= 7 && (
        <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-foreground">Company Onboarding</h1>
              <span className="text-sm text-muted-foreground">
                Phase {currentPhase} of 7
              </span>
            </div>
            
            {/* Phase Progress */}
            <div className="flex items-center gap-1">
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isCurrent = phase.id === currentPhase;
                
                return (
                  <div key={phase.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                          isCompleted && "bg-success text-success-foreground",
                          isCurrent && "bg-primary text-primary-foreground ai-glow-sm",
                          !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : phase.id}
                      </div>
                      <span className={cn(
                        "text-xs mt-1 hidden sm:block",
                        isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {phase.name}
                      </span>
                    </div>
                    {index < phases.length - 1 && (
                      <div className={cn(
                        "h-0.5 flex-1 mx-1",
                        isCompleted ? "bg-success" : "bg-border"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sub-step indicator */}
            <div className="flex items-center gap-2 mt-3">
              {phases[currentPhase - 1]?.subSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs",
                    index === currentSubStep 
                      ? "bg-primary/10 text-primary font-medium" 
                      : index < currentSubStep
                        ? "bg-success/10 text-success"
                        : "text-muted-foreground"
                  )}>
                    {index < currentSubStep && <Check className="w-3 h-3" />}
                    {step}
                  </div>
                  {index < phases[currentPhase - 1].subSteps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPhase}-${currentSubStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto px-4 py-8"
        >
          {renderPhaseContent()}
        </motion.div>
      </AnimatePresence>

      {currentPhase <= 7 && <OnboardingSupportButton />}
    </div>
  );
};

export default CompanyOnboarding;
