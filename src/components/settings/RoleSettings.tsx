import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Briefcase, Check, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager";
  avatar?: string;
}

interface RoleSettingsProps {
  currentUserRole?: "admin" | "manager";
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@acme.com", role: "admin" },
  { id: "2", name: "Marcus Johnson", email: "marcus@acme.com", role: "manager" },
  { id: "3", name: "Emily Rodriguez", email: "emily@acme.com", role: "manager" },
];

const roleConfig = {
  admin: {
    icon: Shield,
    label: "Admin",
    description: "Billing, settings, integrations, team management",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  manager: {
    icon: Briefcase,
    label: "Interview Manager",
    description: "Create, view, and decide on interviews",
    color: "bg-success/10 text-success border-success/20",
  },
};

export function RoleSettings({ currentUserRole = "admin" }: RoleSettingsProps) {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);

  const handleRoleChange = (memberId: string, newRole: "admin" | "manager") => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast.success("Role updated successfully");
  };

  const isAdmin = currentUserRole === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Team Roles</CardTitle>
              <CardDescription>Simple role-based access (not a full permissions matrix)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Descriptions */}
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${config.color}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{config.label}</span>
                  </div>
                  <p className="text-xs opacity-80">{config.description}</p>
                </div>
              );
            })}
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Team Members
            </h4>
            <div className="space-y-2">
              {members.map((member) => {
                const config = roleConfig[member.role];
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    {isAdmin ? (
                      <Select
                        value={member.role}
                        onValueChange={(v) => handleRoleChange(member.id, v as "admin" | "manager")}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3.5 w-3.5" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-3.5 w-3.5" />
                              Interview Manager
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className={config.color}>
                        {config.label}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isAdmin && (
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          )}

          {/* Note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              This is a simple two-role system. No complex permissions, no team hierarchies. 
              Perfect for startups and small teams. Enterprise role management available on request.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
