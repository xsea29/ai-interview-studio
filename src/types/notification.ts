import { NotificationType, NotificationSeverity } from "@/lib/notificationConfig";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export interface Notification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  isNew: boolean;
  actions?: NotificationAction[];
  metadata?: {
    candidateId?: string;
    candidateName?: string;
    interviewId?: string;
    score?: number;
    recommendation?: string;
    webhookEndpoint?: string;
    retryCount?: number;
    maxRetries?: number;
    nextRetryAt?: Date;
    payload?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export interface NotificationPreferences {
  interviewCompleted: boolean;
  interviewStarted: boolean;
  interviewFailed: boolean;
  candidateImported: boolean;
  candidateInvited: boolean;
  webhookFailed: boolean;
  creditWarnings: boolean;
  billingChanges: boolean;
  deliveryMethod: "in-app" | "email" | "both";
}

export const defaultNotificationPreferences: NotificationPreferences = {
  interviewCompleted: true,
  interviewStarted: true,
  interviewFailed: true,
  candidateImported: true,
  candidateInvited: false,
  webhookFailed: true,
  creditWarnings: true,
  billingChanges: false,
  deliveryMethod: "in-app",
};
