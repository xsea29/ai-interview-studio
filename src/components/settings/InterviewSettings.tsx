import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Brain, FileText, RotateCcw, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export function InterviewSettings() {
  const [interviewType, setInterviewType] = useState("video");
  const [questions, setQuestions] = useState([8]);
  const [duration, setDuration] = useState([3]);
  const [maxAttempts, setMaxAttempts] = useState([2]);
  const [accessWindow, setAccessWindow] = useState([72]);
  const [allowResume, setAllowResume] = useState(true);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  const [followUps, setFollowUps] = useState(true);
  const [difficulty, setDifficulty] = useState("medium");
  const [conversationalStyle, setConversationalStyle] = useState("professional");
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-6">
      {/* Default Interview Rules */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Default Interview Rules</CardTitle>
                <CardDescription>Applied to all new interviews unless overridden per interview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Interview Type</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">AI Text Interview</SelectItem>
                    <SelectItem value="audio">AI Audio Interview</SelectItem>
                    <SelectItem value="video">AI Video Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Default Number of Questions</Label>
                <span className="font-medium tabular-nums">{questions[0]} questions</span>
              </div>
              <Slider value={questions} onValueChange={setQuestions} min={3} max={15} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>3</span><span>15</span></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Default Time per Question</Label>
                <span className="font-medium tabular-nums">{duration[0]} min</span>
              </div>
              <Slider value={duration} onValueChange={setDuration} min={1} max={5} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>1 min</span><span>5 min</span></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" />Max Retry Attempts
                </Label>
                <span className="font-medium tabular-nums">{maxAttempts[0] === 1 ? "1 attempt" : `${maxAttempts[0]} attempts`}</span>
              </div>
              <Slider value={maxAttempts} onValueChange={setMaxAttempts} min={1} max={5} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>1 (no retry)</span><span>5 attempts</span></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />Candidate Access Window
                </Label>
                <span className="font-medium tabular-nums">{accessWindow[0]}h to complete</span>
              </div>
              <Slider value={accessWindow} onValueChange={setAccessWindow} min={24} max={168} step={24} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>24h</span><span>7 days</span></div>
              <p className="text-xs text-muted-foreground">How long the candidate has to start and complete their interview after receiving the link</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Allow Resume Upload</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Candidates can optionally attach a resume before starting</p>
              </div>
              <Switch checked={allowResume} onCheckedChange={setAllowResume} />
            </div>

            <Button onClick={() => toast.success("Interview defaults saved")}>Save Interview Defaults</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Behavior */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Behavior</CardTitle>
                <CardDescription>Configure how the AI interviewer interacts with candidates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Adaptive Difficulty</Label>
                <p className="text-xs text-muted-foreground mt-0.5">AI adjusts question complexity based on candidate responses</p>
              </div>
              <Switch checked={adaptiveDifficulty} onCheckedChange={setAdaptiveDifficulty} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>AI Follow-up Questions</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Allow the AI to ask clarifying or deeper follow-up questions</p>
              </div>
              <Switch checked={followUps} onCheckedChange={setFollowUps} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy — Entry level, junior roles</SelectItem>
                    <SelectItem value="medium">Medium — Mid-level, most roles</SelectItem>
                    <SelectItem value="hard">Hard — Senior, leadership roles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Conversational Style</Label>
                <Select value={conversationalStyle} onValueChange={setConversationalStyle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal — Structured, traditional</SelectItem>
                    <SelectItem value="professional">Professional — Balanced, neutral</SelectItem>
                    <SelectItem value="friendly">Friendly — Warm, conversational</SelectItem>
                    <SelectItem value="casual">Casual — Relaxed, startup-style</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => toast.success("AI behavior settings saved")}>Save AI Settings</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
