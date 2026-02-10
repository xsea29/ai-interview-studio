import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InviteEmailVerificationProps {
  email: string;
  onVerified: () => void;
}

export function InviteEmailVerification({ email, onVerified }: InviteEmailVerificationProps) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setVerifying(true);
    setError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (verifyError) {
        setError(verifyError.message);
        setVerifying(false);
        return;
      }

      toast.success("Email verified!");
      onVerified();
    } catch {
      setError("Verification failed. Please try again.");
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (resendError) {
        toast.error(resendError.message);
      } else {
        toast.success("Verification code resent!");
      }
    } catch {
      toast.error("Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Mobile branding */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg ai-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">InterviewFlux</span>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-14 w-14 rounded-2xl ai-gradient-subtle flex items-center justify-center mb-4">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="otp-code" className="text-sm font-medium">
            Verification Code
          </Label>
          <Input
            id="otp-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(val);
            }}
            placeholder="000000"
            className="h-14 text-center text-2xl tracking-[0.5em] font-mono border-2 focus-visible:ring-primary"
            autoFocus
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3 border border-destructive/20">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={verifying || otp.length < 6}
          className="w-full h-11 ai-gradient text-primary-foreground font-medium"
          size="lg"
        >
          {verifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verifying…
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-6">
        <span>Didn't receive the code?</span>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={handleResend}
          disabled={resending}
          className="px-1 h-auto text-primary"
        >
          {resending ? "Sending…" : "Resend code"}
        </Button>
      </div>

      <div className="flex items-start gap-3 text-xs text-muted-foreground bg-success/10 rounded-lg p-4 mt-6 border border-success/20">
        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
        <span>Check your inbox and spam folder. The code expires in 10 minutes.</span>
      </div>
    </motion.div>
  );
}
