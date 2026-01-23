import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Lock } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshRole } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      await refreshRole();
      navigate("/admin", { replace: true });
    } catch (err: any) {
      toast({
        title: "Admin sign-in failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar-background p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-sidebar-accent px-8 py-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-sidebar-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-sidebar-foreground">
                  Admin Portal
                </h1>
                <p className="text-sm text-sidebar-foreground/60">
                  Platform administration access
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20">
              <Lock className="w-4 h-4 text-warning" />
              <span className="text-xs text-warning font-medium">
                Restricted area — authorized personnel only
              </span>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Admin email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button
                className="w-full h-11 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-medium group"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  "Authenticating…"
                ) : (
                  <>
                    Access Admin Panel
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-sm">
              <Link
                className="text-muted-foreground hover:text-foreground transition-colors"
                to="/auth"
              >
                ← Back to login options
              </Link>
              <Link
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                to="/auth/client"
              >
                Client login
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-sidebar-foreground/40">
          InterviewFlux Platform Administration
        </p>
      </motion.div>
    </div>
  );
}