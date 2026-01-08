import { useState, useEffect } from "react";
import { Shield, Mail, Globe, FileText, Check, X, RefreshCw, ArrowRight, ArrowLeft, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";

interface DomainVerificationProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
}

const verificationMethods = [
  {
    id: "email" as const,
    icon: Mail,
    title: "Email Verification",
    description: "We'll send a verification link to your work email",
    recommended: true,
    time: "~1 minute",
  },
  {
    id: "dns" as const,
    icon: Globe,
    title: "DNS TXT Record",
    description: "Add a TXT record to your domain's DNS settings",
    recommended: false,
    time: "~24-48 hours",
  },
  {
    id: "file" as const,
    icon: FileText,
    title: "File Upload",
    description: "Upload a verification file to your website",
    recommended: false,
    time: "~5 minutes",
  },
];

const DomainVerification = ({ data, updateData, onNext, onBack }: DomainVerificationProps) => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const domain = data.domainVerification.domain || data.account.email.split("@")[1] || "example.com";

  useEffect(() => {
    if (verifying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simulate verification result (80% success rate)
            if (Math.random() > 0.2 || attempts > 1) {
              updateData("domainVerification", { status: "verified" });
              setVerifying(false);
            } else {
              setError(getErrorMessage());
              setVerifying(false);
              setAttempts((prev) => prev + 1);
            }
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [verifying, attempts]);

  const getErrorMessage = () => {
    switch (data.domainVerification.method) {
      case "dns":
        return "DNS TXT record not found. Please wait for DNS propagation (up to 48 hours) and try again. TTL may affect propagation time.";
      case "file":
        return "Verification file not found at the expected URL. Please ensure the file is uploaded to your website root.";
      default:
        return "Verification link has expired. Please request a new one.";
    }
  };

  const handleSendVerification = () => {
    setVerificationSent(true);
    setError(null);
    
    // Auto-start verification for demo
    if (data.domainVerification.method === "email") {
      setTimeout(() => handleVerify(), 2000);
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    setProgress(0);
    setError(null);
  };

  const handleResend = () => {
    setVerificationSent(false);
    setProgress(0);
    setError(null);
    setTimeout(() => handleSendVerification(), 500);
  };

  const renderVerificationStatus = () => {
    if (data.domainVerification.status === "verified") {
      return (
        <Card className="border-success/50 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Domain Verified!</h3>
                <p className="text-muted-foreground mt-1">
                  <strong>{domain}</strong> has been successfully verified
                </p>
              </div>
              <Badge variant="outline" className="border-success text-success">
                organization.status = "verified"
              </Badge>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (verifying) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Verifying Domain...</h3>
                <p className="text-muted-foreground mt-1">
                  Checking {data.domainVerification.method === "dns" ? "DNS records" : "verification"}
                </p>
              </div>
              <Progress value={progress} className="w-full max-w-xs" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Verification Failed</strong>
            <p className="mt-1">{error}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={handleResend}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setVerificationSent(false)}>
                Change Method
              </Button>
              <Button size="sm" variant="ghost">
                <HelpCircle className="w-3 h-3 mr-1" />
                Contact Support
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const renderMethodDetails = () => {
    if (!verificationSent) return null;

    switch (data.domainVerification.method) {
      case "email":
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Check Your Email</h3>
                  <p className="text-muted-foreground mt-1">
                    We've sent a verification link to <strong>{data.account.email}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Link expires in 24 hours
                </div>
                <Button variant="outline" onClick={handleResend} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Resend Email
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "dns":
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-foreground">Add DNS TXT Record</h3>
              <p className="text-sm text-muted-foreground">
                Add the following TXT record to your domain's DNS settings:
              </p>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>TXT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Host/Name:</span>
                  <span>_aiinterview-verify</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="text-right break-all max-w-[200px]">
                    verify=ai_{btoa(domain).slice(0, 16)}
                  </span>
                </div>
              </div>
              <Alert>
                <Clock className="w-4 h-4" />
                <AlertDescription>
                  DNS changes can take 24-48 hours to propagate. TTL settings on your domain may affect this.
                </AlertDescription>
              </Alert>
              <Button onClick={handleVerify} className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Verify DNS Record
              </Button>
            </CardContent>
          </Card>
        );

      case "file":
        return (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-foreground">Upload Verification File</h3>
              <p className="text-sm text-muted-foreground">
                Download this file and upload it to your website's root directory:
              </p>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm">ai-interview-verify.txt</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload to: <code>https://{domain}/ai-interview-verify.txt</code>
                </p>
              </div>
              <Button onClick={handleVerify} className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Verify File Upload
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Verify Your Domain</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Verify <strong>{domain}</strong> to confirm you're authorized to set up this organization
        </p>
        <Badge variant="secondary" className="mt-2">
          organization.status = "pending_verification"
        </Badge>
      </div>

      {data.domainVerification.status !== "verified" && !verificationSent && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Choose Verification Method</CardTitle>
            <CardDescription>
              Select how you'd like to verify domain ownership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={data.domainVerification.method}
              onValueChange={(value) => updateData("domainVerification", { method: value as "email" | "dns" | "file" })}
              className="space-y-3"
            >
              {verificationMethods.map((method) => (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                    data.domainVerification.method === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <method.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{method.title}</span>
                      {method.recommended && (
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {method.time}
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {renderMethodDetails()}
      {renderVerificationStatus()}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        {data.domainVerification.status === "verified" ? (
          <Button onClick={onNext} size="lg" className="gap-2">
            Continue to Organization Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : !verificationSent ? (
          <Button onClick={handleSendVerification} size="lg" className="gap-2">
            Start Verification
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default DomainVerification;
