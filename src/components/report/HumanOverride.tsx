import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HumanOverrideProps {
  candidateId: string;
  aiRecommendation: string;
}

export function HumanOverride({ candidateId, aiRecommendation }: HumanOverrideProps) {
  const [feedback, setFeedback] = useState<"agree" | "disagree" | null>(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: "agree" | "disagree") => {
    setFeedback(type);
    if (type === "disagree") {
      setShowFeedbackInput(true);
    } else {
      setShowFeedbackInput(false);
      setFeedbackText("");
    }
  };

  const handleSubmit = () => {
    // In real app, would send to backend
    console.log("Feedback submitted:", { candidateId, feedback, feedbackText });
    setSubmitted(true);
    toast.success(
      feedback === "agree" 
        ? "You agreed with the AI evaluation" 
        : "Your feedback has been recorded"
    );
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-success/5 border border-success/20 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="font-medium text-sm">Feedback Recorded</p>
            <p className="text-xs text-muted-foreground">
              {feedback === "agree" 
                ? "You agreed with the AI evaluation" 
                : "Your feedback will help improve future evaluations"}
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {feedback === "agree" ? "AI Approved" : "Human Override"}
          </Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-5 bg-card border border-border rounded-lg"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Your Feedback</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Do you agree with the AI's "{aiRecommendation}" recommendation?
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <Button
          variant={feedback === "agree" ? "default" : "outline"}
          className={`flex-1 gap-2 ${feedback === "agree" ? "ai-gradient" : ""}`}
          onClick={() => handleFeedback("agree")}
        >
          <ThumbsUp className="h-4 w-4" />
          Agree with AI
        </Button>
        <Button
          variant={feedback === "disagree" ? "destructive" : "outline"}
          className="flex-1 gap-2"
          onClick={() => handleFeedback("disagree")}
        >
          <ThumbsDown className="h-4 w-4" />
          Disagree
        </Button>
      </div>

      <AnimatePresence>
        {showFeedbackInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did the AI get wrong? Your feedback helps improve future evaluations..."
                className="min-h-[80px] text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Your feedback is stored for AI improvement but doesn't retrain the model immediately.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t"
        >
          <Button 
            onClick={handleSubmit} 
            className="w-full gap-2"
            disabled={feedback === "disagree" && !feedbackText.trim()}
          >
            <Send className="h-4 w-4" />
            Submit Feedback
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
