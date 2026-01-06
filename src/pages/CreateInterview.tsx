import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CandidateImport } from "@/components/interview/create/CandidateImport";
import { JobContextSetup } from "@/components/interview/create/JobContextSetup";
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
  { id: 3, name: "Review & Launch", description: "Confirm and send" },
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
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>({ type: "email" });

  const handleNext = () => {
    if (currentStep < 3) {
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
      
      <main className="container py-8">
        {/* Back button and title */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create AI Interview</h1>
            <p className="text-muted-foreground mt-0.5">
              Import candidates and configure your AI-powered interview
            </p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-primary border-primary"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
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
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 lg:w-24 h-0.5 mx-4 ${
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
              <ReviewLaunch
                candidates={candidates}
                jobContext={jobContext}
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

export default CreateInterview;
