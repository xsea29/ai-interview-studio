import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CandidateImport } from "@/components/interview/create/CandidateImport";
import { JobContextSetup } from "@/components/interview/create/JobContextSetup";
import { QuestionGeneration, InterviewQuestion } from "@/components/interview/create/QuestionGeneration";
import { AccessPolicyConfig, AccessPolicy } from "@/components/interview/create/AccessPolicyConfig";
import { NotificationConfig, NotificationSettings } from "@/components/interview/create/NotificationConfig";
import { ReviewLaunch } from "@/components/interview/create/ReviewLaunch";
import { SuccessScreen } from "@/components/interview/create/SuccessScreen";

export interface CandidateData {
  name?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  atsId?: string;
  isValid: boolean;
}

export interface JobContextData {
  title: string;
  department: string;
  experienceLevel: "junior" | "mid" | "senior";
  description: string;
  skills: string[];
  interviewType: "text" | "audio" | "video";
  questionCount: number;
  timePerQuestion: number;
  adaptiveDifficulty: boolean;
  allowResumeReference: boolean;
}

export interface DeliveryMethod {
  type: "email" | "manual" | "csv";
}

const steps = [
  { id: 1, name: "Import Candidates", description: "Upload or enter candidates" },
  { id: 2, name: "Job Context", description: "Configure AI interview" },
  { id: 3, name: "Questions", description: "Generate & edit questions" },
  { id: 4, name: "Access & Notify", description: "Rules and notifications" },
  { id: 5, name: "Review & Launch", description: "Confirm and send" },
];

const CreateInterview = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [jobContext, setJobContext] = useState<JobContextData>({
    title: "",
    department: "",
    experienceLevel: "mid",
    description: "",
    skills: [],
    interviewType: "text",
    questionCount: 8,
    timePerQuestion: 3,
    adaptiveDifficulty: true,
    allowResumeReference: false,
  });
  const [accessPolicy, setAccessPolicy] = useState<AccessPolicy>({
    validFrom: new Date().toISOString().slice(0, 16),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    maxAttempts: 1,
    canResume: true,
    deviceLock: false,
    autoExpireMinutes: 15,
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    sendInvite: true,
    reminder24h: true,
    reminder2h: false,
    expiryWarning: true,
    onSubmitted: true,
    onFailure: true,
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>({ type: "email" });
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SuccessScreen candidateCount={candidates.filter(c => c.isValid).length} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-4 sm:py-8 px-4 sm:px-6">
        {/* Back button and title */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 sm:h-9 sm:w-9">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Create AI Interview</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-0.5 hidden sm:block">
              Import candidates and configure your AI-powered interview
            </p>
          </div>
        </div>

        {/* Progress steps - Full width, no scroll */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all flex-shrink-0 ${
                      currentStep > step.id
                        ? "bg-primary border-primary"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    ) : (
                      <span className="text-xs sm:text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                  {/* Mobile step name */}
                  <div className="sm:hidden">
                    <div
                      className={`text-xs font-medium whitespace-nowrap ${
                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.name.split(' ')[0]}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <CandidateImport
                candidates={candidates}
                setCandidates={setCandidates}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <JobContextSetup
                data={jobContext}
                setData={setJobContext}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <QuestionGeneration
                jobContext={jobContext}
                questions={questions}
                setQuestions={setQuestions}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <AccessNotifyStep
                accessPolicy={accessPolicy}
                setAccessPolicy={setAccessPolicy}
                notifications={notifications}
                setNotifications={setNotifications}
                jobTitle={jobContext.title}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <ReviewLaunch
                candidates={candidates}
                jobContext={jobContext}
                accessPolicy={accessPolicy}
                notifications={notifications}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                onLaunch={handleLaunch}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Step 3: Access & Notify
interface AccessNotifyStepProps {
  accessPolicy: AccessPolicy;
  setAccessPolicy: (policy: AccessPolicy) => void;
  notifications: NotificationSettings;
  setNotifications: (settings: NotificationSettings) => void;
  jobTitle: string;
  onNext: () => void;
  onBack: () => void;
}

function AccessNotifyStep({
  accessPolicy,
  setAccessPolicy,
  notifications,
  setNotifications,
  jobTitle,
  onNext,
  onBack,
}: AccessNotifyStepProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Access & Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Configure interview access rules and candidate notifications
        </p>
      </div>

      <AccessPolicyConfig policy={accessPolicy} onChange={setAccessPolicy} />
      <NotificationConfig
        settings={notifications}
        onChange={setNotifications}
        jobTitle={jobTitle || "the role"}
      />

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="ai-gradient">
          Continue to Review
        </Button>
      </div>
    </div>
  );
}

export default CreateInterview;
