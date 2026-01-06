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
      className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border p-5 sm:p-8 md:p-10 card-elevated"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 ai-gradient-subtle opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary mb-3 sm:mb-4">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              AI-Powered Interviews
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-2 sm:mb-3">
              Create AI Interview
            </h1>
            
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Upload candidates from any ATS or spreadsheet and run AI interviews at scale.
              <span className="hidden sm:inline"> No integration required — works with any hiring workflow.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <Link to="/create" className="w-full sm:w-auto">
                <Button size="lg" className="ai-gradient ai-glow-sm gap-2 font-medium w-full sm:w-auto">
                  <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  Create AI Interview
                </Button>
              </Link>
              
              <Link to="/interviews" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  View All Interviews
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-border/60">
              <FeatureChip icon={<Upload className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} text="CSV & Excel" />
              <FeatureChip icon={<Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} text="Text, Audio & Video" />
              <FeatureChip icon={<Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} text="AI-adaptive" />
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
