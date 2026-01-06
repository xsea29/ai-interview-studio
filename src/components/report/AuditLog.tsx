import { motion } from "framer-motion";
import { Clock, User, Send, Edit, CheckCircle, Eye, Share2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuditEntry {
  id: string;
  action: "created" | "sent" | "modified" | "viewed" | "decided" | "shared" | "exported";
  actor: string;
  actorEmail: string;
  timestamp: string;
  details?: string;
}

interface AuditLogProps {
  entries: AuditEntry[];
  interviewId?: string;
}

export function AuditLog({ entries, interviewId }: AuditLogProps) {
  const actionConfig = {
    created: {
      icon: Clock,
      label: "Interview Created",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    sent: {
      icon: Send,
      label: "Interview Sent",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    modified: {
      icon: Edit,
      label: "Interview Modified",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    viewed: {
      icon: Eye,
      label: "Report Viewed",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    decided: {
      icon: CheckCircle,
      label: "Decision Made",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    shared: {
      icon: Share2,
      label: "Report Shared",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    exported: {
      icon: Download,
      label: "Report Exported",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
            
            <div className="space-y-4">
              {entries.map((entry, index) => {
                const config = actionConfig[entry.action];
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 relative"
                  >
                    {/* Icon */}
                    <div className={`h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center shrink-0 z-10`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{config.label}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {entry.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {entry.actor}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({entry.actorEmail})
                        </span>
                      </div>
                      {entry.details && (
                        <p className="text-xs text-muted-foreground mt-1 bg-muted/30 px-2 py-1 rounded">
                          {entry.details}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
