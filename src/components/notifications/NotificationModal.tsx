import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { notificationEventConfigs, severityStyles } from "@/lib/notificationConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({
  notification,
  isOpen,
  onClose,
}: NotificationModalProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!notification) return null;

  const config = notificationEventConfigs[notification.type];
  const styles = severityStyles[notification.severity];
  const Icon = config?.icon;

  const handleCopyPayload = () => {
    const payload = {
      event: notification.type,
      id: notification.id,
      timestamp: notification.timestamp.toISOString(),
      ...notification.metadata,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    toast.success("Payload copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = () => {
    if (config?.defaultAction?.route) {
      navigate(config.defaultAction.route);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const payload = {
    event: notification.type,
    notification_id: notification.id,
    timestamp: notification.timestamp.toISOString(),
    data: notification.metadata || {},
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                styles.iconBg
              )}>
                <Icon className={cn("h-5 w-5", styles.iconColor)} />
              </div>
            )}
            <DialogTitle className="text-lg">{notification.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event details */}
          <div className="space-y-3">
            <DetailRow label="Event Type" value={notification.type} mono />
            <DetailRow label="Time" value={formatDate(notification.timestamp)} />
            
            {notification.metadata?.candidateName && (
              <DetailRow 
                label="Candidate" 
                value={`${notification.metadata.candidateName}${notification.metadata.candidateId ? ` (${notification.metadata.candidateId})` : ''}`}
              />
            )}
            
            {notification.metadata?.score !== undefined && (
              <DetailRow label="Score" value={`${notification.metadata.score}%`} />
            )}
            
            {notification.metadata?.recommendation && (
              <DetailRow label="Recommendation" value={notification.metadata.recommendation} />
            )}
            
            {notification.metadata?.interviewId && (
              <DetailRow label="Interview ID" value={notification.metadata.interviewId} mono />
            )}

            {notification.metadata?.webhookEndpoint && (
              <DetailRow label="Endpoint" value={notification.metadata.webhookEndpoint} mono />
            )}

            {notification.metadata?.retryCount !== undefined && (
              <DetailRow 
                label="Retry Status" 
                value={`${notification.metadata.retryCount} of ${notification.metadata.maxRetries || 5}`}
              />
            )}

            <DetailRow 
              label="Status" 
              value={
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Delivered
                </span>
              }
            />
          </div>

          <Separator />

          {/* Full Payload */}
          <div>
            <p className="text-sm font-medium mb-2">Full Payload (JSON)</p>
            <ScrollArea className="h-[150px] rounded-lg border bg-muted/30">
              <pre className="p-3 text-xs font-mono text-muted-foreground">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPayload}
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Payload
                </>
              )}
            </Button>
            
            {config?.defaultAction && (
              <Button
                variant="default"
                size="sm"
                onClick={handleAction}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {config.defaultAction.label}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

function DetailRow({ label, value, mono }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground flex-shrink-0">{label}:</span>
      <span className={cn(
        "text-sm text-right",
        mono && "font-mono text-xs"
      )}>
        {value}
      </span>
    </div>
  );
}
