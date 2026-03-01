import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Video, Wifi, CheckCircle, ArrowRight, Loader2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckStatus = "checking" | "granted" | "denied" | "error";

interface EnvironmentState {
  mic: CheckStatus;
  camera: CheckStatus;
  network: CheckStatus;
}

interface CandidateChecklistProps {
  onStart: () => void;
  onNetworkReady?: (strength: "strong" | "moderate" | "weak") => void;
}

export function CandidateChecklist({ onStart, onNetworkReady }: CandidateChecklistProps) {
  const [env, setEnv] = useState<EnvironmentState>({
    mic: "checking",
    camera: "checking",
    network: "checking",
  });
  const [networkSpeed, setNetworkSpeed] = useState<"strong" | "moderate" | "weak">("strong");

  const checkMic = useCallback(async () => {
    setEnv(prev => ({ ...prev, mic: "checking" }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setEnv(prev => ({ ...prev, mic: "granted" }));
    } catch {
      setEnv(prev => ({ ...prev, mic: "denied" }));
    }
  }, []);

  const checkCamera = useCallback(async () => {
    setEnv(prev => ({ ...prev, camera: "checking" }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setEnv(prev => ({ ...prev, camera: "granted" }));
    } catch {
      setEnv(prev => ({ ...prev, camera: "denied" }));
    }
  }, []);

  const checkNetwork = useCallback(async () => {
    setEnv(prev => ({ ...prev, network: "checking" }));
    try {
      const start = performance.now();
      await fetch(`${window.location.origin}/favicon.ico?_=${Date.now()}`, { cache: "no-store" });
      const latency = performance.now() - start;
      const strength: "strong" | "moderate" | "weak" = latency < 200 ? "strong" : latency < 500 ? "moderate" : "weak";
      setNetworkSpeed(strength);
      onNetworkReady?.(strength);
      setEnv(prev => ({ ...prev, network: "granted" }));
    } catch {
      setNetworkSpeed("weak");
      setEnv(prev => ({ ...prev, network: "error" }));
    }
  }, [onNetworkReady]);

  useEffect(() => {
    // Run all checks in parallel on mount
    checkMic();
    checkCamera();
    checkNetwork();
  }, [checkMic, checkCamera, checkNetwork]);

  const allReady = env.mic === "granted" && env.camera === "granted" && env.network === "granted";
  const hasError = env.mic === "denied" || env.camera === "denied" || env.network === "error";

  const items = [
    {
      key: "camera" as const,
      icon: Video,
      title: "Camera",
      status: env.camera,
      successMsg: "Camera access granted",
      errorMsg: "Camera access denied — please allow in browser settings",
      onRetry: checkCamera,
    },
    {
      key: "mic" as const,
      icon: Mic,
      title: "Microphone",
      status: env.mic,
      successMsg: "Microphone access granted",
      errorMsg: "Microphone access denied — please allow in browser settings",
      onRetry: checkMic,
    },
    {
      key: "network" as const,
      icon: Wifi,
      title: "Network",
      status: env.network,
      successMsg: `Connection ${networkSpeed} (${networkSpeed === "strong" ? "Excellent" : networkSpeed === "moderate" ? "Acceptable" : "Weak"})`,
      errorMsg: "Unable to verify network — check your connection",
      onRetry: checkNetwork,
    },
  ];

  return (
    <motion.div
      key="checklist"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg w-full mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5">
          Setting Up Your Environment
        </h2>
        <p className="text-sm text-muted-foreground">
          We're automatically checking your devices and connection
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, i) => {
          const isChecking = item.status === "checking";
          const isOk = item.status === "granted";
          const isBad = item.status === "denied" || item.status === "error";

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                isOk
                  ? "border-primary/40 bg-primary/5"
                  : isBad
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border bg-card"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors ${
                isOk ? "bg-primary text-primary-foreground" : isBad ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.title}</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isChecking ? "Detecting..." : isOk ? item.successMsg : item.errorMsg}
                </p>
              </div>
              <div className="shrink-0">
                {isChecking && (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                )}
                {isOk && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
                {isBad && (
                  <button onClick={item.onRetry} className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors">
                    <RefreshCw className="h-4 w-4" />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Auto-proceed hint or button */}
      {allReady ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={onStart}
            size="lg"
            className="ai-gradient w-full h-12 text-sm font-semibold gap-2 group"
          >
            All Set — Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </motion.div>
      ) : hasError ? (
        <p className="text-center text-sm text-muted-foreground">
          Please resolve the issues above to continue
        </p>
      ) : (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Running checks...
        </div>
      )}
    </motion.div>
  );
}
