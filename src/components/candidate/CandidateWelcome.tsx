import { motion } from "framer-motion";
import { 
  Sparkles, Clock, MessageSquare, ArrowRight, Shield, 
  Calendar, Globe, Briefcase, FileText, Play, Info
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

  const detailItems = [
    { icon: Briefcase, label: "Position", value: jobTitle },
    { icon: FileText, label: "Type", value: interviewType },
    { icon: Calendar, label: "Date", value: scheduledDate },
    { icon: Clock, label: "Time", value: scheduledTime },
    { icon: Globe, label: "Timezone", value: timeZone },
    { icon: MessageSquare, label: "Questions", value: `${questionCount} questions` },
    { icon: Clock, label: "Duration", value: `~${duration} min` },
  ];

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        {/* Left column — Hero + Details */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Hero */}
          <motion.div {...fadeUp(0.1)} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl ai-gradient flex items-center justify-center ai-glow shrink-0">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {candidateName ? `Hi ${candidateName}, Welcome!` : "Welcome to Your Interview"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Invited by <span className="font-medium text-foreground">{recruiterName}</span> at{" "}
                  <span className="font-medium text-foreground">{companyName}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interview Details — flat list style */}
          <motion.div {...fadeUp(0.25)} className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Interview Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              {detailItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm font-semibold truncate">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA — large prominent button */}
          <motion.div {...fadeUp(0.5)} className="mt-auto">
            <Button onClick={onStart} size="lg" className="ai-gradient h-12 px-8 text-sm font-semibold gap-2.5 group">
              <Play className="h-4 w-4" />
              Join Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground/60">
              <Shield className="h-3 w-3" />
              <span>End-to-end encrypted · GDPR compliant</span>
            </div>
          </motion.div>
        </div>

        {/* Right column — Instructions */}
        <motion.div
          {...fadeUp(0.35)}
          className="lg:col-span-2 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Before You Begin
          </h2>
          <ul className="space-y-3">
            {instructions.map((instruction, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ul>

          {/* How it works mini-steps */}
          <div className="mt-6 pt-5 border-t border-border/60">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              How It Works
            </h3>
            <div className="space-y-2.5">
              {[
                { step: "1", text: "Give consent & verify environment" },
                { step: "2", text: "Complete identity verification" },
                { step: "3", text: "Answer AI-powered interview questions" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-foreground">{item.step}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
