import { Button } from "@/components/ui/button";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { NotificationType } from "@/lib/notificationConfig";
import { Plus, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const demoEvents: Array<{
  type: NotificationType;
  severity: "success" | "info" | "warning" | "error";
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
}> = [
  {
    type: "interview.completed",
    severity: "success",
    title: "Interview Completed",
    description: "Alex Johnson (ATS-042) scored 92%. Recommendation: Strong Hire",
    metadata: { candidateName: "Alex Johnson", candidateId: "ATS-042", score: 92, recommendation: "Strong Hire" },
  },
  {
    type: "candidate.imported",
    severity: "info",
    title: "Candidate Imported",
    description: "3 new candidates from CSV batch. Ready to create interviews.",
    metadata: { count: 3, source: "CSV" },
  },
  {
    type: "webhook.failed",
    severity: "warning",
    title: "Webhook Delivery Failed",
    description: "/webhooks/greenhouse endpoint - Retry 2 of 5",
    metadata: { webhookEndpoint: "/webhooks/greenhouse", retryCount: 2, maxRetries: 5 },
  },
  {
    type: "interview.failed",
    severity: "error",
    title: "Interview Failed",
    description: "Browser crash detected during video recording",
    metadata: { candidateName: "Sam Wilson", interviewId: "int_999" },
  },
  {
    type: "report.generated",
    severity: "success",
    title: "Report Generated",
    description: "Full evaluation report for Maria Chen is ready",
    metadata: { candidateName: "Maria Chen", interviewId: "int_500" },
  },
  {
    type: "ats.synced",
    severity: "success",
    title: "ATS Synced",
    description: "Successfully synced 15 candidates with Greenhouse",
    metadata: { atsProvider: "Greenhouse", syncedCount: 15 },
  },
];

export function NotificationDemo() {
  const { addNotification } = useNotificationContext();

  const triggerRandomNotification = () => {
    const event = demoEvents[Math.floor(Math.random() * demoEvents.length)];
    addNotification(event.type, event.title, event.description, event.severity, event.metadata);
  };

  const triggerSpecificNotification = (index: number) => {
    const event = demoEvents[index];
    addNotification(event.type, event.title, event.description, event.severity, event.metadata);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Demo Events
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Trigger Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={triggerRandomNotification}>
          <Plus className="h-4 w-4 mr-2" />
          Random Event
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {demoEvents.map((event, index) => (
          <DropdownMenuItem 
            key={event.type + index}
            onClick={() => triggerSpecificNotification(index)}
            className="text-sm"
          >
            <span className={
              event.severity === "success" ? "text-emerald-500" :
              event.severity === "info" ? "text-blue-500" :
              event.severity === "warning" ? "text-amber-500" :
              "text-red-500"
            }>●</span>
            <span className="ml-2">{event.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
