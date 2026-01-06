import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SuccessScreenProps {
  candidateCount: number;
}

export function SuccessScreen({ candidateCount }: SuccessScreenProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1 
          }}
          className="relative mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full ai-gradient opacity-20 blur-2xl w-32 h-32 mx-auto" />
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full ai-gradient ai-glow">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
            >
              <CheckCircle className="h-12 w-12 text-primary-foreground" />
            </motion.div>
          </div>
          
          {/* Sparkles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-1 -left-3"
          >
            <Sparkles className="h-5 w-5 text-primary/70" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            AI Interviews Sent Successfully!
          </h1>
          <p className="text-muted-foreground">
            {candidateCount} candidate{candidateCount !== 1 ? "s" : ""} will receive secure interview links shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <Link to="/interviews">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Eye className="h-4 w-4" />
              View Interview Status
            </Button>
          </Link>
          <Link to="/create">
            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Create Another Interview
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-muted-foreground mt-8"
        >
          You'll receive notifications as candidates complete their interviews.
        </motion.p>
      </div>
    </div>
  );
}
