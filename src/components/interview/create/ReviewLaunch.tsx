import { motion } from "framer-motion";
import { Users, Briefcase, Settings, Send, Mail, Copy, FileDown, AlertCircle, Check, MessageSquare, Mic, Video, Brain, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateData, JobContextData, DeliveryMethod } from "@/pages/CreateInterview";

interface ReviewLaunchProps {
  candidates: CandidateData[];
  jobContext: JobContextData;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  onLaunch: () => void;
  onBack: () => void;
}

const typeIcons = {
  text: MessageSquare,
  audio: Mic,
  video: Video,
};

const typeLabels = {
  text: "AI Text Interview",
  audio: "AI Audio Interview",
  video: "AI Video Interview",
};

const deliveryOptions = [
  {
    type: "email" as const,
    icon: Mail,
    title: "Send interview links via email",
    description: "Candidates receive secure interview links directly",
    default: true,
  },
  {
    type: "manual" as const,
    icon: Copy,
    title: "Copy interview links manually",
    description: "Generate links to share through your preferred channel",
  },
  {
    type: "csv" as const,
    icon: FileDown,
    title: "Export interview links CSV",
    description: "Download a spreadsheet with all interview links",
  },
];

export function ReviewLaunch({
  candidates,
  jobContext,
  deliveryMethod,
  setDeliveryMethod,
  onLaunch,
  onBack,
}: ReviewLaunchProps) {
  const validCandidates = candidates.filter((c) => c.isValid);
  const invalidCandidates = candidates.filter((c) => !c.isValid);
  const TypeIcon = typeIcons[jobContext.interviewType];

  return (
    <div className="max-w-4xl">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main summary cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidates Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Candidates</h3>
                <p className="text-sm text-muted-foreground">Ready to receive interviews</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">{validCandidates.length} candidates imported</span>
                </div>
              </div>
              {invalidCandidates.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">{invalidCandidates.length} invalid emails skipped</span>
                  </div>
                </div>
              )}
            </div>

            {/* Preview some candidates */}
            {validCandidates.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Preview:</div>
                <div className="flex flex-wrap gap-2">
                  {validCandidates.slice(0, 5).map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-muted rounded-md"
                    >
                      {c.name || c.email}
                    </span>
                  ))}
                  {validCandidates.length > 5 && (
                    <span className="text-xs px-2 py-1 text-muted-foreground">
                      +{validCandidates.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Job Context Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card border border-border card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Job Context</h3>
                <p className="text-sm text-muted-foreground">AI interview configuration</p>
              </div>
            </div>

            <dl className="space-y-3">
              <div className="flex items-start justify-between">
                <dt className="text-sm text-muted-foreground">Job Title</dt>
                <dd className="text-sm font-medium text-right">{jobContext.title || "—"}</dd>
              </div>
              {jobContext.department && (
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Department</dt>
                  <dd className="text-sm font-medium text-right">{jobContext.department}</dd>
                </div>
              )}
              <div className="flex items-start justify-between">
                <dt className="text-sm text-muted-foreground">Experience Level</dt>
                <dd className="text-sm font-medium text-right capitalize">{jobContext.experienceLevel}</dd>
              </div>
              {jobContext.skills.length > 0 && (
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Skills</dt>
                  <dd className="flex flex-wrap justify-end gap-1 max-w-[200px]">
                    {jobContext.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <dt className="text-sm text-muted-foreground">Interview Type</dt>
                <dd className="flex items-center gap-2">
                  <TypeIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{typeLabels[jobContext.interviewType]}</span>
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Interview Rules */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-card border border-border card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">AI Interview Rules</h3>
                <p className="text-sm text-muted-foreground">Interview parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Brain className="h-4 w-4" />
                  <span className="text-xs">Questions</span>
                </div>
                <div className="text-lg font-semibold">{jobContext.questionCount}</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <div className="text-lg font-semibold">
                  ~{jobContext.questionCount * jobContext.timePerQuestion}m
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {jobContext.adaptiveDifficulty ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-muted-foreground" />
                )}
                <span className={jobContext.adaptiveDifficulty ? "" : "text-muted-foreground"}>
                  Adaptive difficulty enabled
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {jobContext.allowResumeReference ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-muted-foreground" />
                )}
                <span className={jobContext.allowResumeReference ? "" : "text-muted-foreground"}>
                  Resume reference allowed
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delivery method sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-card border border-border card-elevated p-6 sticky top-24"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Delivery Method</h3>
              </div>
            </div>

            <div className="space-y-3">
              {deliveryOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setDeliveryMethod({ type: option.type })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    deliveryMethod.type === option.type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <option.icon className={`h-5 w-5 mt-0.5 ${
                      deliveryMethod.type === option.type ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <div>
                      <div className="text-sm font-medium">{option.title}</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={onLaunch}
              className="w-full mt-6 ai-gradient ai-glow-sm gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Launch AI Interviews
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Candidates will receive a secure interview link
            </p>
          </motion.div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
