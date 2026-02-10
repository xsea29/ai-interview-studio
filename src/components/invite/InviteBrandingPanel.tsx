import { motion } from "framer-motion";
import { Building2, Sparkles, Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InviteBrandingPanelProps {
  orgName?: string;
  plan?: string;
  industry?: string | null;
}

export function InviteBrandingPanel({ orgName, plan, industry }: InviteBrandingPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 ai-gradient relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 right-16 w-24 h-24 rounded-2xl bg-background/10 backdrop-blur-sm border border-background/20"
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-16 h-16 rounded-full bg-background/10 backdrop-blur-sm border border-background/20"
        animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-8 w-12 h-12 rounded-lg bg-background/10 backdrop-blur-sm border border-background/20"
        animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative z-10 flex flex-col justify-center px-12 text-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-background/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-semibold">InterviewFlux</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            You're Invited to<br />
            <span className="opacity-90">{orgName || "an Organization"}</span>
          </h1>
          <p className="text-lg opacity-80 max-w-md">
            Set up your account and unlock AI-powered interview capabilities for your team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 space-y-4"
        >
          {/* Org Info Card */}
          {orgName && (
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-5 border border-background/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{orgName}</p>
                  {industry && <p className="text-sm opacity-70">{industry}</p>}
                </div>
              </div>
              {plan && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-background/20 text-foreground border-background/30 capitalize">
                    {plan} Plan
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: Sparkles, label: "AI Interviews", desc: "Smart screening" },
              { icon: Users, label: "Team Access", desc: "Collaborate together" },
              { icon: Shield, label: "Enterprise Security", desc: "SOC 2 compliant" },
              { icon: Building2, label: "Custom Branding", desc: "Your identity" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-background/10 backdrop-blur-sm rounded-lg p-3 border border-background/20"
              >
                <item.icon className="w-4 h-4 mb-1.5 opacity-80" />
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs opacity-60">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
