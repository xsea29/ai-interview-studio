import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, AlertTriangle, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { severityStyles, notificationEventConfigs } from "@/lib/notificationConfig";

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  onAction?: (action: string) => void;
  duration?: number;
}

export function NotificationToast({
  notification,
  onDismiss,
  onAction,
  duration = 6000,
}: NotificationToastProps) {
  const config = notificationEventConfigs[notification.type];
  const styles = severityStyles[notification.severity];
  const Icon = config?.icon || CheckCircle;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative w-[350px] max-h-[200px] overflow-hidden rounded-lg border shadow-lg",
        "bg-gradient-to-r",
        styles.gradient,
        styles.border
      )}
      onMouseEnter={(e) => {
        // Pause auto-dismiss on hover (would need more complex state)
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-white/90 line-clamp-2">
              {notification.description}
            </p>
            
            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2">
              {config?.defaultAction && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs font-medium text-white hover:bg-white/20"
                  onClick={() => onAction?.(config.defaultAction!.route)}
                >
                  {config.defaultAction.label}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-medium text-white/80 hover:bg-white/20 hover:text-white"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 rounded-md p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
      />
    </motion.div>
  );
}

interface NotificationToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onAction?: (notificationId: string, action: string) => void;
}

export function NotificationToastContainer({
  notifications,
  onDismiss,
  onAction,
}: NotificationToastContainerProps) {
  // Only show the 3 most recent notifications as toasts
  const visibleToasts = notifications.filter(n => n.isNew).slice(0, 3);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={() => onDismiss(notification.id)}
            onAction={(action) => onAction?.(notification.id, action)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
