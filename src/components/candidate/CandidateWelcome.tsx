import { motion } from "framer-motion";
import { Sparkles, Clock, MessageSquare, ArrowRight, User, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CandidateWelcomeProps {
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  questionCount: number;
  onStart: () => void;
}

export function CandidateWelcome({ companyName, jobTitle, recruiterName, questionCount, onStart }: CandidateWelcomeProps) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl w-full mx-auto"
    >
      {/* Hero section */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="relative inline-flex mb-6"
        >
          <div className="h-20 w-20 rounded-2xl ai-gradient flex items-center justify-center ai-glow">
            <Sparkles className="h-9 w-9 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg bg-success flex items-center justify-center border-2 border-background">
            <Shield className="h-3.5 w-3.5 text-success-foreground" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
        >
          Welcome to Your Interview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto"
        >
          You've been invited by <span className="font-medium text-foreground">{recruiterName}</span> for the{" "}
          <span className="font-medium text-foreground">{jobTitle}</span> role at{" "}
          <span className="font-medium text-foreground">{companyName}</span>.
        </motion.p>
      </div>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid sm:grid-cols-3 gap-3 mb-8"
      >
        {[
          { icon: MessageSquare, label: `${questionCount} Questions`, desc: "Tailored to the role" },
          { icon: Clock, label: "~15 Minutes", desc: "Estimated duration" },
          { icon: Zap, label: "AI-Powered", desc: "Adaptive difficulty" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* What to expect */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-xl border border-border bg-card p-5 sm:p-6 mb-8"
      >
        <h3 className="text-sm font-semibold mb-4 text-foreground">How It Works</h3>
        <div className="space-y-4">
          {[
            { step: "1", title: "Review & Consent", desc: "Read the privacy terms and give your consent to proceed" },
            { step: "2", title: "Environment Check", desc: "Verify your camera, microphone, and internet connection" },
            { step: "3", title: "Complete Interview", desc: "Answer AI-generated questions at your own pace" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        <Button onClick={onStart} size="lg" className="ai-gradient w-full h-12 text-sm font-semibold gap-2 group">
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <p className="text-center text-[11px] text-muted-foreground/60 mt-3">
          Your data is encrypted and handled according to GDPR standards
        </p>
      </motion.div>
    </motion.div>
  );
}
