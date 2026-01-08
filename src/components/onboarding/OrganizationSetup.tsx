import { useState } from "react";
import { Building2, Shield, Video, ArrowRight, ArrowLeft, Users, Clock, MapPin, Lock, Key, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";

interface OrganizationSetupProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const companySizes = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"
];

const departments = [
  "Engineering", "Product", "Design", "Marketing", "Sales", "Finance",
  "HR", "Operations", "Legal", "Customer Success", "Support"
];

const functionalRoles = [
  "Engineering", "Sales", "Finance", "Support", "Marketing", "Product",
  "Design", "HR", "Operations", "Legal", "Executive"
];

const experienceBands = [
  "Intern", "Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Manager", "Director", "VP", "C-Level"
];

const regions = [
  "North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa"
];

const OrganizationSetup = ({ data, updateData, onNext, onBack, step }: OrganizationSetupProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleArrayItem = (
    field: "departments" | "functionalRoles" | "experienceBands" | "allowedRegions" | "interviewTypes",
    item: string
  ) => {
    const current = data.organization[field] as string[];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateData("organization", { [field]: updated });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!data.organization.legalName) newErrors.legalName = "Legal name is required";
      if (!data.organization.displayName) newErrors.displayName = "Display name is required";
      if (!data.organization.companySize) newErrors.companySize = "Company size is required";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  // Step 0: Company Profile
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Company Profile</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Define your organization's structure and preferences
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Company Name *</Label>
                <Input
                  id="legalName"
                  placeholder="Acme Corporation Inc."
                  value={data.organization.legalName}
                  onChange={(e) => updateData("organization", { legalName: e.target.value })}
                  className={errors.legalName ? "border-destructive" : ""}
                />
                {errors.legalName && <p className="text-xs text-destructive">{errors.legalName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="Acme Corp"
                  value={data.organization.displayName}
                  onChange={(e) => updateData("organization", { displayName: e.target.value })}
                  className={errors.displayName ? "border-destructive" : ""}
                />
                {errors.displayName && <p className="text-xs text-destructive">{errors.displayName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size *</Label>
              <Select
                value={data.organization.companySize}
                onValueChange={(value) => updateData("organization", { companySize: value })}
              >
                <SelectTrigger className={errors.companySize ? "border-destructive" : ""}>
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>{size} employees</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companySize && <p className="text-xs text-destructive">{errors.companySize}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Departments</CardTitle>
            <CardDescription>Select departments that will use AI interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Badge
                  key={dept}
                  variant={data.organization.departments.includes(dept) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleArrayItem("departments", dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Functional Roles</CardTitle>
            <CardDescription>Select roles you typically hire for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {functionalRoles.map((role) => (
                <Badge
                  key={role}
                  variant={data.organization.functionalRoles.includes(role) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleArrayItem("functionalRoles", role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Experience Bands</CardTitle>
            <CardDescription>Select experience levels you hire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {experienceBands.map((band) => (
                <Badge
                  key={band}
                  variant={data.organization.experienceBands.includes(band) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleArrayItem("experienceBands", band)}
                >
                  {band}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNext} size="lg" className="gap-2">
            Continue to Security
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: Security Preferences
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Security Preferences</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Configure authentication and access controls
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Password Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={data.organization.passwordPolicy}
              onValueChange={(value) => updateData("organization", { passwordPolicy: value as "basic" | "strong" | "enterprise" })}
              className="space-y-3"
            >
              {[
                { id: "basic", title: "Basic", desc: "8+ characters, mix of letters and numbers" },
                { id: "strong", title: "Strong", desc: "12+ characters, uppercase, lowercase, numbers, symbols" },
                { id: "enterprise", title: "Enterprise", desc: "16+ characters, all requirements + regular rotation" },
              ].map((policy) => (
                <Label
                  key={policy.id}
                  htmlFor={policy.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                    data.organization.passwordPolicy === policy.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={policy.id} id={policy.id} className="mt-1" />
                  <div>
                    <span className="font-medium">{policy.title}</span>
                    <p className="text-sm text-muted-foreground">{policy.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Login Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={data.organization.loginMethod}
              onValueChange={(value) => updateData("organization", { loginMethod: value as "email" | "sso" | "oauth" })}
              className="space-y-3"
            >
              {[
                { id: "email", title: "Email & Password", desc: "Standard email/password authentication" },
                { id: "sso", title: "SSO (SAML)", desc: "Single Sign-On with your identity provider" },
                { id: "oauth", title: "OAuth", desc: "Sign in with Google, Microsoft, or other providers" },
              ].map((method) => (
                <Label
                  key={method.id}
                  htmlFor={`login-${method.id}`}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                    data.organization.loginMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={method.id} id={`login-${method.id}`} className="mt-1" />
                  <div>
                    <span className="font-medium">{method.title}</span>
                    <p className="text-sm text-muted-foreground">{method.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              Session Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeout">Session Timeout (minutes)</Label>
              <Select
                value={String(data.organization.sessionTimeout)}
                onValueChange={(value) => updateData("organization", { sessionTimeout: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 60, 120, 480].map((min) => (
                    <SelectItem key={min} value={String(min)}>
                      {min < 60 ? `${min} minutes` : `${min / 60} hour${min > 60 ? "s" : ""}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Allowed Regions (Optional)
              </Label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Badge
                    key={region}
                    variant={data.organization.allowedRegions.includes(region) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleArrayItem("allowedRegions", region)}
                  >
                    {region}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to allow access from all regions
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNext} size="lg" className="gap-2">
            Continue to Interview Config
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Interview Configuration
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Video className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Default Interview Configuration</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Set organization-wide defaults for AI interviews
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Interview Types</CardTitle>
          <CardDescription>Select supported interview formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {["text", "audio", "video"].map((type) => (
              <Label
                key={type}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                  data.organization.interviewTypes.includes(type)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={data.organization.interviewTypes.includes(type)}
                  onCheckedChange={() => toggleArrayItem("interviewTypes", type)}
                />
                <span className="font-medium capitalize">{type}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Default Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Default Duration (minutes)</Label>
              <Select
                value={String(data.organization.defaultDuration)}
                onValueChange={(value) => updateData("organization", { defaultDuration: Number(value) })}
              >
                <SelectTrigger>
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 20, 30, 45, 60].map((min) => (
                    <SelectItem key={min} value={String(min)}>{min} minutes</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attempts">Max Attempts</Label>
              <Select
                value={String(data.organization.maxAttempts)}
                onValueChange={(value) => updateData("organization", { maxAttempts: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((num) => (
                    <SelectItem key={num} value={String(num)}>{num} attempt{num > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accessWindow">Access Window (days)</Label>
              <Select
                value={String(data.organization.accessWindow)}
                onValueChange={(value) => updateData("organization", { accessWindow: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 14, 30].map((days) => (
                    <SelectItem key={days} value={String(days)}>{days} days</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="resume">Resume Allowed</Label>
                <p className="text-sm text-muted-foreground">Allow candidates to resume interrupted interviews</p>
              </div>
              <Switch
                id="resume"
                checked={data.organization.resumeAllowed}
                onCheckedChange={(checked) => updateData("organization", { resumeAllowed: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext} size="lg" className="gap-2">
          Continue to Brand Setup
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OrganizationSetup;
