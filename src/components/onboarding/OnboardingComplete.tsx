import { motion } from "framer-motion";
import { Check, Rocket, Users, Database, Shield, CreditCard, Building2, Palette, ArrowRight, AlertTriangle, Lock, Power, Trash2, RefreshCw, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { Link } from "react-router-dom";

interface OnboardingCompleteProps {
  data: OnboardingData;
}

const OnboardingComplete = ({ data }: OnboardingCompleteProps) => {
  const completedItems = [
    {
      icon: Building2,
      title: "Organization Verified",
      description: `${data.organization.displayName || data.account.companyName} - ${data.domainVerification.domain}`,
      status: "verified",
    },
    {
      icon: Palette,
      title: "Brand Identity Configured",
      description: data.brand.logo ? "Logo uploaded, colors set" : "Colors and templates configured",
      status: "complete",
    },
    {
      icon: Users,
      title: "Team Members Invited",
      description: `${data.users.invitedUsers.length} user${data.users.invitedUsers.length !== 1 ? "s" : ""} invited`,
      status: data.users.invitedUsers.length > 0 ? "complete" : "pending",
    },
    {
      icon: Database,
      title: "Data Import Ready",
      description: data.integrations.mode === "csv" ? "CSV upload configured" : `${data.integrations.atsProvider} integration pending`,
      status: "complete",
    },
    {
      icon: Shield,
      title: "Privacy & Consent",
      description: `${data.consent.retentionDays} day retention, GDPR compliant`,
      status: "complete",
    },
    {
      icon: CreditCard,
      title: "Billing Activated",
      description: data.billing.paymentMethod 
        ? `${data.billing.plan.replace(/_/g, " ")} - Payment method added` 
        : "5 free credits - Payment pending",
      status: data.billing.paymentMethod ? "complete" : "pending",
    },
  ];

  const crisisControls = [
    { icon: Power, label: "Force logout all users", color: "text-warning" },
    { icon: Lock, label: "Suspend organization", color: "text-warning" },
    { icon: AlertTriangle, label: "Lock interview creation", color: "text-warning" },
    { icon: Download, label: "Export all org data", color: "text-primary" },
    { icon: Trash2, label: "Delete all org data", color: "text-destructive" },
    { icon: RefreshCw, label: "Revoke ATS tokens", color: "text-warning" },
    { icon: Shield, label: "Disable AI evaluations", color: "text-warning" },
  ];

  return (
    <div className="space-y-8 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Check className="w-12 h-12 text-success" />
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Onboarding Complete! 🎉
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your organization is ready to start conducting AI-powered interviews
        </p>
      </motion.div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Setup Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`p-2 rounded-lg ${
                  item.status === "verified" ? "bg-success/20" :
                  item.status === "complete" ? "bg-primary/10" : "bg-muted"
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.status === "verified" ? "text-success" :
                    item.status === "complete" ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant={
                  item.status === "verified" ? "default" :
                  item.status === "complete" ? "secondary" : "outline"
                }>
                  {item.status === "verified" ? "Verified" :
                   item.status === "complete" ? "Complete" : "Pending"}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Create your first AI interview", action: "/create" },
              { label: "Import candidates via CSV", action: "/settings" },
              { label: "Review analytics dashboard", action: "/analytics" },
              { label: "Configure integrations", action: "/integrations" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.action}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="font-medium">{item.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Crisis Controls
            </CardTitle>
            <CardDescription>
              Emergency actions available to System Admins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-2">
              {crisisControls.map((control) => (
                <div
                  key={control.label}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                >
                  <control.icon className={`w-4 h-4 ${control.color}`} />
                  <span className="text-muted-foreground">{control.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Access these from Settings → Admin Controls
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <Rocket className="w-4 h-4 text-primary" />
        <AlertDescription>
          <strong>Your recruiters can now:</strong> Create AI Interviews → Launch to Candidates → Evaluate Results
        </AlertDescription>
      </Alert>

      <div className="flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/settings">
            Go to Settings
          </Link>
        </Button>
        <Button size="lg" className="gap-2" asChild>
          <Link to="/create">
            <Rocket className="w-4 h-4" />
            Create First Interview
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OnboardingComplete;
