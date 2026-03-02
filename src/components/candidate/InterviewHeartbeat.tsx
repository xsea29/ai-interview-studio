import { useEffect, useRef, useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { WifiOff, ShieldAlert, AlertTriangle } from "lucide-react";

type HeartbeatError = "connection_lost" | "retry_limit" | "abuse_detected" | null;

interface InterviewHeartbeatProps {
  interviewId: string;
  sessionId: string;
  active: boolean;
  attemptsRemaining?: number;
  onSessionEnd: () => void;
}

export function InterviewHeartbeat({
  interviewId,
  sessionId,
  active,
  attemptsRemaining = 2,
  onSessionEnd,
}: InterviewHeartbeatProps) {
  const [error, setError] = useState<HeartbeatError>(null);
  const [missedBeats, setMissedBeats] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_MISSED = 3; // After 3 missed heartbeats, show connection lost
  const HEARTBEAT_INTERVAL = 60_000; // 60 seconds

  const sendHeartbeat = useCallback(async () => {
    try {
      // Simulated heartbeat — in production this would be a real API call
      // const response = await fetch(
      //   `/api/v1/interviews/public/token/${interviewId}/heartbeat`,
      //   { method: 'POST', body: JSON.stringify({ sessionId }) }
      // );

      // Simulate: random failure for demo (remove in production)
      const random = Math.random();
      if (random < 0.03) {
        // Simulate 410 — interview rescheduled
        setError("connection_lost");
        return;
      }
      if (random < 0.02) {
        // Simulate 403 — session conflict / abuse
        setError("abuse_detected");
        return;
      }

      // Success — reset missed count
      setMissedBeats(0);
    } catch {
      setMissedBeats((prev) => {
        const next = prev + 1;
        if (next >= MAX_MISSED) {
          if (attemptsRemaining <= 0) {
            setError("retry_limit");
          } else {
            setError("connection_lost");
          }
        }
        return next;
      });
    }
  }, [interviewId, sessionId, attemptsRemaining]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, sendHeartbeat]);

  const handleDismiss = () => {
    setError(null);
    onSessionEnd();
  };

  const dialogConfig = {
    connection_lost: {
      icon: <WifiOff className="h-6 w-6 text-warning" />,
      title: "Connection Lost",
      description: `Your interview connection was lost. We've automatically rescheduled your interview.\n\nCheck your email for a new link. You have ${attemptsRemaining} more attempt${attemptsRemaining !== 1 ? "s" : ""}.`,
      iconBg: "bg-warning/10 border-warning/20",
    },
    retry_limit: {
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
      title: "Interview Rescheduling Limit",
      description:
        "Your session ended unexpectedly multiple times. We've paused auto-rescheduling to investigate.\n\nA recruiter will contact you soon.",
      iconBg: "bg-destructive/10 border-destructive/20",
    },
    abuse_detected: {
      icon: <ShieldAlert className="h-6 w-6 text-destructive" />,
      title: "Interview Verification Required",
      description:
        "Your account needs verification before we can reschedule again.\n\nSupport team will contact you.",
      iconBg: "bg-destructive/10 border-destructive/20",
    },
  };

  const config = error ? dialogConfig[error] : null;

  return (
    <AlertDialog open={!!error}>
      <AlertDialogContent className="max-w-sm">
        {config && (
          <>
            <AlertDialogHeader className="items-center text-center sm:text-center">
              <div className={`mx-auto h-14 w-14 rounded-2xl border flex items-center justify-center mb-2 ${config.iconBg}`}>
                {config.icon}
              </div>
              <AlertDialogTitle>{config.title}</AlertDialogTitle>
              <AlertDialogDescription className="whitespace-pre-line text-sm leading-relaxed">
                {config.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction onClick={handleDismiss} className="min-w-[120px]">
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
