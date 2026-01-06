import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Eye, Send, Clock, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface NotificationSettings {
  sendInvite: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
  expiryWarning: boolean;
  onSubmitted: boolean;
  onFailure: boolean;
}

interface NotificationConfigProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  companyName?: string;
  jobTitle?: string;
}

const defaultEmailTemplate = `Hi {{candidate_name}},

You've been invited to complete an AI-powered interview for the {{job_title}} position at {{company_name}}.

Click the link below to begin your interview:
{{interview_link}}

This interview will take approximately {{duration}} minutes and includes {{question_count}} questions.

Your interview link expires on {{expiry_date}}.

Best of luck!
{{company_name}} Hiring Team`;

export function NotificationConfig({ settings, onChange, companyName = "Acme Corp", jobTitle = "the role" }: NotificationConfigProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState(defaultEmailTemplate);

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    onChange({ ...settings, ...updates });
  };

  const triggers = [
    {
      key: "sendInvite" as const,
      icon: Send,
      title: "Interview Invite",
      description: "Send invite when interview is created",
      enabled: settings.sendInvite,
    },
    {
      key: "reminder24h" as const,
      icon: Clock,
      title: "24-Hour Reminder",
      description: "Remind candidates 24 hours before expiry",
      enabled: settings.reminder24h,
    },
    {
      key: "reminder2h" as const,
      icon: Clock,
      title: "2-Hour Reminder",
      description: "Final reminder 2 hours before expiry",
      enabled: settings.reminder2h,
    },
    {
      key: "expiryWarning" as const,
      icon: AlertTriangle,
      title: "Expiry Warning",
      description: "Notify when interview is about to expire",
      enabled: settings.expiryWarning,
    },
    {
      key: "onSubmitted" as const,
      icon: CheckCircle,
      title: "Submission Confirmation",
      description: "Confirm when interview is submitted",
      enabled: settings.onSubmitted,
    },
    {
      key: "onFailure" as const,
      icon: RefreshCw,
      title: "Retry Notification",
      description: "Notify if retry is allowed after failure",
      enabled: settings.onFailure,
    },
  ];

  const previewEmail = emailTemplate
    .replace("{{candidate_name}}", "John Doe")
    .replace("{{job_title}}", jobTitle)
    .replace(/{{company_name}}/g, companyName)
    .replace("{{interview_link}}", "https://interview.ai/i/abc123")
    .replace("{{duration}}", "25")
    .replace("{{question_count}}", "8")
    .replace("{{expiry_date}}", "January 20, 2024");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Candidate Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure email triggers</p>
          </div>
        </div>
        
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Preview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                <div className="font-medium text-sm">
                  You're invited to interview for {jobTitle} at {companyName}
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Body:</div>
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {previewEmail}
                </pre>
              </div>
              <div className="space-y-2">
                <Label>Customize Template</Label>
                <Textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={8}
                  className="text-sm font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {"{{candidate_name}}"}, {"{{job_title}}"}, {"{{company_name}}"}, {"{{interview_link}}"}, {"{{duration}}"}, {"{{question_count}}"}, {"{{expiry_date}}"}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {triggers.map((trigger) => (
          <div
            key={trigger.key}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <trigger.icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{trigger.title}</div>
                <div className="text-xs text-muted-foreground">{trigger.description}</div>
              </div>
            </div>
            <Switch
              checked={trigger.enabled}
              onCheckedChange={(v) => updateSettings({ [trigger.key]: v })}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span>Emails are sent via your configured email provider. WhatsApp/SMS available in Phase II.</span>
        </div>
      </div>
    </motion.div>
  );
}
