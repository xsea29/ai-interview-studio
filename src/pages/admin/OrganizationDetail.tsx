import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  Clock,
  Globe,
  Shield,
  Webhook,
  Key,
  RefreshCw,
  Download,
  AlertTriangle,
  Check,
  X,
  Pause,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const mockOrg = {
  id: "org-001",
  name: "TechCorp Inc.",
  domain: "techcorp.com",
  status: "active",
  plan: "enterprise",
  createdAt: "2024-01-15",
  atsIntegrated: true,
  atsProvider: "Greenhouse",
  consentConfigured: true,
  dataResidency: "US",
  retentionDays: 365,
  ssoEnabled: true,
  gdprCompliant: true,
  usage: {
    interviewsThisMonth: 128,
    creditsConsumed: 340,
    creditsTotal: 500,
    usersActive: 38,
    usersTotal: 45,
    storageUsedGB: 12.4,
    storageTotalGB: 50,
    aiProcessingHours: 24.5,
  },
  users: [
    { id: "u1", name: "Sarah Chen", email: "sarah@techcorp.com", role: "Admin", status: "active", lastActive: "2h ago" },
    { id: "u2", name: "Mike Johnson", email: "mike@techcorp.com", role: "TA Manager", status: "active", lastActive: "5m ago" },
    { id: "u3", name: "Emily Davis", email: "emily@techcorp.com", role: "Recruiter", status: "active", lastActive: "1d ago" },
    { id: "u4", name: "James Wilson", email: "james@techcorp.com", role: "Viewer", status: "inactive", lastActive: "30d ago" },
  ],
  integrations: {
    ats: { connected: true, provider: "Greenhouse", lastSync: "2 hours ago" },
    webhooks: [
      { url: "https://api.techcorp.com/webhooks/interview", events: ["interview.completed", "report.generated"] },
    ],
    apiKeys: [
      { name: "Production API Key", key: "sk_live_****...****h7f2", created: "2024-01-20", lastUsed: "Today" },
    ],
  },
};

const roleColors: Record<string, string> = {
  Admin: "bg-primary/15 text-primary",
  "TA Manager": "bg-accent text-accent-foreground",
  Recruiter: "bg-success/15 text-success",
  Viewer: "bg-muted text-muted-foreground",
};

export default function OrganizationDetail() {
  const { id } = useParams();

  const handleSuspend = () => {
    toast.success("Organization suspended");
  };

  const handleTestConnection = () => {
    toast.success("ATS connection test successful");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/admin/organizations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Organizations
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{mockOrg.name}</h1>
              <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                Active
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{mockOrg.domain}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>Created: {mockOrg.createdAt}</span>
              <span>•</span>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Enterprise
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" onClick={handleSuspend}>
            <Pause className="h-4 w-4 mr-2" />
            Suspend
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Credits Used</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold">{mockOrg.usage.creditsConsumed}</span>
              <span className="text-muted-foreground">/{mockOrg.usage.creditsTotal}</span>
            </div>
            <Progress value={(mockOrg.usage.creditsConsumed / mockOrg.usage.creditsTotal) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Active Users</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold">{mockOrg.usage.usersActive}</span>
              <span className="text-muted-foreground">/{mockOrg.usage.usersTotal}</span>
            </div>
            <Progress value={(mockOrg.usage.usersActive / mockOrg.usage.usersTotal) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Interviews This Month</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold">{mockOrg.usage.interviewsThisMonth}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Clock className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">AI Processing Saved</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold">{mockOrg.usage.aiProcessingHours}</span>
              <span className="text-muted-foreground"> hrs</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs manual screening</p>
          </CardContent>
        </Card>
      </div>

      {/* Access & Compliance */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Access & Compliance
          </CardTitle>
          <CardDescription>Security and compliance settings for this organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data Residency</p>
                  <p className="text-xs text-muted-foreground">Primary data location</p>
                </div>
              </div>
              <Badge variant="secondary">{mockOrg.dataResidency}</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data Retention</p>
                  <p className="text-xs text-muted-foreground">Interview data kept for</p>
                </div>
              </div>
              <Badge variant="secondary">{mockOrg.retentionDays} days</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Consent Configured</p>
                  <p className="text-xs text-muted-foreground">Candidate consent flow</p>
                </div>
              </div>
              {mockOrg.consentConfigured ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">SSO Enabled</p>
                  <p className="text-xs text-muted-foreground">Single sign-on</p>
                </div>
              </div>
              {mockOrg.ssoEnabled ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">GDPR Compliant</p>
                  <p className="text-xs text-muted-foreground">EU regulation status</p>
                </div>
              </div>
              {mockOrg.gdprCompliant ? (
                <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                  Compliant
                </Badge>
              ) : (
                <Badge variant="destructive">Non-Compliant</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">ATS Integrated</p>
                  <p className="text-xs text-muted-foreground">{mockOrg.atsProvider || "Not connected"}</p>
                </div>
              </div>
              {mockOrg.atsIntegrated ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Users
          </CardTitle>
          <CardDescription>All users in this organization</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrg.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <span className="flex items-center gap-1.5 text-success text-sm">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            Integrations
          </CardTitle>
          <CardDescription>Connected services and API access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ATS */}
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">{mockOrg.integrations.ats.provider}</p>
                  <p className="text-sm text-muted-foreground">
                    Last synced: {mockOrg.integrations.ats.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleTestConnection}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Webhooks */}
          <div>
            <h4 className="font-medium mb-3">Webhooks</h4>
            {mockOrg.integrations.webhooks.map((webhook, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 mb-2">
                <code className="text-sm text-primary">{webhook.url}</code>
                <div className="flex gap-2 mt-2">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* API Keys */}
          <div>
            <h4 className="font-medium mb-3">API Keys</h4>
            {mockOrg.integrations.apiKeys.map((apiKey, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <div>
                  <p className="font-medium">{apiKey.name}</p>
                  <code className="text-sm text-muted-foreground">{apiKey.key}</code>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Created: {apiKey.created}</p>
                  <p>Last used: {apiKey.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
