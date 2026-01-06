import { motion } from "framer-motion";
import { Bot, FileCode, Scale, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AIVersion {
  modelVersion: string;
  promptVersion: string;
  scoringRubricVersion: string;
  evaluatedAt: string;
}

interface AIVersionInfoProps {
  version: AIVersion;
}

export function AIVersionInfo({ version }: AIVersionInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-border pt-4 mt-6"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Bot className="h-3.5 w-3.5" />
            <span>AI {version.modelVersion}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI Model Version: {version.modelVersion}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <FileCode className="h-3.5 w-3.5" />
            <span>Prompt {version.promptVersion}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Evaluation Prompt Version: {version.promptVersion}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Scale className="h-3.5 w-3.5" />
            <span>Rubric {version.scoringRubricVersion}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Scoring Rubric Version: {version.scoringRubricVersion}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span className="text-muted-foreground/60">•</span>
      
      <span>Evaluated {version.evaluatedAt}</span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="ml-auto">
            <Info className="h-3.5 w-3.5 hover:text-foreground transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Version tracking ensures all evaluations are comparable. 
              When AI logic changes, versions are updated for transparency.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}
