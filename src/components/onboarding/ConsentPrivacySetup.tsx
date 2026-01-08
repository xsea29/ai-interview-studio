import { useState } from "react";
import { Shield, Eye, Clock, Trash2, Download, ArrowRight, ArrowLeft, AlertTriangle, FileText, Globe, Lock, Check, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";

interface ConsentPrivacySetupProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const ConsentPrivacySetup = ({ data, updateData, onNext, onBack, step }: ConsentPrivacySetupProps) => {
  const [previewRegion, setPreviewRegion] = useState<"us" | "eu">("us");

  // Step 0: Consent Settings
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Consent & Privacy</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Configure what candidates must consent to before interviews
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Candidate Consent Options</CardTitle>
            <CardDescription>
              Toggle what consent screens candidates will see
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "recordingConsent",
                icon: Eye,
                title: "Recording Consent",
                description: "Candidates must consent to audio/video recording",
                value: data.consent.recordingConsent,
                required: true,
              },
              {
                id: "aiEvaluationConsent",
                icon: FileText,
                title: "AI Evaluation Consent",
                description: "Candidates must consent to AI-powered evaluation",
                value: data.consent.aiEvaluationConsent,
                required: true,
              },
              {
                id: "faceVoiceProcessing",
                icon: Eye,
                title: "Face/Voice Processing",
                description: "Enable biometric data processing (optional)",
                value: data.consent.faceVoiceProcessing,
                required: false,
              },
              {
                id: "fairUseDisclosure",
                icon: Shield,
                title: "Fair Use Disclosure",
                description: "Show AI fairness and bias mitigation information",
                value: data.consent.fairUseDisclosure,
                required: true,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <Label className="flex items-center gap-2">
                      {item.title}
                      {item.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={item.value}
                  onCheckedChange={(checked) =>
                    updateData("consent", { [item.id]: checked })
                  }
                  disabled={item.required}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Consent Screen Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={previewRegion} onValueChange={(v) => setPreviewRegion(v as "us" | "eu")}>
              <TabsList className="mb-4">
                <TabsTrigger value="us">US Version</TabsTrigger>
                <TabsTrigger value="eu">EU/GDPR Version</TabsTrigger>
              </TabsList>

              <TabsContent value="us">
                <div className="border rounded-lg p-6 bg-muted/30 space-y-4">
                  <h3 className="font-semibold text-lg">Before You Begin</h3>
                  <p className="text-sm text-muted-foreground">
                    Please review and accept the following to continue with your interview:
                  </p>
                  
                  <div className="space-y-3">
                    {data.consent.recordingConsent && (
                      <div className="flex items-start gap-3 p-3 rounded bg-card">
                        <Eye className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Recording Consent</p>
                          <p className="text-sm text-muted-foreground">
                            This interview will be recorded for evaluation purposes.
                          </p>
                        </div>
                      </div>
                    )}
                    {data.consent.aiEvaluationConsent && (
                      <div className="flex items-start gap-3 p-3 rounded bg-card">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">AI Evaluation</p>
                          <p className="text-sm text-muted-foreground">
                            Your responses will be analyzed by AI to assess your fit.
                          </p>
                        </div>
                      </div>
                    )}
                    {data.consent.fairUseDisclosure && (
                      <div className="flex items-start gap-3 p-3 rounded bg-card">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Fair Evaluation</p>
                          <p className="text-sm text-muted-foreground">
                            Our AI is designed to minimize bias and ensure fair evaluation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-4 border-t">
                    <p>Data Retention: {data.consent.retentionDays} days</p>
                    <p>Contact: {data.brand.supportEmail || "support@company.com"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="eu">
                <div className="border rounded-lg p-6 bg-muted/30 space-y-4">
                  <h3 className="font-semibold text-lg">Data Processing Consent (GDPR)</h3>
                  <p className="text-sm text-muted-foreground">
                    Under GDPR, we require your explicit consent for data processing:
                  </p>
                  
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Your Rights:</strong> You have the right to access, rectify, or delete your data at any time. Contact our DPO at {data.brand.supportEmail || "dpo@company.com"}.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded bg-card border">
                      <input type="checkbox" className="mt-1" />
                      <p className="text-sm">
                        I consent to the recording and AI analysis of my interview responses for employment consideration purposes.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded bg-card border">
                      <input type="checkbox" className="mt-1" />
                      <p className="text-sm">
                        I understand my data will be retained for {data.consent.retentionDays} days and then automatically deleted.
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-4 border-t">
                    <p>Data Controller: {data.organization.legalName || "Company Name"}</p>
                    <p>Legal Basis: Consent (GDPR Art. 6(1)(a))</p>
                    <p>Opt-out: You may withdraw consent at any time.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onNext} size="lg" className="gap-2">
            Continue to Data Governance
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: Data Governance
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Lock className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Data Governance</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Configure data retention and deletion policies
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Data Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Retention Period</Label>
            <Select
              value={String(data.consent.retentionDays)}
              onValueChange={(value) =>
                updateData("consent", { retentionDays: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[30, 60, 90, 180, 365].map((days) => (
                  <SelectItem key={days} value={String(days)}>
                    {days} days {days === 90 && "(Recommended)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Interview data will be kept for this duration after completion
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label>Hard Delete After Retention</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete data when retention period expires
              </p>
            </div>
            <Switch
              checked={data.consent.hardDeleteAfterRetention}
              onCheckedChange={(checked) =>
                updateData("consent", { hardDeleteAfterRetention: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label>Export Before Delete</Label>
              <p className="text-sm text-muted-foreground">
                Automatically export data before deletion
              </p>
            </div>
            <Switch
              checked={data.consent.exportOnDelete}
              onCheckedChange={(checked) =>
                updateData("consent", { exportOnDelete: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Data Controls
          </CardTitle>
          <CardDescription>
            These actions will be available to System Admins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Download, label: "Export full org data (.zip)", action: "Available" },
              { icon: Trash2, label: "Delete specific interview/candidate", action: "Available" },
              { icon: AlertTriangle, label: "Destroy all organization data", action: "Requires confirmation" },
              { icon: FileText, label: "Generate audit logs", action: "Available" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <item.icon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>GDPR Compliance:</strong> Your settings are configured to meet GDPR requirements. 
          Candidates can request data access, rectification, or deletion at any time through the support contact.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="gap-2">
          Continue to Billing
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConsentPrivacySetup;
