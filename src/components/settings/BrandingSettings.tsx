import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Type, Mail, Upload, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const emailTemplates = [
  { key: "invite", label: "Interview Invitation" },
  { key: "reminder", label: "Interview Reminder" },
  { key: "completion", label: "Interview Completed" },
  { key: "rejection", label: "Rejection Email" },
];

const defaultTemplates: Record<string, string> = {
  invite: `Hi {{candidate_name}},

We're excited to invite you to complete an AI-powered interview for the {{role}} position at {{company_name}}.

Your interview link: {{interview_link}}

This interview takes approximately {{duration}} minutes and can be completed at your convenience within {{access_window}} hours.

Best regards,
{{recruiter_name}}
{{company_name}}`,
  reminder: `Hi {{candidate_name}},

This is a reminder that your interview for {{role}} at {{company_name}} is expiring soon.

Complete your interview here: {{interview_link}}

Best,
{{company_name}} Recruiting Team`,
  completion: `Hi {{candidate_name}},

Thank you for completing your interview for {{role}} at {{company_name}}. Our team will review your responses and be in touch within 3–5 business days.

Best regards,
{{recruiter_name}}`,
  rejection: `Hi {{candidate_name}},

Thank you for your interest in the {{role}} position at {{company_name}}. After careful consideration, we will not be moving forward at this time.

We appreciate your time and wish you the best.

Sincerely,
{{company_name}} Recruiting Team`,
};

export function BrandingSettings() {
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [secondaryColor, setSecondaryColor] = useState("#64748b");
  const [accentColor, setAccentColor] = useState("#06b6d4");
  const [font, setFont] = useState("modern");
  const [recruiterSignature, setRecruiterSignature] = useState("The Recruiting Team\nAcme Corp | hr@acme.com");
  const [supportEmail, setSupportEmail] = useState("hr@acme.com");
  const [activeTemplate, setActiveTemplate] = useState("invite");
  const [templates, setTemplates] = useState(defaultTemplates);

  const handleSave = () => toast.success("Branding settings saved");

  return (
    <div className="space-y-6">
      {/* Visual Identity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Visual Identity</CardTitle>
                <CardDescription>Colors, fonts, and logos for your candidate experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Logo Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo (Light Mode)</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">Logo</div>
                  <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Upload</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo (Dark Mode)</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-foreground/90">
                  <div className="h-10 w-10 rounded bg-muted-foreground/20 flex items-center justify-center text-xs text-background/60">Logo</div>
                  <Button variant="outline" size="sm" className="border-background/20 text-background/80 hover:text-background hover:bg-background/10"><Upload className="h-3.5 w-3.5 mr-1.5" />Upload</Button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-9 w-12 rounded border cursor-pointer p-0.5" />
                  <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
                </div>
                <p className="text-xs text-muted-foreground">Buttons, links, highlights</p>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="h-9 w-12 rounded border cursor-pointer p-0.5" />
                  <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="font-mono text-sm" />
                </div>
                <p className="text-xs text-muted-foreground">Secondary actions, tags</p>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="h-9 w-12 rounded border cursor-pointer p-0.5" />
                  <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="font-mono text-sm" />
                </div>
                <p className="text-xs text-muted-foreground">Hover states, accents</p>
              </div>
            </div>

            {/* Font */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Type className="h-3.5 w-3.5" />Font Style</Label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: "modern", label: "Modern", sample: "Aa", desc: "Inter · Clean, professional" },
                  { value: "classic", label: "Classic", sample: "Aa", desc: "Georgia · Trustworthy, formal" },
                  { value: "tech", label: "Tech", sample: "Aa", desc: "JetBrains Mono · Developer-focused" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFont(opt.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${font === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="text-2xl font-bold mb-1">{opt.sample}</div>
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleSave}>Save Visual Identity</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Templates */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Email Templates</CardTitle>
                <CardDescription>Customize automated emails sent to candidates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
              <TabsList className="flex flex-wrap h-auto gap-1 p-1">
                {emailTemplates.map(t => (
                  <TabsTrigger key={t.key} value={t.key} className="text-xs">{t.label}</TabsTrigger>
                ))}
              </TabsList>
              {emailTemplates.map(t => (
                <TabsContent key={t.key} value={t.key} className="space-y-3 mt-4">
                  <Textarea
                    value={templates[t.key]}
                    onChange={e => setTemplates(prev => ({ ...prev, [t.key]: e.target.value }))}
                    rows={10}
                    className="font-mono text-sm resize-none"
                  />
                  <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                    <span className="font-medium">Available variables:</span>
                    {["{{candidate_name}}", "{{role}}", "{{company_name}}", "{{interview_link}}", "{{recruiter_name}}", "{{duration}}", "{{access_window}}"].map(v => (
                      <code key={v} className="bg-muted px-1 rounded">{v}</code>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => toast.success(`${t.label} template saved`)}>Save Template</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Test email sent to your inbox")}>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />Test Send
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setTemplates(prev => ({ ...prev, [t.key]: defaultTemplates[t.key] }))}>Reset to Default</Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <Label>Recruiter Signature</Label>
                <Textarea value={recruiterSignature} onChange={e => setRecruiterSignature(e.target.value)} rows={3} className="resize-none" placeholder="Name&#10;Title | Company" />
              </div>
              <div className="space-y-2">
                <Label>Reply-to / Support Email</Label>
                <Input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
                <p className="text-xs text-muted-foreground">Candidates who reply to emails will reach this address</p>
              </div>
            </div>
            <Button onClick={() => toast.success("Email settings saved")}>Save Email Settings</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
