import { useState, useRef } from "react";
import { Palette, Image, Mail, Eye, ArrowRight, ArrowLeft, Upload, X, Sun, Moon, Smartphone, Monitor, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";
import { HelpTooltip } from "./HelpTooltip";

interface BrandIdentitySetupProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  step: number;
}

const defaultTemplates = {
  invite: `Hi {{candidate_name}},

You've been invited to complete an AI-powered interview for the {{job_title}} position at {{company_name}}.

This interview will take approximately {{duration}} minutes and can be completed at your convenience within the next {{access_days}} days.

Click the button below to get started:
{{interview_link}}

Best regards,
{{recruiter_name}}`,
  
  reminder: `Hi {{candidate_name}},

This is a friendly reminder that your AI interview for the {{job_title}} position is still awaiting completion.

You have {{days_remaining}} days left to complete it.

{{interview_link}}

Best regards,
{{recruiter_name}}`,
  
  expiry: `Hi {{candidate_name}},

Your AI interview for the {{job_title}} position will expire in {{hours_remaining}} hours.

Please complete it as soon as possible to ensure your application is considered.

{{interview_link}}

Best regards,
{{recruiter_name}}`
};

const BrandIdentitySetup = ({ data, updateData, onNext, onBack, onSkip, step }: BrandIdentitySetupProps) => {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [contrastWarning, setContrastWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setLogoError("Logo is too large. Please upload an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        updateData("brand", { logo: event.target?.result as string });
        setLogoError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkContrast = (color: string) => {
    // Simple contrast check - would be more sophisticated in production
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    setContrastWarning(luminance > 0.8 || luminance < 0.2);
  };

  const handleColorChange = (color: string) => {
    updateData("brand", { brandColor: color });
    checkContrast(color);
  };

  // Step 0: Visual Identity
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <Palette className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Brand & Identity</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Customize how your company appears to candidates
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Logo Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "upload-zone flex flex-col items-center justify-center cursor-pointer min-h-[160px]",
                    data.brand.logo && "border-success"
                  )}
                >
                  {data.brand.logo ? (
                    <div className="relative">
                      <img
                        src={data.brand.logo}
                        alt="Company logo"
                        className="max-h-24 max-w-full object-contain"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateData("brand", { logo: null });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload logo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logoError && (
                  <Alert className="border-warning/50 bg-warning/10">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <AlertDescription className="text-warning">{logoError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Brand Color
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: data.brand.brandColor }}
                    onClick={() => document.getElementById("colorPicker")?.click()}
                  />
                  <Input
                    id="colorPicker"
                    type="color"
                    value={data.brand.brandColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-20 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={data.brand.brandColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#00b8d4"
                    className="flex-1"
                  />
                </div>
                {contrastWarning && (
                  <Alert className="border-warning/50 bg-warning/10">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <AlertDescription className="text-warning">
                      This color may have accessibility issues with text contrast.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateCompanyName" className="flex items-center gap-1.5">
                    Company Name (shown to candidates)
                    <HelpTooltip content="This is the name candidates will see during their interview experience. Can differ from your legal name (e.g., use a brand name or DBA)." />
                  </Label>
                  <Input
                    id="candidateCompanyName"
                    placeholder={data.organization.displayName || "Your Company"}
                    value={data.brand.candidateCompanyName}
                    onChange={(e) => updateData("brand", { candidateCompanyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your company..."
                    value={data.brand.companyDescription}
                    onChange={(e) => updateData("brand", { companyDescription: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recruiterEmail">Recruiter Contact Email</Label>
                    <Input
                      id="recruiterEmail"
                      type="email"
                      placeholder="recruiting@company.com"
                      value={data.brand.recruiterEmail}
                      onChange={(e) => updateData("brand", { recruiterEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      placeholder="support@company.com"
                      value={data.brand.supportEmail}
                      onChange={(e) => updateData("brand", { supportEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature">Recruiter Signature</Label>
                  <Textarea
                    id="signature"
                    placeholder="Best regards,&#10;The Recruiting Team"
                    value={data.brand.recruiterSignature}
                    onChange={(e) => updateData("brand", { recruiterSignature: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="poweredBy">Show "Powered by AI" Badge</Label>
                    <p className="text-sm text-muted-foreground">Required for transparency (small badge)</p>
                  </div>
                  <Switch
                    id="poweredBy"
                    checked={data.brand.showPoweredBy}
                    onCheckedChange={(checked) => updateData("brand", { showPoweredBy: checked })}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Preview
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "border rounded-xl overflow-hidden transition-all",
                previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full",
                darkMode ? "bg-slate-900" : "bg-white"
              )}
            >
              {/* Email Preview Header */}
              <div
                className="p-4 text-white"
                style={{ backgroundColor: data.brand.brandColor }}
              >
                <div className="flex items-center gap-3">
                  {data.brand.logo ? (
                    <img src={data.brand.logo} alt="Logo" className="h-8 w-auto bg-white rounded p-1" />
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-sm font-bold">
                      {(data.brand.candidateCompanyName || data.organization.displayName || "C")[0]}
                    </div>
                  )}
                  <span className="font-semibold">
                    {data.brand.candidateCompanyName || data.organization.displayName || "Your Company"}
                  </span>
                </div>
              </div>

              {/* Email Preview Body */}
              <div className={cn("p-6 space-y-4", darkMode ? "text-white" : "text-gray-900")}>
                <h2 className="text-xl font-semibold">You're invited to interview!</h2>
                <p className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-600")}>
                  Hi Sarah,
                </p>
                <p className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-600")}>
                  You've been invited to complete an AI-powered interview for the Senior Developer position.
                </p>
                <Button
                  className="w-full"
                  style={{ backgroundColor: data.brand.brandColor }}
                >
                  Start Interview
                </Button>
                <p className={cn("text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>
                  {data.brand.recruiterSignature || "Best regards,\nThe Recruiting Team"}
                </p>
              </div>

              {/* Email Preview Footer */}
              <div className={cn(
                "p-4 text-center text-xs border-t",
                darkMode ? "border-gray-700 text-gray-400" : "border-gray-100 text-gray-500"
              )}>
                {data.brand.showPoweredBy && (
                  <Badge variant="secondary" className="text-xs">
                    Powered by AI Interview
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
              Skip this phase
            </Button>
            <Button onClick={onNext} size="lg" className="gap-2">
              Continue to Email Templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Email Templates
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Mail className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Email Templates</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Customize the emails sent to candidates
        </p>
      </div>

      <Card className="card-elevated">
        <CardContent className="pt-6">
          <Tabs defaultValue="invite" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="invite">Invite</TabsTrigger>
              <TabsTrigger value="reminder">Reminder</TabsTrigger>
              <TabsTrigger value="expiry">Expiry Warning</TabsTrigger>
            </TabsList>

            <TabsContent value="invite" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inviteTemplate">Invite Email Template</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateData("brand", { inviteTemplate: defaultTemplates.invite })}
                  >
                    Reset to Default
                  </Button>
                </div>
                <Textarea
                  id="inviteTemplate"
                  value={data.brand.inviteTemplate || defaultTemplates.invite}
                  onChange={(e) => updateData("brand", { inviteTemplate: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Available variables:</strong> {`{{candidate_name}}, {{job_title}}, {{company_name}}, {{duration}}, {{access_days}}, {{interview_link}}, {{recruiter_name}}`}
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="reminder" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminderTemplate">Reminder Email Template</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateData("brand", { reminderTemplate: defaultTemplates.reminder })}
                  >
                    Reset to Default
                  </Button>
                </div>
                <Textarea
                  id="reminderTemplate"
                  value={data.brand.reminderTemplate || defaultTemplates.reminder}
                  onChange={(e) => updateData("brand", { reminderTemplate: e.target.value })}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Additional variable:</strong> {`{{days_remaining}}`}
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="expiry" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="expiryTemplate">Expiry Warning Template</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateData("brand", { expiryTemplate: defaultTemplates.expiry })}
                  >
                    Reset to Default
                  </Button>
                </div>
                <Textarea
                  id="expiryTemplate"
                  value={data.brand.expiryTemplate || defaultTemplates.expiry}
                  onChange={(e) => updateData("brand", { expiryTemplate: e.target.value })}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Additional variable:</strong> {`{{hours_remaining}}`}
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            Skip this phase
          </Button>
          <Button onClick={onNext} size="lg" className="gap-2">
            Continue to Team Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandIdentitySetup;
