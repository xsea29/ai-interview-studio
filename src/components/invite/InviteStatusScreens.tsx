import { motion } from "framer-motion";
import { Loader2, AlertTriangle, Sparkles } from "lucide-react";

export function InviteLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-14 w-14 rounded-2xl ai-gradient flex items-center justify-center ai-glow-sm">
          <Sparkles className="h-7 w-7 text-primary-foreground animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">Validating your invite</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait a moment…</p>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-primary mt-2" />
      </motion.div>
    </div>
  );
}

export function InviteInvalidScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Invalid Invitation</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">
            This invite link may have expired or already been used. Please contact your administrator to receive a new invitation.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function InviteAcceptingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-14 w-14 rounded-2xl ai-gradient flex items-center justify-center ai-glow-sm">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">Setting up your organization</p>
          <p className="text-sm text-muted-foreground mt-1">Almost there…</p>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-primary mt-2" />
      </motion.div>
    </div>
  );
}
