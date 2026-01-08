import { useState } from "react";
import { Flag, Search, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  type: "internal" | "beta" | "general";
  availability: "global" | "enterprise" | "business";
  enabled: boolean;
}

const initialFeatures: FeatureFlag[] = [
  {
    id: "video-interviews",
    name: "Video Interviews",
    description: "Enable video-based AI interviews with facial analysis",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "audio-interviews",
    name: "Audio Interviews",
    description: "Enable audio-only AI interviews with speech analysis",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "fairness-scoring",
    name: "Fairness Scoring",
    description: "AI-powered bias detection and fairness metrics",
    type: "beta",
    availability: "enterprise",
    enabled: true,
  },
  {
    id: "ai-model-v18",
    name: "AI Model v1.8",
    description: "Latest AI model with improved accuracy and speed",
    type: "beta",
    availability: "enterprise",
    enabled: false,
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Real-time event notifications to external systems",
    type: "general",
    availability: "business",
    enabled: true,
  },
  {
    id: "ats-api-sync",
    name: "ATS API Sync",
    description: "Two-way sync with Applicant Tracking Systems",
    type: "general",
    availability: "business",
    enabled: true,
  },
  {
    id: "white-label",
    name: "Branding White-Label",
    description: "Full customization of candidate-facing interface",
    type: "general",
    availability: "enterprise",
    enabled: true,
  },
  {
    id: "gdpr-module",
    name: "GDPR Module",
    description: "Enhanced EU data protection and consent management",
    type: "general",
    availability: "global",
    enabled: true,
  },
  {
    id: "sso-support",
    name: "SSO Support",
    description: "SAML and OAuth single sign-on integration",
    type: "general",
    availability: "enterprise",
    enabled: true,
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Deep dive analytics with custom reports",
    type: "beta",
    availability: "enterprise",
    enabled: false,
  },
  {
    id: "multi-language",
    name: "Multi-Language Support",
    description: "AI interviews in 12+ languages",
    type: "internal",
    availability: "global",
    enabled: false,
  },
  {
    id: "candidate-mobile-app",
    name: "Candidate Mobile App",
    description: "Native mobile app for candidate interviews",
    type: "internal",
    availability: "global",
    enabled: false,
  },
];

const typeConfig: Record<string, { label: string; className: string }> = {
  internal: { label: "Internal", className: "bg-muted text-muted-foreground" },
  beta: { label: "Beta", className: "bg-warning/15 text-warning" },
  general: { label: "General", className: "bg-success/15 text-success" },
};

const availabilityConfig: Record<string, { label: string; className: string }> = {
  global: { label: "All Plans", className: "bg-primary/15 text-primary" },
  enterprise: { label: "Enterprise Only", className: "bg-accent text-accent-foreground" },
  business: { label: "Business+", className: "bg-secondary text-secondary-foreground" },
};

export default function FeatureFlags() {
  const [features, setFeatures] = useState<FeatureFlag[]>(initialFeatures);
  const [search, setSearch] = useState("");

  const filteredFeatures = features.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
    const feature = features.find((f) => f.id === id);
    if (feature) {
      toast.success(`${feature.name} ${feature.enabled ? "disabled" : "enabled"}`);
    }
  };

  const enabledCount = features.filter((f) => f.enabled).length;
  const betaCount = features.filter((f) => f.type === "beta").length;
  const internalCount = features.filter((f) => f.type === "internal").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Feature Flags</h1>
        <p className="text-muted-foreground mt-1">
          Toggle platform features globally across all organizations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enabled Features</p>
                <p className="text-2xl font-semibold mt-1 text-success">{enabledCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Flag className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Beta Features</p>
                <p className="text-2xl font-semibold mt-1 text-warning">{betaCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Flag className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Internal/Testing</p>
                <p className="text-2xl font-semibold mt-1">{internalCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Flag className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Table */}
      <Card className="card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Feature</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[140px]">Availability</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeatures.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feature.name}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{feature.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {feature.description}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={typeConfig[feature.type].className}>
                    {typeConfig[feature.type].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={availabilityConfig[feature.availability].className}>
                    {availabilityConfig[feature.availability].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
