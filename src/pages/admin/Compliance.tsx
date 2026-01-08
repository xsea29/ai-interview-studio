import { useState } from "react";
import { Shield, Globe, Clock, Trash2, Download, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Compliance() {
  const [dataResidency, setDataResidency] = useState("US");
  const [defaultRetention, setDefaultRetention] = useState("365");
  const [deleteOnOrgRemoval, setDeleteOnOrgRemoval] = useState(true);
  const [exportOnDelete, setExportOnDelete] = useState(true);
  const [erasureDialogOpen, setErasureDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [consentTemplate, setConsentTemplate] = useState(`By proceeding with this interview, you acknowledge and agree to the following:

1. **Recording Consent**: This interview session will be recorded for evaluation purposes.

2. **AI Processing**: Your responses will be analyzed by artificial intelligence systems to assess your qualifications.

3. **Data Storage**: Your interview data will be stored securely for the duration specified by the hiring organization.

4. **Your Rights**: You have the right to request access to, correction of, or deletion of your personal data.

5. **Contact**: For questions about your data, contact the hiring organization or our support team.`);

  const handleSaveSettings = () => {
    toast.success("Compliance settings saved successfully");
  };

  const handleErasureTrigger = () => {
    toast.success("Right to Erasure batch process initiated");
    setErasureDialogOpen(false);
  };

  const handleExportLogs = () => {
    toast.success("Audit logs export started. Download will begin shortly.");
    setExportDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compliance & Data Governance</h1>
          <p className="text-muted-foreground mt-1">
            Configure global legal and compliance rules for the platform
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="ai-gradient text-primary-foreground">
          Save Changes
        </Button>
      </div>

      {/* Data Residency */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Data Residency
          </CardTitle>
          <CardDescription>
            Select the primary region where platform data will be stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "US", label: "United States", region: "us-east-1", flag: "🇺🇸" },
                { value: "EU", label: "European Union", region: "eu-west-1", flag: "🇪🇺" },
                { value: "APAC", label: "Asia Pacific", region: "ap-southeast-1", flag: "🌏" },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    dataResidency === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setDataResidency(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.flag}</span>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.region}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Changing data residency affects where new data is stored. Existing data migration
              requires a support ticket.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Data Retention Policy
          </CardTitle>
          <CardDescription>
            Configure how long interview data is retained by default
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Retention Period</Label>
              <Select value={defaultRetention} onValueChange={setDefaultRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">365 days (1 year)</SelectItem>
                  <SelectItem value="730">730 days (2 years)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Organizations can override this with shorter periods
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Hard Delete After Retention</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete data after retention period
                  </p>
                </div>
                <Switch checked={deleteOnOrgRemoval} onCheckedChange={setDeleteOnOrgRemoval} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Export Before Deletion</p>
                  <p className="text-sm text-muted-foreground">
                    Create backup export before permanent deletion
                  </p>
                </div>
                <Switch checked={exportOnDelete} onCheckedChange={setExportOnDelete} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Template */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Consent Policy Template
          </CardTitle>
          <CardDescription>
            Default consent text shown to candidates before interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={consentTemplate}
            onChange={(e) => setConsentTemplate(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Supports Markdown formatting. Organizations can customize this template.
          </p>
        </CardContent>
      </Card>

      {/* Critical Actions */}
      <Card className="card-elevated border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Critical Data Operations
          </CardTitle>
          <CardDescription>
            These actions affect data across the entire platform. Use with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    Right to Erasure Batch
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Process pending deletion requests from candidates
                  </p>
                  <Badge variant="outline" className="mt-2">
                    12 pending requests
                  </Badge>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setErasureDialogOpen(true)}
                >
                  Process
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    Export Platform Audit Logs
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download complete audit trail for compliance review
                  </p>
                  <Badge variant="outline" className="mt-2">
                    Last export: 7 days ago
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erasure Confirmation Dialog */}
      <Dialog open={erasureDialogOpen} onOpenChange={setErasureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Process Right to Erasure Requests
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all data for 12 candidates who have requested erasure.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Affected data includes:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Interview recordings and transcripts</li>
              <li>• AI evaluation reports</li>
              <li>• Personal information and contact details</li>
              <li>• All associated audit logs</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setErasureDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleErasureTrigger}>
              Process Erasure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Audit Logs
            </DialogTitle>
            <DialogDescription>
              Select the date range for the audit log export.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportLogs} className="ai-gradient text-primary-foreground">
              Start Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
