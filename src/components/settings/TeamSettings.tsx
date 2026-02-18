import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Briefcase, UserPlus, Trash2, MoreHorizontal, Send, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Role = "admin" | "manager" | "recruiter";
interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "pending" | "suspended";
  lastActive: string;
}

const initialMembers: Member[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@acme.com", role: "admin", status: "active", lastActive: "Just now" },
  { id: "2", name: "Marcus Johnson", email: "marcus@acme.com", role: "manager", status: "active", lastActive: "2 hours ago" },
  { id: "3", name: "Emily Rodriguez", email: "emily@acme.com", role: "recruiter", status: "active", lastActive: "Yesterday" },
  { id: "4", name: "James Park", email: "james@acme.com", role: "recruiter", status: "pending", lastActive: "Never" },
];

const roleConfig: Record<Role, { label: string; color: string; desc: string }> = {
  admin: { label: "Admin", color: "bg-primary/10 text-primary border-primary/20", desc: "Full access including billing, settings, and team" },
  manager: { label: "Manager", color: "bg-warning/10 text-warning border-warning/20", desc: "Create & manage interviews, view reports" },
  recruiter: { label: "Recruiter", color: "bg-success/10 text-success border-success/20", desc: "Create interviews, view own candidates" },
};

export function TeamSettings() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("recruiter");

  const handleRoleChange = (id: string, role: Role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    toast.success("Role updated");
  };

  const handleRemove = (id: string, name: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success(`${name} removed from team`);
  };

  const handleSuspend = (id: string, name: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: m.status === "suspended" ? "active" : "suspended" } : m));
    toast.success(`${name}'s access updated`);
  };

  const handleResendInvite = (email: string) => toast.success(`Invite resent to ${email}`);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      lastActive: "Never",
    };
    setMembers(prev => [...prev, newMember]);
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Role Descriptions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Roles & Permissions</CardTitle>
                <CardDescription>Three-tier access control for your organization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.entries(roleConfig).map(([key, cfg]) => (
                <div key={key} className={`p-4 rounded-lg border ${cfg.color}`}>
                  <div className="font-semibold text-sm mb-1">{cfg.label}</div>
                  <div className="text-xs opacity-80">{cfg.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Members */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Team Members</CardTitle>
                  <CardDescription>{members.length} members · {members.filter(m => m.status === "pending").length} pending</CardDescription>
                </div>
              </div>
              <Button onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {members.map((member) => {
              const cfg = roleConfig[member.role];
              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${member.status === "suspended" ? "opacity-60 bg-muted/30" : "bg-card"}`}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs">{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{member.name}</span>
                      <Badge variant="secondary" className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                      {member.status === "pending" && <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">Pending</Badge>}
                      {member.status === "suspended" && <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">Suspended</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{member.email} · {member.lastActive}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Select value={member.role} onValueChange={(v) => handleRoleChange(member.id, v as Role)}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="recruiter">Recruiter</SelectItem>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleResendInvite(member.email)}>
                            <Send className="h-4 w-4 mr-2" />Resend Invite
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleSuspend(member.id, member.name)}>
                          <UserX className="h-4 w-4 mr-2" />
                          {member.status === "suspended" ? "Reactivate" : "Suspend"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleRemove(member.id, member.name)}>
                          <Trash2 className="h-4 w-4 mr-2" />Remove from Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>They'll receive an email with a link to join your organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleInvite()}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — Full access</SelectItem>
                  <SelectItem value="manager">Manager — Create & manage interviews</SelectItem>
                  <SelectItem value="recruiter">Recruiter — Create interviews, view own candidates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              <Send className="h-4 w-4 mr-2" />Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
