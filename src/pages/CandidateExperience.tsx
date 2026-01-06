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
  AlertCircle,
  Send,
  Sparkles,
  Wifi,
  PhoneOff,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CandidateStep = "welcome" | "checklist" | "interview" | "complete";

const CandidateExperience = () => {
  const [currentStep, setCurrentStep] = useState<CandidateStep>("welcome");
  const [checklistItems, setChecklistItems] = useState({
    quiet: false,
    mic: false,
    camera: false,
    network: false,
    consent: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const totalQuestions = 8;

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

  const handleStartChecklist = () => {
    setCurrentStep("checklist");
  };

  const handleStartInterview = () => {
    setCurrentStep("interview");
    // Simulate AI speaking first question
    setTimeout(() => setIsAiSpeaking(false), 3000);
  };

  const handleSubmitAnswer = () => {
    setIsRecording(false);
    if (currentQuestion < totalQuestions - 1) {
      setIsAiSpeaking(true);
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => setIsAiSpeaking(false), 2500);
    } else {
      setCurrentStep("complete");
    }
  };

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview? Your progress will be saved.")) {
      setCurrentStep("complete");
    }
  };

  const allChecked = Object.values(checklistItems).every(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg ai-gradient">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold hidden sm:inline">InterviewAI</span>
          </div>
          <span className="text-xs text-muted-foreground text-right">
            Senior Frontend Developer Interview
          </span>
        </div>
      </header>

      <main className="container py-6 md:py-8 px-4">
        <AnimatePresence mode="wait">
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl ai-gradient mx-auto mb-6 ai-glow">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold mb-3">
                Welcome to Your AI Interview
              </h1>
              <p className="text-muted-foreground mb-8 text-sm md:text-base">
                You've been invited to complete an AI-powered interview for the 
                <strong className="text-foreground"> Senior Frontend Developer</strong> position at Acme Inc.
              </p>
              
              <div className="bg-card border border-border rounded-xl p-5 md:p-6 mb-6 text-left">
                <h3 className="font-medium mb-3">What to expect:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>8 questions tailored to the role</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Approximately 12-15 minutes to complete</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>AI will adapt questions based on your responses</span>
                  </li>
                </ul>
              </div>

              <Button onClick={handleStartChecklist} size="lg" className="ai-gradient w-full">
                Get Started
              </Button>
            </motion.div>
          )}

          {currentStep === "checklist" && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto"
            >
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">
                Environment Check
              </h2>
              <p className="text-muted-foreground mb-6 text-center text-sm">
                Please confirm the following before starting
              </p>

              <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-3 md:space-y-4">
                <ChecklistItem
                  icon={Volume2}
                  title="Quiet Environment"
                  description="Find a quiet space with minimal distractions"
                  checked={checklistItems.quiet}
                  onChange={(v) => setChecklistItems({ ...checklistItems, quiet: v })}
                />
                <ChecklistItem
                  icon={Mic}
                  title="Microphone Access"
                  description="Allow access to your microphone for audio recording"
                  checked={checklistItems.mic}
                  onChange={(v) => setChecklistItems({ ...checklistItems, mic: v })}
                />
                <ChecklistItem
                  icon={Video}
                  title="Camera Access"
                  description="Allow access to your camera for video recording"
                  checked={checklistItems.camera}
                  onChange={(v) => setChecklistItems({ ...checklistItems, camera: v })}
                />
                <ChecklistItem
                  icon={Wifi}
                  title="Stable Internet"
                  description="Ensure you have a stable internet connection"
                  checked={checklistItems.network}
                  onChange={(v) => setChecklistItems({ ...checklistItems, network: v })}
                />
                <div className="pt-4 border-t border-border">
                  <ChecklistItem
                    icon={CheckCircle}
                    title="I Consent"
                    description="I agree to have my responses recorded and analyzed"
                    checked={checklistItems.consent}
                    onChange={(v) => setChecklistItems({ ...checklistItems, consent: v })}
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleStartInterview}
                disabled={!allChecked}
                size="lg"
                className="ai-gradient w-full mt-6"
              >
                Begin Interview
              </Button>
            </motion.div>
          )}

          {currentStep === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Progress bar */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Recording indicator */}
                    {isRecording && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-destructive/10 rounded-full">
                        <Circle className="w-2 h-2 fill-destructive text-destructive animate-pulse" />
                        <span className="text-xs text-destructive font-medium">Recording</span>
                      </div>
                    )}
                    <span className="font-medium">
                      {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full ai-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
                {/* AI Avatar - Center (takes 2 cols on large screens) */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <div className="relative aspect-video bg-card border border-border rounded-xl overflow-hidden">
                    {/* AI visualization */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
                      <div className="relative">
                        <motion.div
                          animate={isAiSpeaking ? {
                            scale: [1, 1.08, 1],
                          } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full ai-gradient flex items-center justify-center ai-glow"
                        >
                          <Brain className="h-12 w-12 md:h-16 md:w-16 text-primary-foreground" />
                        </motion.div>
                        {isAiSpeaking && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1"
                          >
                            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
                            <div className="w-1.5 h-5 rounded-full bg-primary animate-pulse delay-75" />
                            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse delay-150" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* AI Status indicator */}
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        isAiSpeaking ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isAiSpeaking ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                        <span className="text-xs font-medium">
                          {isAiSpeaking ? "AI Speaking" : "Listening"}
                        </span>
                      </div>
                    </div>

                    {/* Question overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-4 md:p-6">
                      <p className="text-base md:text-lg font-medium">
                        {isAiSpeaking ? (
                          <span className="text-muted-foreground italic">AI is asking the question...</span>
                        ) : (
                          questions[currentQuestion]
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Candidate video - Top-left (1 col on large screens) */}
                <div className="order-1 lg:order-2">
                  <div className="relative aspect-[4/3] bg-card border border-border rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      {isCameraOn ? (
                        <Video className="h-8 w-8 text-muted-foreground" />
                      ) : (
                        <VideoOff className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    {/* Your video label */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-xs font-medium">
                      You
                    </div>
                    {/* Recording indicator on video */}
                    {isRecording && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-destructive rounded-full">
                        <div className="w-2 h-2 rounded-full bg-destructive-foreground animate-pulse" />
                        <span className="text-xs text-destructive-foreground font-medium">REC</span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Button
                      variant={isCameraOn ? "outline" : "destructive"}
                      size="icon"
                      className="rounded-full h-11 w-11 md:h-12 md:w-12"
                      onClick={() => setIsCameraOn(!isCameraOn)}
                    >
                      {isCameraOn ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      size="icon"
                      className={`rounded-full h-12 w-12 md:h-14 md:w-14 ${!isRecording ? "ai-gradient" : ""}`}
                      onClick={() => setIsRecording(!isRecording)}
                      disabled={isAiSpeaking || !isMicOn}
                    >
                      {isRecording || !isMicOn ? (
                        <MicOff className="h-5 w-5 md:h-6 md:w-6" />
                      ) : (
                        <Mic className="h-5 w-5 md:h-6 md:w-6" />
                      )}
                    </Button>
                    <Button
                      variant={isMicOn ? "outline" : "destructive"}
                      size="icon"
                      className="rounded-full h-11 w-11 md:h-12 md:w-12"
                      onClick={() => {
                        setIsMicOn(!isMicOn);
                        if (isRecording) setIsRecording(false);
                      }}
                    >
                      {isMicOn ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!isRecording}
                      className="w-full gap-2 ai-gradient"
                    >
                      <Send className="h-4 w-4" />
                      Submit Answer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleEndInterview}
                    >
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Interview
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full ai-gradient mx-auto mb-6 ai-glow"
              >
                <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-primary-foreground" />
              </motion.div>
              
              <h1 className="text-xl md:text-2xl font-semibold mb-3">
                Interview Complete!
              </h1>
              <p className="text-muted-foreground mb-8 text-sm md:text-base">
                Thank you for completing your AI interview. Your responses have been recorded 
                and will be analyzed by our AI system.
              </p>

              <div className="bg-card border border-border rounded-xl p-5 md:p-6 text-left mb-6">
                <h3 className="font-medium mb-3">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>AI analyzes your responses and generates insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>The recruiter reviews your AI-powered evaluation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>You'll hear back within 2-3 business days</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                You can close this window now.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

function ChecklistItem({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  required,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
        checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
    >
      <div className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg shrink-0 ${
        checked ? "bg-primary" : "bg-muted"
      }`}>
        <Icon className={`h-4 w-4 md:h-5 md:w-5 ${checked ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium flex items-center gap-2 text-sm md:text-base">
          {title}
          {required && <span className="text-xs text-destructive">Required</span>}
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
        checked ? "border-primary bg-primary" : "border-muted-foreground"
      }`}>
        {checked && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
      </div>
    </button>
  );
}

export default CandidateExperience;
