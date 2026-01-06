import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Video, Mic, Brain, Clock, Database, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  required: boolean;
}

interface CandidateConsentScreenProps {
  companyName: string;
  jobTitle: string;
  duration: number;
  questionCount: number;
  retentionPeriod: string;
  onConsent: () => void;
  onDecline: () => void;
}

export function CandidateConsentScreen({
  companyName,
  jobTitle,
  duration,
  questionCount,
  retentionPeriod,
  onConsent,
  onDecline,
}: CandidateConsentScreenProps) {
  const [consents, setConsents] = useState<Record<string, boolean>>({
    recording: false,
    aiEvaluation: false,
    dataStorage: false,
    privacyPolicy: false,
  });

  const consentItems: ConsentItem[] = [
    {
      id: "recording",
      icon: Video,
      title: "Audio & Video Recording",
      description: "Your responses will be recorded for evaluation purposes",
      required: true,
    },
    {
      id: "aiEvaluation",
      icon: Brain,
      title: "AI-Powered Evaluation",
      description: "Your responses will be analyzed by AI to assess skills and fit",
      required: true,
    },
    {
      id: "dataStorage",
      icon: Database,
      title: "Data Storage",
      description: `Your interview data will be stored for ${retentionPeriod} and shared with ${companyName}'s hiring team`,
      required: true,
    },
    {
      id: "privacyPolicy",
      icon: Shield,
      title: "Privacy Policy",
      description: "I have read and agree to the privacy policy and terms of service",
      required: true,
    },
  ];

  const allRequired = consentItems
    .filter(item => item.required)
    .every(item => consents[item.id]);

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [id]: checked }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Before We Begin</h2>
        <p className="text-sm text-muted-foreground">
          Please review and consent to the following before starting your interview for{" "}
          <strong className="text-foreground">{jobTitle}</strong> at{" "}
          <strong className="text-foreground">{companyName}</strong>
        </p>
      </div>

      {/* Interview Info */}
      <div className="flex items-center justify-center gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>~{duration} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <span>{questionCount} questions</span>
        </div>
      </div>

      {/* Consent Items */}
      <div className="space-y-3 mb-6">
        {consentItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg border transition-colors ${
                consents[item.id] 
                  ? "bg-success/5 border-success/20" 
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={item.id}
                  checked={consents[item.id]}
                  onCheckedChange={(checked) => handleConsentChange(item.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={item.id} 
                    className="flex items-center gap-2 cursor-pointer font-medium text-sm"
                  >
                    <Icon className={`h-4 w-4 ${consents[item.id] ? "text-success" : "text-muted-foreground"}`} />
                    {item.title}
                    {item.required && (
                      <span className="text-xs text-destructive">*</span>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    {item.description}
                  </p>
                </div>
                {consents[item.id] && (
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy Note */}
      <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground mb-6">
        <strong>Your Rights:</strong> You can request access to or deletion of your data at any time by contacting {companyName}. 
        Your information will only be used for recruitment purposes.
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={onConsent}
          disabled={!allRequired}
          className="w-full ai-gradient"
          size="lg"
        >
          I Agree - Start Interview
        </Button>
        <Button
          variant="ghost"
          onClick={onDecline}
          className="text-muted-foreground"
        >
          Decline & Exit
        </Button>
      </div>
    </motion.div>
  );
}
