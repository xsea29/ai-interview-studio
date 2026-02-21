import { useState } from "react";
import { Users, UserPlus, Shield, Eye, Briefcase, ArrowRight, ArrowLeft, Mail, Upload, X, Check, AlertCircle, Key, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { HelpTooltip } from "./HelpTooltip";

interface UserRoleSetupProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  step: number;
}

const roleConfig = {
  admin: {
    icon: Shield,
    label: "System Admin",
    description: "Full access to all settings, billing, privacy, and integrations",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  ta_manager: {
    icon: Briefcase,
    label: "TA Manager",
    description: "Create interviews, view analytics, manage recruiters",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  recruiter: {
    icon: Users,
    label: "Recruiter",
    description: "Launch and review interviews for assigned jobs",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  viewer: {
    icon: Eye,
    label: "Viewer",
    description: "Read-only access for hiring managers",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
};

const accessMatrix = {
  admin: {
    createInterviews: true,
    viewAnalytics: true,
    manageUsers: true,
    billing: true,
    privacy: true,
    integrations: true,
    exportData: true,
  },
  ta_manager: {
    createInterviews: true,
    viewAnalytics: true,
    manageUsers: false,
    billing: false,
    privacy: false,
    integrations: false,
    exportData: false,
  },
  recruiter: {
    createInterviews: true,
    viewAnalytics: false,
    manageUsers: false,
    billing: false,
    privacy: false,
    integrations: false,
    exportData: false,
  },
  viewer: {
    createInterviews: false,
    viewAnalytics: false,
    manageUsers: false,
    billing: false,
    privacy: false,
    integrations: false,
    exportData: false,
  },
};

const UserRoleSetup = ({ data, updateData, onNext, onBack, onSkip, step }: UserRoleSetupProps) => {
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "ta_manager" | "recruiter" | "viewer">("recruiter");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addUser = () => {
    if (!newEmail.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(newEmail)) {
      setEmailError("Invalid email format");
      return;
    }
    if (data.users.invitedUsers.some((u) => u.email === newEmail)) {
      setEmailError("User already invited");
      return;
    }

    updateData("users", {
      invitedUsers: [
        ...data.users.invitedUsers,
        { email: newEmail, role: newRole, status: "pending" },
      ],
    });
    setNewEmail("");
    setEmailError(null);
    toast.success(`Invitation prepared for ${newEmail}`);
  };

  const handleBulkImport = () => {
    const emails = bulkEmails
      .split(/[\n,;]/)
      .map((e) => e.trim())
      .filter((e) => e && validateEmail(e));

    const existingEmails = data.users.invitedUsers.map((u) => u.email);
    const newUsers = emails
      .filter((email) => !existingEmails.includes(email))
      .map((email) => ({ email, role: newRole, status: "pending" as const }));

    if (newUsers.length > 0) {
      updateData("users", {
        invitedUsers: [...data.users.invitedUsers, ...newUsers],
      });
      toast.success(`${newUsers.length} users added`);
    }

    setBulkEmails("");
    setShowBulkDialog(false);
  };

  const removeUser = (email: string) => {
    updateData("users", {
      invitedUsers: data.users.invitedUsers.filter((u) => u.email !== email),
    });
  };

  const updateUserRole = (email: string, role: "admin" | "ta_manager" | "recruiter" | "viewer") => {
    updateData("users", {
      invitedUsers: data.users.invitedUsers.map((u) =>
        u.email === email ? { ...u, role } : u
      ),
    });
  };

  // Step 0: Invite Users
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Invite Team Members</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add users who will use the AI interview platform
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Add Users</CardTitle>
            <CardDescription>Invite by email or import from CSV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="colleague@company.com"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && addUser()}
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as typeof newRole)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className={cn("w-4 h-4", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addUser}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex gap-2">
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Bulk Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Import Users</DialogTitle>
                    <DialogDescription>
                      Paste emails separated by commas, semicolons, or new lines
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="john@company.com&#10;jane@company.com&#10;bob@company.com"
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      rows={6}
                    />
                    <div className="flex gap-2">
                      <Select value={newRole} onValueChange={(v) => setNewRole(v as typeof newRole)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role for all" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleBulkImport}>Import All</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {data.users.invitedUsers.length > 0 && (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">
                Invited Users ({data.users.invitedUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.invitedUsers.map((user) => {
                    const config = roleConfig[user.role];
                    return (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(v) => updateUserRole(user.email, v as typeof user.role)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <div className="flex items-center gap-2">
                                <config.icon className={cn("w-4 h-4", config.color)} />
                                {config.label}
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(roleConfig).map(([key, c]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <c.icon className={cn("w-4 h-4", c.color)} />
                                    {c.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {user.status === "pending" ? "Pending Invite" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeUser(user.email)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Invitations will be sent when you complete the onboarding process.
          </AlertDescription>
        </Alert>

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
              Continue to Role Permissions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Role Permissions
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Role Permissions</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Review role capabilities and admin controls
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(roleConfig).map(([key, config]) => (
          <Card key={key} className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl", config.bgColor)}>
                  <config.icon className={cn("w-6 h-6", config.color)} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{config.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(accessMatrix[key as keyof typeof accessMatrix]).map(
                      ([perm, allowed]) =>
                        allowed && (
                          <Badge key={perm} variant="outline" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            {perm.replace(/([A-Z])/g, " $1").trim()}
                          </Badge>
                        )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin-Only Controls
          </CardTitle>
          <CardDescription>
            These actions are restricted to System Admins only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Key, label: "Change billing plan" },
              { icon: Shield, label: "Configure privacy/legal settings" },
              { icon: Upload, label: "Configure integrations" },
              { icon: History, label: "Export/erase all data" },
              { icon: Users, label: "Manage user roles" },
              { icon: AlertCircle, label: "Deactivate accounts" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <item.icon className="w-4 h-4 text-destructive" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mfa" className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Require MFA for All Users
                <HelpTooltip content="Multi-factor authentication adds a second verification step (like a phone code) when logging in.&#10;&#10;Strongly recommended for organizations handling sensitive candidate data or in regulated industries." />
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Force multi-factor authentication for enhanced security
              </p>
            </div>
            <Switch
              id="mfa"
              checked={data.users.mfaRequired}
              onCheckedChange={(checked) => updateData("users", { mfaRequired: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Alert className="border-primary/30 bg-primary/5">
        <AlertCircle className="w-4 h-4 text-primary" />
        <AlertDescription>
          <strong>Note:</strong> This system does not include ATS pipelines or workflow management.
          It focuses purely on AI-powered interview creation, launch, and evaluation.
        </AlertDescription>
      </Alert>

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
            Continue to Data Import
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleSetup;
