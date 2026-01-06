import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Monitor, RefreshCw, Timer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AccessPolicy {
  validFrom: string;
  validUntil: string;
  maxAttempts: number;
  canResume: boolean;
  deviceLock: boolean;
  autoExpireMinutes: number;
}

interface AccessPolicyConfigProps {
  policy: AccessPolicy;
  onChange: (policy: AccessPolicy) => void;
}

export function AccessPolicyConfig({ policy, onChange }: AccessPolicyConfigProps) {
  const updatePolicy = (updates: Partial<AccessPolicy>) => {
    onChange({ ...policy, ...updates });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border p-5 md:p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Interview Access Policy</h3>
          <p className="text-sm text-muted-foreground">Control how candidates access interviews</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Access Window */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Valid From
            </Label>
            <Input
              type="datetime-local"
              value={policy.validFrom}
              onChange={(e) => updatePolicy({ validFrom: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Valid Until
            </Label>
            <Input
              type="datetime-local"
              value={policy.validUntil}
              onChange={(e) => updatePolicy({ validUntil: e.target.value })}
            />
          </div>
        </div>

        {/* Max Attempts */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            Maximum Attempts
          </Label>
          <Select
            value={String(policy.maxAttempts)}
            onValueChange={(v) => updatePolicy({ maxAttempts: parseInt(v) })}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 attempt (strict)</SelectItem>
              <SelectItem value="2">2 attempts</SelectItem>
              <SelectItem value="3">3 attempts</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Number of times a candidate can restart the interview
          </p>
        </div>

        {/* Resume & Device Lock */}
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <Label>Allow Resume if Disconnected</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Candidate can continue from where they left off
                </p>
              </div>
            </div>
            <Switch
              checked={policy.canResume}
              onCheckedChange={(v) => updatePolicy({ canResume: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <Label>Device Lock</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Interview can only be completed on the same device/browser
                </p>
              </div>
            </div>
            <Switch
              checked={policy.deviceLock}
              onCheckedChange={(v) => updatePolicy({ deviceLock: v })}
            />
          </div>
        </div>

        {/* Auto-expire on Inactivity */}
        <div className="space-y-2 pt-2 border-t border-border">
          <Label className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            Auto-expire on Inactivity
          </Label>
          <Select
            value={String(policy.autoExpireMinutes)}
            onValueChange={(v) => updatePolicy({ autoExpireMinutes: parseInt(v) })}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Disabled</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Interview will auto-save and expire after inactivity
          </p>
        </div>
      </div>
    </motion.div>
  );
}
