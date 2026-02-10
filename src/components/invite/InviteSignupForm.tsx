import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InviteSignupFormProps {
  email: string;
  orgName: string;
  formData: { firstName: string; lastName: string; password: string };
  setFormData: (d: { firstName: string; lastName: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onBack: () => void;
}

export function InviteSignupForm({
  email,
  orgName,
  formData,
  setFormData,
  onSubmit,
  submitting,
  onBack,
}: InviteSignupFormProps) {
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

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground mt-1">
          Set up your credentials for <span className="text-foreground font-medium">{orgName}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="invite-email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            disabled
            className="h-11 bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">Pre-filled from your invitation</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="h-11"
              placeholder="Jane"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="h-11"
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
            className="h-11"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-11 ai-gradient text-primary-foreground font-medium group"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </motion.div>
  );
}
