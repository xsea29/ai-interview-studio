import { useState, useCallback, useEffect } from "react";
import { Notification, NotificationPreferences, defaultNotificationPreferences } from "@/types/notification";
import { NotificationType } from "@/lib/notificationConfig";

const STORAGE_KEY = "notifications";
const PREFERENCES_KEY = "notification_preferences";

// Generate unique ID
function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Sample notifications for demonstration
function generateSampleNotifications(): Notification[] {
  const now = new Date();
  return [
    {
      id: generateId(),
      type: "interview.completed",
      severity: "success",
      title: "Interview Completed",
      description: "John Smith (ATS-001) scored 87%. Recommendation: Strong Hire",
      timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 min ago
      isRead: false,
      isNew: true,
      metadata: {
        candidateId: "cand_001",
        candidateName: "John Smith",
        interviewId: "int_456",
        score: 87,
        recommendation: "Strong Hire",
      },
    },
    {
      id: generateId(),
      type: "candidate.imported",
      severity: "info",
      title: "Candidate Imported",
      description: "1 new candidate from CSV batch. Ready to create interviews.",
      timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 min ago
      isRead: false,
      isNew: true,
      metadata: {
        candidateId: "cand_002",
        candidateName: "Sarah Connor",
      },
    },
    {
      id: generateId(),
      type: "webhook.failed",
      severity: "warning",
      title: "Webhook Delivery Failed",
      description: "/webhooks/ats-sync endpoint - Retry 3 of 5",
      timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 min ago
      isRead: false,
      isNew: true,
      metadata: {
        webhookEndpoint: "/webhooks/ats-sync",
        retryCount: 3,
        maxRetries: 5,
        nextRetryAt: new Date(now.getTime() + 15 * 60 * 1000),
      },
    },
    {
      id: generateId(),
      type: "interview.failed",
      severity: "error",
      title: "Interview Failed",
      description: "Network timeout - candidate connection lost during assessment",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
      isRead: true,
      isNew: false,
      metadata: {
        candidateId: "cand_003",
        candidateName: "Mike Johnson",
        interviewId: "int_789",
      },
    },
    {
      id: generateId(),
      type: "report.generated",
      severity: "success",
      title: "Report Generated",
      description: "Evaluation report for Emily Chen is ready to download",
      timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      isRead: true,
      isNew: false,
      metadata: {
        candidateId: "cand_004",
        candidateName: "Emily Chen",
        interviewId: "int_101",
      },
    },
  ];
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: Notification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
          metadata: n.metadata ? {
            ...n.metadata,
            nextRetryAt: n.metadata.nextRetryAt ? new Date(n.metadata.nextRetryAt) : undefined,
          } : undefined,
        })));
      } catch {
        // Initialize with sample data if parsing fails
        setNotifications(generateSampleNotifications());
      }
    } else {
      // Initialize with sample data
      setNotifications(generateSampleNotifications());
    }

    if (storedPrefs) {
      try {
        setPreferences(JSON.parse(storedPrefs));
      } catch {
        setPreferences(defaultNotificationPreferences);
      }
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => 
    !n.isRead && (n.severity === "warning" || n.severity === "error")
  ).length;

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    description: string,
    severity: Notification["severity"],
    metadata?: Notification["metadata"]
  ) => {
    const newNotification: Notification = {
      id: generateId(),
      type,
      severity,
      title,
      description,
      timestamp: new Date(),
      isRead: false,
      isNew: true,
      metadata,
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true, isNew: false } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true, isNew: false }))
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  const openCenter = useCallback(() => setIsOpen(true), []);
  const closeCenter = useCallback(() => setIsOpen(false), []);
  const toggleCenter = useCallback(() => setIsOpen(prev => !prev), []);

  const openNotificationDetail = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  }, [markAsRead]);

  const closeNotificationDetail = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  return {
    notifications,
    unreadCount,
    actionRequiredCount,
    preferences,
    isOpen,
    selectedNotification,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    updatePreferences,
    openCenter,
    closeCenter,
    toggleCenter,
    openNotificationDetail,
    closeNotificationDetail,
  };
}
