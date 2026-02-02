import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  className?: string;
}

export function NotificationBell({
  unreadCount,
  onClick,
  className,
}: NotificationBellProps) {
  const hasNotifications = unreadCount > 0;
  const displayCount = unreadCount > 9 ? "9+" : unreadCount.toString();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "relative h-8 w-8 sm:h-9 sm:w-9 transition-colors",
        hasNotifications ? "text-primary" : "text-muted-foreground",
        className
      )}
      title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Bell className={cn(
          "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
          hasNotifications && "text-primary"
        )} />
        
        {/* Notification badge */}
        <AnimatePresence>
          {hasNotifications && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "absolute -top-1.5 -right-1.5 flex items-center justify-center",
                "min-w-[18px] h-[18px] px-1 rounded-full",
                "bg-destructive text-destructive-foreground",
                "text-[10px] font-semibold"
              )}
            >
              {displayCount}
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Pulse animation for new notifications */}
        {hasNotifications && (
          <motion.span
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-destructive"
          />
        )}
      </motion.div>
    </Button>
  );
}
