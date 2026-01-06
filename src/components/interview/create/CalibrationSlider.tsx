import { motion } from "framer-motion";
import { Gauge, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalibrationSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const calibrationLevels = [
  {
    value: 0,
    label: "Conservative",
    description: "Strict AI evaluation. Higher scoring thresholds, detailed concerns flagged.",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    value: 50,
    label: "Balanced",
    description: "Standard AI evaluation. Fair scoring with balanced recommendations.",
    color: "text-primary",
    bgColor: "bg-primary",
  },
  {
    value: 100,
    label: "Lenient",
    description: "Flexible AI evaluation. Focus on potential, fewer concerns flagged.",
    color: "text-success",
    bgColor: "bg-success",
  },
];

export function CalibrationSlider({ value, onChange }: CalibrationSliderProps) {
  const getCurrentLevel = () => {
    if (value <= 25) return calibrationLevels[0];
    if (value <= 75) return calibrationLevels[1];
    return calibrationLevels[2];
  };

  const currentLevel = getCurrentLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/30 rounded-lg border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Calibration Mode</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">
                  Adjust how strictly the AI evaluates candidates. This affects scoring thresholds, 
                  recommendation wording, and confidence weighting — not the questions asked.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={`text-sm font-medium ${currentLevel.color}`}>
          {currentLevel.label}
        </span>
      </div>

      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={100}
        step={1}
        className="mb-4"
      />

      <div className="flex justify-between text-xs text-muted-foreground mb-3">
        <span>Conservative</span>
        <span>Balanced</span>
        <span>Lenient</span>
      </div>

      <div className={`p-3 rounded-md ${currentLevel.value === 0 ? 'bg-blue-500/10' : currentLevel.value === 100 ? 'bg-success/10' : 'bg-primary/10'}`}>
        <p className="text-xs text-muted-foreground">
          {currentLevel.description}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground">
          <strong>What this affects:</strong> Scoring thresholds • Recommendation wording • Confidence weighting
        </p>
      </div>
    </motion.div>
  );
}
