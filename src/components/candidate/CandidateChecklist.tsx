import { motion } from "framer-motion";
import { Volume2, Mic, Video, Wifi, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistItems {
  quiet: boolean;
  mic: boolean;
  camera: boolean;
  network: boolean;
  consent: boolean;
}

interface CandidateChecklistProps {
  checklistItems: ChecklistItems;
  setChecklistItems: React.Dispatch<React.SetStateAction<ChecklistItems>>;
  allChecked: boolean;
  onStart: () => void;
}

const items = [
  { key: "quiet" as const, icon: Volume2, title: "Quiet Environment", desc: "Find a quiet space with minimal background noise" },
  { key: "mic" as const, icon: Mic, title: "Microphone Access", desc: "Grant browser permission to use your microphone" },
  { key: "camera" as const, icon: Video, title: "Camera Access", desc: "Grant browser permission to use your camera" },
  { key: "network" as const, icon: Wifi, title: "Stable Connection", desc: "Ensure a reliable internet connection throughout" },
];

export function CandidateChecklist({ checklistItems, setChecklistItems, allChecked, onStart }: CandidateChecklistProps) {
  const checkedCount = Object.values(checklistItems).filter(Boolean).length;
  const totalCount = Object.keys(checklistItems).length;

  return (
    <motion.div
      key="checklist"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl w-full mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5">
          Environment Check
        </h2>
        <p className="text-sm text-muted-foreground">
          Confirm each item to ensure the best interview experience
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full ai-gradient"
            animate={{ width: `${(checkedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {checkedCount}/{totalCount}
        </span>
      </div>

      <div className="space-y-2.5 mb-5">
        {items.map((item, i) => {
          const checked = checklistItems[item.key];
          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setChecklistItems(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                checked
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/20 bg-card"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors ${
                checked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.title}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                checked ? "bg-primary text-primary-foreground scale-100" : "border-2 border-border scale-90"
              }`}>
                {checked && <CheckCircle className="h-4 w-4" />}
              </div>
            </motion.button>
          );
        })}

        {/* Consent separate */}
        <div className="pt-3 border-t border-border/60">
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => setChecklistItems(prev => ({ ...prev, consent: !prev.consent }))}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              checklistItems.consent
                ? "border-primary/40 bg-primary/5"
                : "border-border hover:border-primary/20 bg-card"
            }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors ${
              checklistItems.consent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm flex items-center gap-2">
                I Consent
                <span className="text-[10px] font-normal text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">Required</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">I agree to have my responses recorded and analyzed by AI</p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
              checklistItems.consent ? "bg-primary text-primary-foreground scale-100" : "border-2 border-border scale-90"
            }`}>
              {checklistItems.consent && <CheckCircle className="h-4 w-4" />}
            </div>
          </motion.button>
        </div>
      </div>

      <Button
        onClick={onStart}
        disabled={!allChecked}
        size="lg"
        className="ai-gradient w-full h-12 text-sm font-semibold gap-2 group"
      >
        Begin Interview
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </motion.div>
  );
}
