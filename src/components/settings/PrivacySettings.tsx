import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Database, Globe, FileText, Download, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function PrivacySettings() {
  const [recordingConsent, setRecordingConsent] = useState("required");
  const [aiConsent, setAiConsent] = useState(true);
  const [faceProcessing, setFaceProcessing] = useState(true);
  const [voiceProcessing, setVoiceProcessing] = useState(true);
  const [fairUseDisclosure, setFairUseDisclosure] = useState(true);
  const [retentionPeriod, setRetentionPeriod] = useState("90");
  const [autoDelete, setAutoDelete] = useState(true);
  const [exportOnDelete, setExportOnDelete] = useState(false);
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [ccpaEnabled, setCcpaEnabled] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsExporting(false);
    toast.success("Export started — you'll receive an email when it's ready");
  };

  return (
    <div className="space-y-6">
      {/* Consent Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Consent Management</CardTitle>
                <CardDescription>Control what candidates must consent to before interviews</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Recording Consent Requirement</Label>
              <Select value={recordingConsent} onValueChange={setRecordingConsent}>
                <SelectTrigger className="w-full sm:w-72"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required — candidate must accept to proceed</SelectItem>
                  <SelectItem value="optional">Optional — candidate may decline</SelectItem>
                  <SelectItem value="disabled">Disabled — no consent screen shown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {[
              { label: "AI Evaluation Consent", desc: "Candidates consent to AI scoring their responses", value: aiConsent, onChange: setAiConsent },
              { label: "Face Processing Consent", desc: "Consent to analyze facial expressions during video interviews", value: faceProcessing, onChange: setFaceProcessing },
              { label: "Voice Processing Consent", desc: "Consent to analyze voice tone and patterns", value: voiceProcessing, onChange: setVoiceProcessing },
              { label: "Fair Use Disclosure", desc: "Display a disclosure that AI is used as an aid, not a sole decision-maker", value: fairUseDisclosure, onChange: setFairUseDisclosure },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label>{item.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}

            <Button onClick={() => toast.success("Consent settings saved")}>Save Consent Settings</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Governance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Data Governance</CardTitle>
                <CardDescription>Retention periods, deletion schedules, and exports</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Data Retention Period</Label>
              <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="0">Indefinite (manual delete only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Interview recordings and candidate data older than this will be deleted</p>
            </div>

            {[
              { label: "Auto-delete after retention period", desc: "Automatically remove data when the period expires", value: autoDelete, onChange: setAutoDelete },
              { label: "Export before deletion", desc: "Generate a data export 7 days before scheduled deletion", value: exportOnDelete, onChange: setExportOnDelete },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label>{item.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}

            {/* Export */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Export All Data</div>
                  <div className="text-xs text-muted-foreground">Download interviews, reports, and recordings as a ZIP</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Preparing..." : "Export Data"}
              </Button>
            </div>

            {/* Danger zone */}
            <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-destructive">Delete All Organization Data</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Permanently delete all interviews, reports, and candidate data. Irreversible.</div>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>Delete All</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Regional Compliance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Regional Compliance</CardTitle>
                <CardDescription>Enable compliance modes for specific regions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "GDPR (European Union)", desc: "Enable GDPR-specific data handling, right to erasure, and DPA templates", value: gdprEnabled, onChange: setGdprEnabled },
              { label: "CCPA (California, USA)", desc: "Enable California Consumer Privacy Act compliance, opt-out banners, and data request workflows", value: ccpaEnabled, onChange: setCcpaEnabled },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label>{item.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}
            <Button onClick={() => toast.success("Compliance settings saved")}>Save Compliance Settings</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />Delete All Organization Data
            </DialogTitle>
            <DialogDescription>This action is irreversible. All interviews, candidate data, reports, and recordings will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm">Type <strong className="text-destructive">DELETE ALL</strong> to confirm:</p>
            <Input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE ALL" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setConfirmText(""); }}>Cancel</Button>
            <Button variant="destructive" disabled={confirmText !== "DELETE ALL"} onClick={() => { toast.success("Deletion scheduled."); setDeleteDialogOpen(false); setConfirmText(""); }}>
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
