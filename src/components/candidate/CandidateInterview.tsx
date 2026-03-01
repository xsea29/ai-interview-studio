import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Video, VideoOff, Send, PhoneOff, 
  Circle, ChevronRight, MessageSquare, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

function generateWavePath(width: number, centerY: number, amplitude: number, frequency: number, phase: number): string {
  const points: string[] = [];
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const normalizedX = (i / segments) * Math.PI * 2 * frequency;
    const y = centerY + Math.sin(normalizedX + phase) * amplitude;
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return points.join(" ");
}

interface CandidateInterviewProps {
  currentQuestion: number;
  totalQuestions: number;
  questions: string[];
  isAiSpeaking: boolean;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  onSubmitAnswer: () => void;
  onEndInterview: () => void;
}

export function CandidateInterview({
  currentQuestion, totalQuestions, questions,
  isAiSpeaking, isCameraOn,
  onToggleCamera, onSubmitAnswer, onEndInterview,
}: CandidateInterviewProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const [isRecording, setIsRecording] = useState(false);

  // Auto-manage recording: start when AI stops, stop when AI starts
  useEffect(() => {
    if (!isAiSpeaking) {
      // AI finished speaking → auto-start recording
      const timer = setTimeout(() => setIsRecording(true), 400);
      return () => clearTimeout(timer);
    } else {
      // AI started speaking → stop recording
      setIsRecording(false);
    }
  }, [isAiSpeaking]);

  const handleSubmit = () => {
    setIsRecording(false);
    onSubmitAnswer();
  };

  return (
    <motion.div
      key="interview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl w-full mx-auto flex flex-col h-[calc(100vh-8rem)]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>Question {currentQuestion + 1}</span>
            <span className="text-muted-foreground">of {totalQuestions}</span>
          </div>
        </div>

        <div className="flex-1 max-w-md hidden sm:flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full ai-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground w-8">{Math.round(progress)}%</span>
        </div>

        <div className="flex items-center gap-2">
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 rounded-lg border border-destructive/20"
            >
              <Circle className="w-2 h-2 fill-destructive text-destructive animate-pulse" />
              <span className="text-[11px] text-destructive font-semibold">REC</span>
            </motion.div>
          )}
          <button
            onClick={onEndInterview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors border border-transparent hover:border-destructive/20"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">End</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 grid lg:grid-cols-4 gap-3 min-h-0">
        {/* AI Main View — takes 3 cols */}
        <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
          {/* AI Video area */}
          <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[300px]" style={{ 
            background: '#050507',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}>
            {/* MacBook-style glossy screen reflection */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `linear-gradient(115deg, transparent 0%, transparent 30%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.06) 44%, rgba(255,255,255,0.03) 48%, transparent 55%, transparent 100%)`
            }} />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `linear-gradient(140deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 20%, transparent 45%, transparent 100%)`
            }} />
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent 95%)'
            }} />
            <div className="absolute top-0 left-0 bottom-0 w-[1px]" style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)'
            }} />
            <div className="absolute top-0 right-0 bottom-0 w-[1px]" style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)'
            }} />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.03) 0%, transparent 70%)'
            }} />

            {/* SVG String Wave Visualizer */}
            <div className="absolute inset-0 flex items-end justify-center pb-[5%]">
              <svg
                viewBox="0 0 600 200"
                className="w-[60%] max-w-[360px] h-28 sm:h-36"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="wave-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {[
                  { amp: 30, freq: 1.2, phase: 0, opacity: 0.1, width: 0.5, speed: 2.5 },
                  { amp: 40, freq: 0.8, phase: 1, opacity: 0.15, width: 0.7, speed: 2 },
                  { amp: 25, freq: 1.5, phase: 2.5, opacity: 0.12, width: 0.5, speed: 3 },
                  { amp: 35, freq: 1.0, phase: 0.5, opacity: 0.7, width: 1, speed: 1.8 },
                  { amp: 20, freq: 1.8, phase: 3.5, opacity: 0.18, width: 0.5, speed: 2.2 },
                ].map((wave, wi) => (
                  <motion.path
                    key={wi}
                    fill="none"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={wave.width}
                    strokeLinecap="round"
                    opacity={wave.opacity}
                    filter={wi === 3 ? "url(#wave-glow)" : undefined}
                    animate={{
                      d: isAiSpeaking
                        ? [
                            generateWavePath(600, 100, wave.amp, wave.freq, wave.phase),
                            generateWavePath(600, 100, wave.amp * 0.5, wave.freq, wave.phase + 1.5),
                            generateWavePath(600, 100, wave.amp * 1.1, wave.freq, wave.phase + 3),
                            generateWavePath(600, 100, wave.amp * 0.7, wave.freq, wave.phase + 4.5),
                            generateWavePath(600, 100, wave.amp, wave.freq, wave.phase + 6),
                          ]
                        : generateWavePath(600, 100, 1, wave.freq, wave.phase),
                    }}
                    transition={{
                      repeat: isAiSpeaking ? Infinity : 0,
                      duration: isAiSpeaking ? wave.speed : 1.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </svg>
            </div>

            {/* Subtle label */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
              <motion.span
                animate={{ opacity: isAiSpeaking ? [0.4, 0.8, 0.4] : 0.3 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[11px] font-medium text-white/40 tracking-widest uppercase"
              >
                {isAiSpeaking ? "Speaking" : "Idle"}
              </motion.span>
            </div>

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <motion.div 
                layout
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors duration-300 ${
                  isAiSpeaking
                    ? "bg-primary/20 text-primary border border-primary/25"
                    : "bg-white/10 text-white/90 border border-white/10"
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${isAiSpeaking ? "bg-primary animate-pulse" : "bg-emerald-400"}`} />
                {isAiSpeaking ? "AI is speaking..." : "Your turn to respond"}
              </motion.div>
            </div>

            {/* AI label */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] text-[10px] font-medium text-white/60">
              <Sparkles className="h-3 w-3 text-primary" />
              AI Interviewer
            </div>

            {/* Candidate mini view (PiP) */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/50" style={{ background: '#1a1a1a' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {isCameraOn ? (
                  <div className="flex flex-col items-center gap-1">
                    <Video className="h-5 w-5 text-white/25" />
                    <span className="text-[9px] text-white/30">Camera Preview</span>
                  </div>
                ) : (
                  <VideoOff className="h-5 w-5 text-white/25" />
                )}
              </div>
              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white/80">
                You
              </div>
              {isRecording && (
                <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-destructive flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shrink-0"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{currentQuestion + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {isAiSpeaking ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground italic">AI is reading the question...</span>
                      <motion.div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                            className="w-1 h-1 rounded-full bg-primary"
                          />
                        ))}
                      </motion.div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground">
                      {questions[currentQuestion]}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1 flex lg:flex-col gap-3 order-first lg:order-last">
          <div className="flex-1 bg-card rounded-2xl border border-border/80 p-4 flex flex-col">
            {/* Recording status */}
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Status
            </div>

            {/* Mic status indicator */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <AnimatePresence mode="wait">
                {isAiSpeaking ? (
                  <motion.div
                    key="ai-speaking"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <MicOff className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium text-muted-foreground">Mic Off</div>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">Listening to AI...</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="relative">
                      {isRecording && (
                        <motion.div
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 rounded-full bg-destructive/30"
                        />
                      )}
                      <div className="h-16 w-16 rounded-full bg-destructive/15 flex items-center justify-center border-2 border-destructive/30">
                        <Mic className="h-7 w-7 text-destructive" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-destructive">Recording</div>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">Speak your answer</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Camera toggle */}
            <div className="mb-6">
              <button
                onClick={onToggleCamera}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCameraOn
                    ? "bg-card border-border/80 text-foreground hover:bg-muted/50"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                }`}
              >
                {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                <span className="text-xs font-medium">{isCameraOn ? "Camera On" : "Camera Off"}</span>
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Submit button */}
            <div className="space-y-2 mt-auto">
              <Button
                onClick={handleSubmit}
                disabled={isAiSpeaking}
                className="w-full gap-2 ai-gradient h-11 text-sm font-semibold group"
              >
                <Send className="h-4 w-4" />
                Submit Answer
                <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>

              {/* Question dots */}
              <div className="flex items-center justify-center gap-1 pt-2">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i < currentQuestion
                        ? "w-1.5 h-1.5 bg-primary"
                        : i === currentQuestion
                          ? "w-4 h-1.5 bg-primary rounded-full"
                          : "w-1.5 h-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
