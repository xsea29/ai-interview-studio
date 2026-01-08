import { useState } from "react";
import { Building2, Mail, User, Globe, Briefcase, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OnboardingData } from "@/pages/CompanyOnboarding";

interface AccountCreationProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
}

const countries = [
  "United States", "United Kingdom", "Canada", "Germany", "France", 
  "Australia", "India", "Singapore", "Japan", "Netherlands", "Sweden",
  "Switzerland", "United Arab Emirates", "Brazil", "Mexico"
];

const industries = [
  "Technology", "Healthcare", "Finance & Banking", "E-commerce", "Manufacturing",
  "Education", "Media & Entertainment", "Retail", "Consulting", "Telecommunications",
  "Real Estate", "Hospitality", "Automotive", "Energy", "Non-profit"
];

const AccountCreation = ({ data, updateData, onNext }: AccountCreationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingDomain, setExistingDomain] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const extractDomain = (email: string) => {
    const parts = email.split("@");
    return parts.length === 2 ? parts[1] : "";
  };

  const handleEmailChange = (email: string) => {
    updateData("account", { email });
    
    // Simulate domain check
    const domain = extractDomain(email);
    if (domain) {
      updateData("domainVerification", { domain });
      // Simulate existing domain check (random for demo)
      setExistingDomain(domain === "google.com" || domain === "microsoft.com");
    }
    
    if (email && !validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid work email" }));
    } else {
      setErrors(prev => {
        const { email: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.account.name.trim()) newErrors.name = "Name is required";
    if (!data.account.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(data.account.email)) newErrors.email = "Invalid email format";
    if (!data.account.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!data.account.country) newErrors.country = "Country is required";
    if (!data.account.industry) newErrors.industry = "Industry is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Building2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get started by providing your details. We'll verify your company domain to ensure security.
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            System Administrator Details
          </CardTitle>
          <CardDescription>
            You'll be the primary admin for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={data.account.name}
                onChange={(e) => updateData("account", { name: e.target.value })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Work Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  value={data.account.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          {existingDomain && (
            <Alert className="border-warning/50 bg-warning/10">
              <AlertCircle className="w-4 h-4 text-warning" />
              <AlertDescription className="text-warning">
                <strong>{data.domainVerification.domain}</strong> is already registered. 
                You can <button className="underline font-medium">join the existing organization</button> or 
                <button className="underline font-medium ml-1">verify ownership</button> to take control.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company Information
          </CardTitle>
          <CardDescription>
            Tell us about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="Acme Corporation"
              value={data.account.companyName}
              onChange={(e) => updateData("account", { companyName: e.target.value })}
              className={errors.companyName ? "border-destructive" : ""}
            />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={data.account.country}
                onValueChange={(value) => updateData("account", { country: value })}
              >
                <SelectTrigger id="country" className={errors.country ? "border-destructive" : ""}>
                  <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={data.account.industry}
                onValueChange={(value) => updateData("account", { industry: value })}
              >
                <SelectTrigger id="industry" className={errors.industry ? "border-destructive" : ""}>
                  <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-xs text-destructive">{errors.industry}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" className="gap-2">
          Continue to Verification
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AccountCreation;
