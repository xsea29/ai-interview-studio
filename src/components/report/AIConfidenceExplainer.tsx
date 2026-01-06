import { motion } from "framer-motion";
import { AlertTriangle, Info, HelpCircle, Gauge, Volume2, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ConfidenceFactors {
  overall: "high" | "medium" | "low";
  score: number;
  factors: {
    responseLength: "adequate" | "short" | "very_short";
    audioQuality: "good" | "fair" | "poor";
    responseTime: "normal" | "fast" | "slow";
    topicCoverage: "complete" | "partial" | "limited";
  };
  limitations: string[];
}

interface AIConfidenceExplainerProps {
  confidence: ConfidenceFactors;
}

export function AIConfidenceExplainer({ confidence }: AIConfidenceExplainerProps) {
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high":
      case "good":
      case "adequate":
      case "normal":
      case "complete":
        return "text-success";
      case "medium":
      case "fair":
      case "partial":
      case "fast":
      case "slow":
        return "text-warning";
      default:
        return "text-destructive";
    }
  };

  const getConfidenceBg = (level: string) => {
    switch (level) {
      case "high":
        return "bg-success/10 border-success/20";
      case "medium":
        return "bg-warning/10 border-warning/20";
      default:
        return "bg-destructive/10 border-destructive/20";
    }
  };

  const factorIcons = {
    responseLength: MessageSquare,
    audioQuality: Volume2,
    responseTime: Clock,
    topicCoverage: Gauge,
  };

  const factorLabels = {
    responseLength: "Response Length",
    audioQuality: "Audio Quality",
    responseTime: "Response Time",
    topicCoverage: "Topic Coverage",
  };

  const factorDescriptions: Record<string, Record<string, string>> = {
    responseLength: {
      adequate: "Responses were detailed enough for accurate evaluation",
      short: "Some responses were brief, reducing evaluation certainty",
      very_short: "Multiple responses were very short, limiting AI analysis",
    },
    audioQuality: {
      good: "Clear audio throughout the interview",
      fair: "Some audio issues detected, may affect transcription accuracy",
      poor: "Significant audio quality issues affected analysis",
    },
    responseTime: {
      normal: "Response timing was natural and consistent",
      fast: "Some responses were unusually quick",
      slow: "Extended pauses detected between questions",
    },
    topicCoverage: {
      complete: "All expected topics were addressed",
      partial: "Some topics were only partially covered",
      limited: "Key topics were not fully addressed",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border ${getConfidenceBg(confidence.overall)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              AI Confidence Analysis
            </span>
            <Badge className={`${getConfidenceBg(confidence.overall)} capitalize`}>
              {confidence.overall} Confidence ({confidence.score}%)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Confidence Factors */}
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(confidence.factors).map(([key, value]) => {
              const Icon = factorIcons[key as keyof typeof factorIcons];
              const label = factorLabels[key as keyof typeof factorLabels];
              const description = factorDescriptions[key as keyof typeof factorDescriptions][value];
              
              return (
                <div
                  key={key}
                  className="p-3 rounded-lg bg-background border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${getConfidenceColor(value)}`} />
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="secondary" className={`text-xs capitalize ml-auto ${getConfidenceColor(value)}`}>
                      {value.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              );
            })}
          </div>

          {/* Limitations */}
          {confidence.limitations.length > 0 && (
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Confidence Limitations</span>
              </div>
              <ul className="space-y-1">
                {confidence.limitations.map((limitation, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="h-1 w-1 rounded-full bg-warning mt-1.5 shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              This score is generated using AI analysis and should be reviewed alongside other hiring inputs. 
              AI recommendations are suggestions, not final decisions. Human judgment remains essential.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
