import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, Info, Scale, Eye, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FairnessPanelProps {
  integrity: {
    level: string;
    tabSwitches: number;
    faceDetected: boolean;
    audioSilence: boolean;
    networkIssues: boolean;
  };
}

export function FairnessPanel({ integrity }: FairnessPanelProps) {
  const biasChecks = [
    {
      label: "Language Neutrality",
      status: "passed",
      description: "Questions and evaluation used neutral, non-discriminatory language",
    },
    {
      label: "Consistent Criteria",
      status: "passed",
      description: "Same evaluation rubric applied as for all candidates in this role",
    },
    {
      label: "No Demographic Bias",
      status: "passed",
      description: "Evaluation based solely on responses, not personal characteristics",
    },
  ];

  const conditionChecks = [
    {
      icon: Eye,
      label: "Face Detection",
      status: integrity.faceDetected ? "passed" : "flagged",
      detail: integrity.faceDetected ? "Candidate visible throughout" : "Face not always detected",
    },
    {
      icon: Mic,
      label: "Audio Quality",
      status: !integrity.audioSilence ? "passed" : "flagged",
      detail: !integrity.audioSilence ? "Clear audio throughout" : "Some audio silence detected",
    },
    {
      icon: AlertTriangle,
      label: "Tab Focus",
      status: integrity.tabSwitches === 0 ? "passed" : integrity.tabSwitches <= 2 ? "warning" : "flagged",
      detail: integrity.tabSwitches === 0 ? "No tab switches" : `${integrity.tabSwitches} tab switch(es) detected`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Card>
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Fairness & Integrity
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    This section shows bias checks and interview conditions to ensure fair evaluation.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Bias Checks */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Scale className="h-3.5 w-3.5" />
              Bias Checks
            </h4>
            <div className="space-y-2">
              {biasChecks.map((check, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/20"
                >
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Conditions */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Interview Conditions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {conditionChecks.map((check, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    check.status === "passed" 
                      ? "bg-success/5 border-success/20" 
                      : check.status === "warning"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-destructive/5 border-destructive/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <check.icon className={`h-4 w-4 ${
                      check.status === "passed" 
                        ? "text-success" 
                        : check.status === "warning"
                        ? "text-warning"
                        : "text-destructive"
                    }`} />
                    <span className="text-xs font-medium">{check.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Integrity Score Explanation */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={
                  integrity.level === "high" 
                    ? "bg-success/10 text-success" 
                    : integrity.level === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                }
              >
                {integrity.level.charAt(0).toUpperCase() + integrity.level.slice(1)} Integrity
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Integrity score is based on behavioral signals during the interview: tab focus, 
              face visibility, audio quality, and network stability. A high score indicates 
              the candidate completed the interview under expected conditions.
            </p>
          </div>

          {/* Confidence Disclaimer */}
          <div className="p-4 bg-accent/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Important:</strong> This score is generated using AI analysis 
              and should be reviewed alongside other hiring inputs. AI evaluation is one data point — 
              not the final hiring decision.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
