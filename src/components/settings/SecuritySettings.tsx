import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Clock, Smartphone, Monitor, MapPin, LogOut, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockSessions = [
  { id: "1", device: "Chrome on macOS", ip: "192.168.1.45", location: "New York, US", time: "Active now", current: true },
  { id: "2", device: "Safari on iPhone", ip: "73.45.12.88", location: "New York, US", time: "2 hours ago", current: false },
  { id: "3", device: "Firefox on Windows", ip: "45.23.100.12", location: "London, UK", time: "Yesterday", current: false },
];

export function SecuritySettings() {
  const [passwordPolicy, setPasswordPolicy] = useState("strong");
  const [loginMethod, setLoginMethod] = useState("email");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [mfaEnforced, setMfaEnforced] = useState(false);
  const [mfaAdminsOnly, setMfaAdminsOnly] = useState(true);
  const [forceLogoutOnChange, setForceLogoutOnChange] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => toast.success("Security settings saved");
  const handleRevokeSession = (id: string) => {
    if (id !== "1") toast.success("Session revoked successfully");
  };

  return (
    <div className="space-y-6">
      {/* Authentication */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Authentication</CardTitle>
                <CardDescription>Control how your team signs in</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Login Method</Label>
                <Select value={loginMethod} onValueChange={setLoginMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email & Password only</SelectItem>
                    <SelectItem value="sso">SSO only (Enterprise)</SelectItem>
                    <SelectItem value="both">Email + SSO (Both allowed)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">SSO requires Enterprise plan</p>
              </div>
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes (High security)</SelectItem>
                    <SelectItem value="30">30 minutes (Recommended)</SelectItem>
                    <SelectItem value="60">60 minutes (Balanced)</SelectItem>
                    <SelectItem value="120">2 hours (Convenience)</SelectItem>
                    <SelectItem value="480">8 hours (Low security)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password Policy</Label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: "basic", label: "Basic", desc: "Min 8 chars, 1 number" },
                  { value: "strong", label: "Strong", desc: "12+ chars, upper, number, symbol" },
                  { value: "enterprise", label: "Enterprise", desc: "16+ chars, all requirements" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPasswordPolicy(opt.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      passwordPolicy === opt.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Force logout on password change</Label>
                <p className="text-xs text-muted-foreground mt-0.5">All active sessions will be terminated when a user changes their password</p>
              </div>
              <Switch checked={forceLogoutOnChange} onCheckedChange={setForceLogoutOnChange} />
            </div>

            <Button onClick={handleSave}>Save Authentication Settings</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* MFA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Multi-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security for your team</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Enforce MFA for all users</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Users must set up MFA before accessing the platform</p>
              </div>
              <Switch checked={mfaEnforced} onCheckedChange={v => { setMfaEnforced(v); if (v) setMfaAdminsOnly(false); }} />
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border transition-opacity ${mfaEnforced ? "opacity-40 pointer-events-none" : ""}`}>
              <div>
                <Label>Enforce MFA for admins only</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Only admin accounts require MFA setup</p>
              </div>
              <Switch checked={mfaAdminsOnly} onCheckedChange={setMfaAdminsOnly} disabled={mfaEnforced} />
            </div>
            <div className="space-y-2">
              <Label>Allowed MFA methods</Label>
              <div className="flex flex-wrap gap-2">
                {["Authenticator App", "SMS", "Email OTP", "Backup Codes"].map(m => (
                  <Badge key={m} variant="secondary" className="cursor-pointer hover:bg-primary/10">{m}</Badge>
                ))}
              </div>
            </div>
            <Button onClick={() => toast.success("MFA settings saved")}>Save MFA Settings</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Sessions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">Active Sessions</CardTitle>
                <CardDescription>Devices currently logged into your account</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.success("All other sessions revoked")}>
                <LogOut className="h-4 w-4 mr-2" />
                Revoke All Others
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className={`flex items-center justify-between p-3 rounded-lg border ${session.current ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      {session.device}
                      {session.current && <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">Current</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <MapPin className="h-3 w-3" />{session.location} · {session.ip} · {session.time}
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => handleRevokeSession(session.id)}>
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
