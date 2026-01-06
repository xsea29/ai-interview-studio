import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Copy, Check, Clock, Eye, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareableReportProps {
  candidateId: string;
  candidateName: string;
}

export function ShareableReport({ candidateId, candidateName }: ShareableReportProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [settings, setSettings] = useState({
    expiry: "7days",
    hidePersonalInfo: false,
    hideDetailedScores: false,
  });

  // Generate a mock shareable link
  const shareableLink = `https://app.aiinterviewer.com/share/${candidateId}?token=shr_${Math.random().toString(36).substring(7)}`;

  const handleGenerateLink = () => {
    setLinkGenerated(true);
    toast.success("Shareable link generated!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const expiryOptions = [
    { value: "24hours", label: "24 hours" },
    { value: "7days", label: "7 days" },
    { value: "30days", label: "30 days" },
    { value: "never", label: "Never expires" },
  ];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link2 className="h-4 w-4" />
          Share Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Share Evaluation Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <p className="text-sm text-muted-foreground">
            Create a view-only link to share {candidateName}'s evaluation with hiring managers or clients.
          </p>

          {/* Link Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Link Expiry</span>
              </div>
              <Select
                value={settings.expiry}
                onValueChange={(v) => setSettings({ ...settings, expiry: v })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expiryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Hide Personal Info</span>
                  <p className="text-xs text-muted-foreground">Email, phone hidden</p>
                </div>
              </div>
              <Switch
                checked={settings.hidePersonalInfo}
                onCheckedChange={(v) => setSettings({ ...settings, hidePersonalInfo: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Hide Detailed Scores</span>
                  <p className="text-xs text-muted-foreground">Show summary only</p>
                </div>
              </div>
              <Switch
                checked={settings.hideDetailedScores}
                onCheckedChange={(v) => setSettings({ ...settings, hideDetailedScores: v })}
              />
            </div>
          </div>

          {/* Generated Link */}
          {linkGenerated ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <Input
                  value={shareableLink}
                  readOnly
                  className="text-xs font-mono bg-muted"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                <Eye className="h-4 w-4 text-success" />
                <div className="text-xs">
                  <span className="font-medium">View-only access</span>
                  <span className="text-muted-foreground"> — Recipients cannot edit or download raw data</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <Button onClick={handleGenerateLink} className="w-full ai-gradient gap-2">
              <Link2 className="h-4 w-4" />
              Generate Shareable Link
            </Button>
          )}

          {/* Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Perfect for:</strong> Sharing with founders, hiring managers, or clients who don't have platform access.
              No login required to view.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
