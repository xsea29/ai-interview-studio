import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Slack, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type NotifKey = "interviewCompleted" | "interviewStarted" | "candidateApplied" | "teamInvited" | "reportReady" | "billingAlert" | "webhookFailed";

interface NotifPref {
  label: string;
  desc: string;
  email: boolean;
  inApp: boolean;
}

const defaultPrefs: Record<NotifKey, NotifPref> = {
  interviewCompleted: { label: "Interview Completed", desc: "When a candidate finishes an interview", email: true, inApp: true },
  interviewStarted: { label: "Interview Started", desc: "When a candidate begins their interview", email: false, inApp: true },
  candidateApplied: { label: "Candidate Applied", desc: "New candidate enters the pipeline", email: true, inApp: true },
  teamInvited: { label: "Team Member Invited", desc: "When a new member accepts their invite", email: true, inApp: false },
  reportReady: { label: "Report Ready", desc: "AI evaluation report is generated", email: false, inApp: true },
  billingAlert: { label: "Billing Alerts", desc: "Payment failures, low credits, renewal reminders", email: true, inApp: true },
  webhookFailed: { label: "Webhook Failed", desc: "When a webhook delivery fails after retries", email: true, inApp: true },
};

export function NotificationSettings() {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [frequency, setFrequency] = useState("instant");
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");
  const [quietEnabled, setQuietEnabled] = useState(false);
  const [weekendOff, setWeekendOff] = useState(false);
  const [slackConnected, setSlackConnected] = useState(false);

  const toggle = (key: NotifKey, channel: "email" | "inApp") => {
    setPrefs(prev => ({ ...prev, [key]: { ...prev[key], [channel]: !prev[key][channel] } }));
  };

  return (
    <div className="space-y-6">
      {/* Per-event toggles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose which events trigger email and in-app alerts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_80px_80px] gap-2 text-xs font-medium text-muted-foreground pb-1 border-b px-1">
              <span>Event</span>
              <span className="text-center flex items-center justify-center gap-1"><Mail className="h-3 w-3" />Email</span>
              <span className="text-center flex items-center justify-center gap-1"><Bell className="h-3 w-3" />In-app</span>
            </div>

            {(Object.entries(prefs) as [NotifKey, NotifPref][]).map(([key, pref]) => (
              <div key={key} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center py-1">
                <div>
                  <div className="text-sm font-medium">{pref.label}</div>
                  <div className="text-xs text-muted-foreground">{pref.desc}</div>
                </div>
                <div className="flex justify-center">
                  <Switch checked={pref.email} onCheckedChange={() => toggle(key, "email")} />
                </div>
                <div className="flex justify-center">
                  <Switch checked={pref.inApp} onCheckedChange={() => toggle(key, "inApp")} />
                </div>
              </div>
            ))}

            <div className="pt-2 border-t space-y-2">
              <Label>Email Delivery Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant — send immediately</SelectItem>
                  <SelectItem value="hourly">Hourly digest</SelectItem>
                  <SelectItem value="daily">Daily digest (9 AM)</SelectItem>
                  <SelectItem value="weekly">Weekly summary (Monday)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => toast.success("Notification preferences saved")}>Save Preferences</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Slack */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Slack className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Slack Integration</CardTitle>
                <CardDescription>Receive notifications directly in your Slack workspace</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {slackConnected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-success/5 border-success/20">
                  <div className="text-sm font-medium text-success">Connected to Acme Corp Slack</div>
                  <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => { setSlackConnected(false); toast.success("Slack disconnected"); }}>Disconnect</Button>
                </div>
                <div className="space-y-2">
                  <Label>Notification Channel</Label>
                  <Input defaultValue="#recruiting-alerts" />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Slack className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Connect Slack to get real-time notifications in your team channels</p>
                <Button variant="outline" onClick={() => { setSlackConnected(true); toast.success("Slack connected successfully"); }}>
                  Connect Slack Workspace
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Do Not Disturb */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Moon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Do Not Disturb</CardTitle>
                <CardDescription>Pause notifications during off-hours</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Quiet Hours</Label>
                <p className="text-xs text-muted-foreground mt-0.5">No notifications during this window</p>
              </div>
              <Switch checked={quietEnabled} onCheckedChange={setQuietEnabled} />
            </div>
            {quietEnabled && (
              <div className="grid grid-cols-2 gap-4 pl-1">
                <div className="space-y-2">
                  <Label className="text-xs">From</Label>
                  <Input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Until</Label>
                  <Input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Pause on weekends</Label>
                <p className="text-xs text-muted-foreground mt-0.5">No notifications on Saturday and Sunday</p>
              </div>
              <Switch checked={weekendOff} onCheckedChange={setWeekendOff} />
            </div>
            <Button onClick={() => toast.success("Do Not Disturb settings saved")}>Save DND Settings</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
