import { motion } from "framer-motion";
import { CheckCircle, Clock, Brain, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CandidateCompleteProps {
  companyName: string;
  jobTitle: string;
  recruiterName: string;
}

export function CandidateComplete({ companyName, jobTitle, recruiterName }: CandidateCompleteProps) {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg w-full mx-auto text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
        className="relative inline-flex mb-6"
      >
        <div className="h-20 w-20 rounded-full ai-gradient flex items-center justify-center ai-glow">
          <CheckCircle className="h-10 w-10 text-primary-foreground" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
      >
        Interview Complete
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-muted-foreground text-sm sm:text-base mb-8 max-w-sm mx-auto"
      >
        Thank you for completing your interview for{" "}
        <span className="font-medium text-foreground">{jobTitle}</span> at{" "}
        <span className="font-medium text-foreground">{companyName}</span>.
      </motion.p>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-xl border border-border bg-card p-5 sm:p-6 text-left mb-6"
      >
        <h3 className="text-sm font-semibold mb-4">What Happens Next</h3>
        <div className="space-y-4">
          {[
            { icon: Brain, title: "AI Analysis", desc: "Your responses are being analyzed for skills and competency fit", time: "Now" },
            { icon: Mail, title: "Recruiter Review", desc: `${recruiterName} will review your AI-powered evaluation`, time: "1-2 days" },
            { icon: Clock, title: "Decision", desc: "You'll hear back with next steps via email", time: "2-3 days" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  i === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                {i < 2 && <div className="w-px flex-1 bg-border mt-1.5" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="text-xs text-muted-foreground"
      >
        You may safely close this window. A confirmation email has been sent.
      </motion.p>
    </motion.div>
  );
}
