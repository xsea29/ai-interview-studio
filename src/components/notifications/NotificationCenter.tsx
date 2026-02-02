import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCheck, Trash2, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { notificationEventConfigs, severityStyles, getTimeAgo } from "@/lib/notificationConfig";
import { useNavigate } from "react-router-dom";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  actionRequiredCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onViewDetails: (notification: Notification) => void;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  actionRequiredCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll,
  onViewDetails,
}: NotificationCenterProps) {
  const navigate = useNavigate();

  const handleAction = (notification: Notification, route?: string) => {
    onMarkAsRead(notification.id);
    if (route) {
      navigate(route);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop (mobile only) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed right-0 top-0 z-40 h-full w-full md:w-[380px]",
              "bg-background border-l border-border shadow-xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Notifications</h2>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {unreadCount > 0 ? (
                    <>
                      {unreadCount} new event{unreadCount !== 1 ? "s" : ""}
                      {actionRequiredCount > 0 && (
                        <> • {actionRequiredCount} require action</>
                      )}
                    </>
                  ) : (
                    "All caught up!"
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mark all as read button */}
            {unreadCount > 0 && (
              <div className="px-4 py-2 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </div>
            )}

            {/* Notification List */}
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="p-2">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">
                      No notifications yet
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      You'll see real-time updates here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={() => onMarkAsRead(notification.id)}
                        onDismiss={() => onDismiss(notification.id)}
                        onAction={(route) => handleAction(notification, route)}
                        onViewDetails={() => onViewDetails(notification)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate("/settings");
                      onClose();
                    }}
                    className="text-muted-foreground"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDismiss: () => void;
  onAction: (route?: string) => void;
  onViewDetails: () => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss,
  onAction,
  onViewDetails,
}: NotificationItemProps) {
  const config = notificationEventConfigs[notification.type];
  const styles = severityStyles[notification.severity];
  const Icon = config?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={cn(
        "relative p-3 rounded-lg transition-colors cursor-pointer group",
        "hover:bg-muted/50",
        !notification.isRead && "bg-primary/5"
      )}
      onClick={onViewDetails}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          styles.iconBg
        )}>
          {Icon && <Icon className={cn("h-4 w-4", styles.iconColor)} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              "text-sm font-semibold line-clamp-1",
              !notification.isRead && "text-foreground"
            )}>
              {notification.title}
            </p>
            
            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {notification.isNew && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-primary text-primary-foreground">
                  NEW
                </span>
              )}
              {(notification.severity === "warning" || notification.severity === "error") && !notification.isRead && (
                <span className={cn(
                  "px-1.5 py-0.5 text-[10px] font-semibold rounded text-white",
                  notification.severity === "warning" ? "bg-amber-500" : "bg-red-500"
                )}>
                  !
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {notification.description}
          </p>
          
          <p className="text-xs text-muted-foreground/70 mt-1">
            {getTimeAgo(notification.timestamp)}
          </p>

          {/* Actions - visible on hover */}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {config?.defaultAction && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(config.defaultAction?.route);
                }}
              >
                {config.defaultAction.label}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
            >
              Details
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
