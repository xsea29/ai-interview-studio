import { motion } from "framer-motion";
import { Plus, Sparkles, Upload, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CreateInterviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-10 card-elevated"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 ai-gradient-subtle opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Interviews
            </div>
            
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              Create AI Interview
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              Upload candidates from any ATS or spreadsheet and run AI interviews at scale.
              No integration required — works with any hiring workflow.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link to="/create">
                <Button size="lg" className="ai-gradient ai-glow-sm gap-2 font-medium">
                  <Plus className="h-4.5 w-4.5" />
                  Create AI Interview
                </Button>
              </Link>
              
              <Link to="/interviews">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Interviews
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-border/60">
              <FeatureChip icon={<Upload className="h-3.5 w-3.5" />} text="CSV & Excel support" />
              <FeatureChip icon={<Zap className="h-3.5 w-3.5" />} text="Text, Audio & Video" />
              <FeatureChip icon={<Sparkles className="h-3.5 w-3.5" />} text="AI-adaptive questions" />
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full ai-gradient opacity-20 blur-2xl" />
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="w-32 h-32 rounded-2xl ai-gradient flex items-center justify-center ai-glow">
                  <Sparkles className="h-14 w-14 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {text}
    </div>
  );
}
