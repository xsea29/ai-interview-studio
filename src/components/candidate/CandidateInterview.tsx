import { motion } from "framer-motion";
import { Brain, Mic, MicOff, Video, VideoOff, Volume2, Send, PhoneOff, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CandidateInterviewProps {
  currentQuestion: number;
  totalQuestions: number;
  questions: string[];
  isAiSpeaking: boolean;
  isRecording: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleRecording: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onSubmitAnswer: () => void;
  onEndInterview: () => void;
}

export function CandidateInterview({
  currentQuestion, totalQuestions, questions,
  isAiSpeaking, isRecording, isMicOn, isCameraOn,
  onToggleRecording, onToggleMic, onToggleCamera,
  onSubmitAnswer, onEndInterview,
}: CandidateInterviewProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <motion.div
      key="interview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl w-full mx-auto"
    >
      {/* Top bar: progress + recording */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Q{currentQuestion + 1}/{totalQuestions}
          </span>
          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full ai-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap">{Math.round(progress)}%</span>
        </div>
        {isRecording && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 rounded-full border border-destructive/20">
            <Circle className="w-2 h-2 fill-destructive text-destructive animate-pulse" />
            <span className="text-xs text-destructive font-medium">Recording</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
        {/* AI viewport */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="relative aspect-video bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* AI vis */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
              <div className="relative">
                <motion.div
                  animate={isAiSpeaking ? { scale: [1, 1.06, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full ai-gradient flex items-center justify-center ai-glow"
                >
                  <Brain className="h-12 w-12 md:h-14 md:w-14 text-primary-foreground" />
                </motion.div>
                {isAiSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-1"
                  >
                    {[3, 5, 3].map((h, i) => (
                      <div key={i} className={`w-1.5 rounded-full bg-primary animate-pulse`} style={{ height: h * 4, animationDelay: `${i * 75}ms` }} />
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Status pill */}
            <div className="absolute top-3 left-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                isAiSpeaking 
                  ? "bg-primary/15 text-primary border border-primary/20" 
                  : "bg-muted/80 text-muted-foreground border border-border/60"
              }`}>
                <div className={`w-2 h-2 rounded-full ${isAiSpeaking ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                {isAiSpeaking ? "AI Speaking" : "Your Turn"}
              </div>
            </div>

            {/* Question overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 sm:p-6">
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {isAiSpeaking ? (
                  <span className="text-muted-foreground italic">AI is presenting the question...</span>
                ) : (
                  questions[currentQuestion]
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Candidate panel */}
        <div className="order-1 lg:order-2 flex flex-col gap-4">
          {/* Camera preview */}
          <div className="relative aspect-[4/3] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              {isCameraOn ? (
                <Video className="h-8 w-8 text-muted-foreground/50" />
              ) : (
                <VideoOff className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs font-medium border border-border/40">
              You
            </div>
            {isRecording && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-destructive rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
                <span className="text-[10px] text-destructive-foreground font-bold tracking-wide">REC</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={isCameraOn ? "outline" : "destructive"}
              size="icon"
              className="rounded-full h-11 w-11"
              onClick={onToggleCamera}
            >
              {isCameraOn ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
            </Button>
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              className={`rounded-full h-14 w-14 ${!isRecording ? "ai-gradient ai-glow-sm" : ""}`}
              onClick={onToggleRecording}
              disabled={isAiSpeaking || !isMicOn}
            >
              {isRecording || !isMicOn ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            <Button
              variant={isMicOn ? "outline" : "destructive"}
              size="icon"
              className="rounded-full h-11 w-11"
              onClick={onToggleMic}
            >
              {isMicOn ? <Volume2 className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={onSubmitAnswer}
              disabled={!isRecording}
              className="w-full gap-2 ai-gradient h-10 text-sm font-semibold"
            >
              <Send className="h-4 w-4" />
              Submit Answer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-xs"
              onClick={onEndInterview}
            >
              <PhoneOff className="h-3.5 w-3.5 mr-1.5" />
              End Interview
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
