import { CheckCircle, XCircle, Users, AlertTriangle, FileText, RefreshCw, CreditCard, Mail, Zap } from "lucide-react";

export type NotificationType = 
  | "interview.completed"
  | "interview.started"
  | "interview.failed"
  | "candidate.imported"
  | "candidate.invited"
  | "report.generated"
  | "webhook.failed"
  | "webhook.delivered"
  | "credit.warning"
  | "billing.changed"
  | "ats.synced";

export type NotificationSeverity = "success" | "info" | "warning" | "error";

export interface NotificationEventConfig {
  type: NotificationType;
  severity: NotificationSeverity;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  defaultAction?: {
    label: string;
    route: string;
  };
}

export const notificationEventConfigs: Record<NotificationType, NotificationEventConfig> = {
  "interview.completed": {
    type: "interview.completed",
    severity: "success",
    icon: CheckCircle,
    title: "Interview Completed",
    defaultAction: { label: "View Report", route: "/interviews" },
  },
  "interview.started": {
    type: "interview.started",
    severity: "info",
    icon: Zap,
    title: "Interview Started",
    defaultAction: { label: "Monitor", route: "/interviews/monitoring" },
  },
  "interview.failed": {
    type: "interview.failed",
    severity: "error",
    icon: XCircle,
    title: "Interview Failed",
    defaultAction: { label: "View Details", route: "/interviews" },
  },
  "candidate.imported": {
    type: "candidate.imported",
    severity: "info",
    icon: Users,
    title: "Candidate Imported",
    defaultAction: { label: "View Candidate", route: "/interviews/candidates" },
  },
  "candidate.invited": {
    type: "candidate.invited",
    severity: "info",
    icon: Mail,
    title: "Candidate Invited",
    defaultAction: { label: "View", route: "/interviews/candidates" },
  },
  "report.generated": {
    type: "report.generated",
    severity: "success",
    icon: FileText,
    title: "Report Generated",
    defaultAction: { label: "Download", route: "/interviews" },
  },
  "webhook.failed": {
    type: "webhook.failed",
    severity: "warning",
    icon: AlertTriangle,
    title: "Webhook Delivery Failed",
    defaultAction: { label: "View Logs", route: "/settings" },
  },
  "webhook.delivered": {
    type: "webhook.delivered",
    severity: "success",
    icon: CheckCircle,
    title: "Webhook Delivered",
  },
  "credit.warning": {
    type: "credit.warning",
    severity: "warning",
    icon: CreditCard,
    title: "Credit Warning",
    defaultAction: { label: "View Billing", route: "/settings" },
  },
  "billing.changed": {
    type: "billing.changed",
    severity: "info",
    icon: CreditCard,
    title: "Billing Updated",
    defaultAction: { label: "View Details", route: "/settings" },
  },
  "ats.synced": {
    type: "ats.synced",
    severity: "success",
    icon: RefreshCw,
    title: "ATS Synced",
    defaultAction: { label: "View", route: "/integrations" },
  },
};

export const severityStyles: Record<NotificationSeverity, {
  gradient: string;
  border: string;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
}> = {
  success: {
    gradient: "from-emerald-500 to-emerald-600",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-500",
    badgeColor: "bg-emerald-500",
  },
  info: {
    gradient: "from-blue-500 to-blue-600",
    border: "border-blue-500/40",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-500",
    badgeColor: "bg-blue-500",
  },
  warning: {
    gradient: "from-amber-500 to-amber-600",
    border: "border-amber-500/40",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    badgeColor: "bg-amber-500",
  },
  error: {
    gradient: "from-red-500 to-red-600",
    border: "border-red-500/40",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
    badgeColor: "bg-red-500",
  },
};

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
