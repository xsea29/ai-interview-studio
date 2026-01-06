import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Download, Trash2, Clock, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface DataOwnershipSettingsProps {
  retentionPeriod?: string;
  onRetentionChange?: (period: string) => void;
}

export function DataOwnershipSettings({ 
  retentionPeriod = "12months",
  onRetentionChange 
}: DataOwnershipSettingsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [autoDelete, setAutoDelete] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    toast.success("Export started! You'll receive an email when it's ready.");
  };

  const handleDeleteAll = () => {
    if (confirmDelete === "DELETE ALL") {
      toast.success("Data deletion scheduled. This may take up to 24 hours.");
      setDeleteDialogOpen(false);
      setConfirmDelete("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Data Ownership & Control</CardTitle>
              <CardDescription>Manage your organization's interview data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Data */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Export All Interviews</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Download all interview data, reports, and recordings as a ZIP file
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? "Preparing..." : "Export Data"}
              </Button>
            </div>
          </div>

          {/* Retention Period */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <Label>Data Retention Period</Label>
            </div>
            <Select 
              value={retentionPeriod} 
              onValueChange={onRetentionChange}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 months</SelectItem>
                <SelectItem value="6months">6 months</SelectItem>
                <SelectItem value="12months">12 months</SelectItem>
                <SelectItem value="24months">24 months</SelectItem>
                <SelectItem value="indefinite">Indefinite (manual delete only)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Interview data older than this period will be automatically deleted
            </p>
          </div>

          {/* Auto-delete toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label>Auto-delete After Retention Period</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically remove data when retention period expires
                </p>
              </div>
            </div>
            <Switch
              checked={autoDelete}
              onCheckedChange={setAutoDelete}
            />
          </div>

          {/* Delete All Data */}
          <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-destructive">Delete All Organization Data</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete all interviews, reports, and candidate data. This cannot be undone.
                  </p>
                </div>
              </div>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete All
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Delete All Organization Data
                    </DialogTitle>
                    <DialogDescription>
                      This action is irreversible. All interviews, candidate data, reports, and recordings will be permanently deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm">
                      Type <strong className="text-destructive">DELETE ALL</strong> to confirm:
                    </p>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="DELETE ALL"
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAll}
                      disabled={confirmDelete !== "DELETE ALL"}
                    >
                      Delete Everything
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* GDPR Note */}
          <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
            <strong>Data Rights:</strong> We support GDPR, CCPA, and other data protection regulations. 
            Candidates can request data access or deletion via their interview confirmation emails.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
