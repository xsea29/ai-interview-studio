import { motion } from "framer-motion";
import { 
  Sparkles, Clock, MessageSquare, ArrowRight, Shield, 
  Calendar, Globe, User, Briefcase, FileText, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CandidateWelcomeProps {
  candidateName?: string;
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  interviewType?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  timeZone?: string;
  duration?: number;
  questionCount: number;
  instructions?: string[];
  onStart: () => void;
}

export function CandidateWelcome({
  candidateName,
  companyName,
  jobTitle,
  recruiterName,
  interviewType = "Technical",
  scheduledDate = "March 5, 2026",
  scheduledTime = "10:00 AM",
  timeZone = "IST (UTC+5:30)",
  duration = 25,
  questionCount,
  instructions = [
    "Ensure you are in a quiet, well-lit environment.",
    "Have a stable internet connection throughout the interview.",
    "Speak clearly into your microphone when answering.",
    "You cannot pause or restart the interview once it begins.",
    "Your responses will be recorded and analyzed by AI.",
  ],
  onStart,
}: CandidateWelcomeProps) {
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4, ease: "easeOut" as const },
  });

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl w-full mx-auto py-2"
    >
      {/* Hero */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="relative inline-flex mb-3"
        >
          <div className="h-12 w-12 rounded-xl ai-gradient flex items-center justify-center ai-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(0.2)} className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
          {candidateName ? `Hi ${candidateName}, Welcome!` : "Welcome to Your Interview"}
        </motion.h1>
        <motion.p {...fadeUp(0.3)} className="text-muted-foreground text-sm max-w-md mx-auto">
          You've been invited by <span className="font-medium text-foreground">{recruiterName}</span> at{" "}
          <span className="font-medium text-foreground">{companyName}</span>
        </motion.p>
      </div>

      {/* Interview Details Card */}
      <motion.div
        {...fadeUp(0.4)}
        className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-3"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Interview Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Briefcase, label: "Position", value: jobTitle },
            { icon: FileText, label: "Interview Type", value: interviewType },
            { icon: Calendar, label: "Scheduled", value: `${scheduledDate} · ${scheduledTime}` },
            { icon: Globe, label: "Time Zone", value: timeZone },
            { icon: Clock, label: "Duration", value: `~${duration} minutes` },
            { icon: MessageSquare, label: "Questions", value: `${questionCount} questions` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-muted-foreground">{item.label}</div>
                <div className="text-sm font-medium truncate">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Instructions Card */}
      <motion.div
        {...fadeUp(0.5)}
        className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-4"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Instructions
        </h3>
        <ul className="space-y-2.5">
          {instructions.map((instruction, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">{i + 1}</span>
              </div>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp(0.6)}>
        <Button onClick={onStart} size="lg" className="ai-gradient w-full h-12 text-sm font-semibold gap-2 group">
          <Play className="h-4 w-4" />
          Join Interview
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-muted-foreground/60">
          <Shield className="h-3 w-3" />
          <span>End-to-end encrypted · GDPR compliant</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
