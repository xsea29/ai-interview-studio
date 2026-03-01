import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  CheckCircle, 
  Send,
  Sparkles,
  Wifi,
  PhoneOff,
  Circle,
  Clock,
  MessageSquare,
  ArrowRight,
  Shield,
  Briefcase,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateConsentScreen } from "@/components/interview/CandidateConsentScreen";
import { FailureRecoveryBanner } from "@/components/interview/FailureRecoveryBanner";
import { CandidateWelcome } from "@/components/candidate/CandidateWelcome";
import { CandidateChecklist } from "@/components/candidate/CandidateChecklist";
import { CandidateInterview } from "@/components/candidate/CandidateInterview";
import { CandidateComplete } from "@/components/candidate/CandidateComplete";
import { CandidateIdentityVerification } from "@/components/candidate/CandidateIdentityVerification";

type CandidateStep = "welcome" | "consent" | "checklist" | "verification" | "interview" | "complete";

const companyBranding = {
  name: "Acme Inc",
  logoUrl: null as string | null,
  primaryColor: "#0ea5e9",
  recruiterName: "Sarah Chen",
  recruiterEmail: "sarah@acme.com",
  jobTitle: "Senior Frontend Developer",
};

const questions = [
  "Tell me about a challenging project you worked on and how you approached it.",
  "How do you handle disagreements with team members about technical decisions?",
  "Describe your experience with React and TypeScript in production applications.",
  "What strategies do you use to optimize frontend performance?",
  "Tell me about a time you had to learn a new technology quickly.",
  "How do you approach code reviews and giving constructive feedback?",
  "Describe your ideal development workflow and tooling setup.",
  "What excites you most about this role and our company?"
];

const CandidateExperience = () => {
  const [currentStep, setCurrentStep] = useState<CandidateStep>("welcome");
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);
  const [checklistItems, setChecklistItems] = useState({
    quiet: false,
    mic: false,
    camera: false,
    network: false,
    consent: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const totalQuestions = questions.length;

  const handleStartChecklist = () => setCurrentStep("consent");

  const handleConsent = () => setCurrentStep("checklist");

  const handleDecline = () => {
    window.location.href = "/";
  };

  const handleStartVerification = () => setCurrentStep("verification");

  const handleVerificationComplete = (photoData: string, aadhaarData: string) => {
    // In production, store these securely
    console.log("Identity verified - photo and aadhaar captured");
    setCurrentStep("interview");
    setTimeout(() => setIsAiSpeaking(false), 3000);
  };

  const handleStartInterview = () => {
    setCurrentStep("interview");
    setTimeout(() => setIsAiSpeaking(false), 3000);
  };

  const handleSubmitAnswer = () => {
    if (currentQuestion < totalQuestions - 1) {
      setIsAiSpeaking(true);
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => setIsAiSpeaking(false), 2500);
    } else {
      setCurrentStep("complete");
    }
  };

  const handleRetry = () => setShowRecoveryBanner(false);

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview? Your progress will be saved.")) {
      setCurrentStep("complete");
    }
  };

  const allChecked = Object.values(checklistItems).every(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Refined header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {companyBranding.logoUrl ? (
              <img 
                src={companyBranding.logoUrl} 
                alt={companyBranding.name} 
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                {companyBranding.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">{companyBranding.name}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">AI Interview Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Briefcase className="h-3.5 w-3.5" />
              {companyBranding.jobTitle}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Step indicator for non-interview steps */}
        {currentStep !== "interview" && currentStep !== "complete" && currentStep !== "verification" && (
          <div className="container px-4 sm:px-6 pt-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                {["welcome", "consent", "checklist"].map((step, i) => {
                  const stepOrder = ["welcome", "consent", "checklist"];
                  const currentIndex = stepOrder.indexOf(currentStep);
                  const isActive = i === currentIndex;
                  const isDone = i < currentIndex;
                  return (
                    <div key={step} className="flex items-center gap-2 flex-1">
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        isDone ? "bg-primary" : isActive ? "bg-primary/60" : "bg-border"
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showRecoveryBanner && (
          <div className="container px-4 sm:px-6">
            <FailureRecoveryBanner onRetry={handleRetry} />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center py-4 sm:py-6 px-4 sm:px-6 overflow-auto">
          <AnimatePresence mode="wait">
            {currentStep === "welcome" && (
              <CandidateWelcome
                candidateName="Alex"
                companyName={companyBranding.name}
                jobTitle={companyBranding.jobTitle}
                recruiterName={companyBranding.recruiterName}
                interviewType="Technical"
                scheduledDate="March 5, 2026"
                scheduledTime="10:00 AM"
                timeZone="IST (UTC+5:30)"
                duration={25}
                questionCount={totalQuestions}
                onStart={handleStartChecklist}
              />
            )}

            {currentStep === "consent" && (
              <CandidateConsentScreen
                companyName={companyBranding.name}
                jobTitle={companyBranding.jobTitle}
                duration={25}
                questionCount={totalQuestions}
                retentionPeriod="90 days"
                onConsent={handleConsent}
                onDecline={handleDecline}
              />
            )}

            {currentStep === "checklist" && (
              <CandidateChecklist
                checklistItems={checklistItems}
                setChecklistItems={setChecklistItems}
                allChecked={allChecked}
                onStart={handleStartVerification}
              />
            )}

            {currentStep === "verification" && (
              <CandidateIdentityVerification
                onComplete={handleVerificationComplete}
              />
            )}

            {currentStep === "interview" && (
              <CandidateInterview
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                questions={questions}
                isAiSpeaking={isAiSpeaking}
                isCameraOn={isCameraOn}
                onToggleCamera={() => setIsCameraOn(!isCameraOn)}
                onSubmitAnswer={handleSubmitAnswer}
                onEndInterview={handleEndInterview}
              />
            )}

            {currentStep === "complete" && (
              <CandidateComplete
                companyName={companyBranding.name}
                jobTitle={companyBranding.jobTitle}
                recruiterName={companyBranding.recruiterName}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-3 bg-card/50">
        <div className="container flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60 px-4">
          <span>Powered by InterviewFlux AI</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};

export default CandidateExperience;
