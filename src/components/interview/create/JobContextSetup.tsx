import { motion } from "framer-motion";
import { Brain, Mic, Video, MessageSquare, Plus, X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobContextData } from "@/pages/CreateInterview";
import { useState } from "react";
import { AIExplainability } from "./AIExplainability";
import { CalibrationSlider } from "./CalibrationSlider";
interface JobContextSetupProps {
  data: JobContextData;
  setData: (data: JobContextData) => void;
  onNext: () => void;
  onBack: () => void;
}

const interviewTypes = [
  {
    id: "text" as const,
    icon: MessageSquare,
    title: "AI Text Interview",
    description: "Candidates respond via text chat",
    evaluation: "Writing clarity, technical accuracy, response structure",
  },
  {
    id: "audio" as const,
    icon: Mic,
    title: "AI Audio Interview",
    description: "Candidates respond via voice recording",
    evaluation: "Communication skills, verbal reasoning, confidence",
  },
  {
    id: "video" as const,
    icon: Video,
    title: "AI Video Interview",
    description: "Full video interview with AI",
    evaluation: "Presentation, body language, engagement",
  },
];

const experienceLevels = [
  { value: "junior", label: "Junior (0-2 years)" },
  { value: "mid", label: "Mid-level (2-5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
];

export function JobContextSetup({ data, setData, onNext, onBack }: JobContextSetupProps) {
  const [newSkill, setNewSkill] = useState("");
  const [calibration, setCalibration] = useState(50); // Balanced by default
  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData({ ...data, skills: [...data.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const isValid = data.title.trim() !== "" && data.interviewType;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg sm:rounded-xl bg-card border border-border card-elevated p-4 sm:p-6">
        {/* Info banner */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-accent/50 rounded-lg mb-4 sm:mb-6">
          <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-xs sm:text-sm">AI Context Configuration</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              This helps the AI ask relevant questions.
              <span className="hidden sm:inline"> This is <strong>not</strong> job pipeline management.</span>
            </p>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Job Basics */}
          <section>
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 flex items-center gap-2">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold">
                1
              </span>
              Job Basics
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Job Title *</label>
                <Input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="e.g., Senior Frontend Developer"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Department</label>
                <Input
                  value={data.department}
                  onChange={(e) => setData({ ...data, department: e.target.value })}
                  placeholder="e.g., Engineering"
                  className="text-sm"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Experience Level</label>
                <Select
                  value={data.experienceLevel}
                  onValueChange={(v: "junior" | "mid" | "senior") =>
                    setData({ ...data, experienceLevel: v })
                  }
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Job Description
                <span className="font-normal text-muted-foreground ml-1 hidden sm:inline">
                  (helps AI ask relevant questions)
                </span>
              </label>
              <Textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Describe the role, responsibilities..."
                className="min-h-[100px] sm:min-h-[120px] text-sm"
              />
            </div>
          </section>

          {/* Skills & Focus Areas */}
          <section>
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                2
              </span>
              Skills & Focus Areas
            </h3>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Key Skills
                <span className="font-normal text-muted-foreground ml-1">
                  (AI will evaluate these)
                </span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a skill (e.g., React, System Design)"
                  className="flex-1"
                />
                <Button onClick={addSkill} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {data.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Interview Type */}
          <section>
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 flex items-center gap-2">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold">
                3
              </span>
              Interview Type
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {interviewTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setData({ ...data, interviewType: type.id })}
                  className={`relative p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                    data.interviewType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {data.interviewType === type.id && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-[10px] sm:text-xs">✓</span>
                    </div>
                  )}
                  <type.icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-2 sm:mb-3 ${
                    data.interviewType === type.id ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <h4 className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1">{type.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{type.description}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    <span className="font-medium">AI Evaluates:</span> {type.evaluation}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Interview Rules */}
          <section>
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                4
              </span>
              Interview Rules
              <Sliders className="h-4 w-4 text-muted-foreground ml-1" />
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Number of Questions</label>
                  <span className="text-sm text-primary font-medium">{data.questionCount}</span>
                </div>
                <Slider
                  value={[data.questionCount]}
                  onValueChange={([v]) => setData({ ...data, questionCount: v })}
                  min={3}
                  max={15}
                  step={1}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 6-10 for comprehensive screening
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Time per Question (minutes)</label>
                  <span className="text-sm text-primary font-medium">{data.timePerQuestion}m</span>
                </div>
                <Slider
                  value={[data.timePerQuestion]}
                  onValueChange={([v]) => setData({ ...data, timePerQuestion: v })}
                  min={1}
                  max={10}
                  step={1}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Total duration: ~{data.questionCount * data.timePerQuestion} minutes
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Adaptive Difficulty</div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI adjusts question complexity based on candidate responses
                  </p>
                </div>
                <Switch
                  checked={data.adaptiveDifficulty}
                  onCheckedChange={(v) => setData({ ...data, adaptiveDifficulty: v })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Allow Resume Reference</div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI can reference candidate's resume during interview
                  </p>
                </div>
                <Switch
                  checked={data.allowResumeReference}
                  onCheckedChange={(v) => setData({ ...data, allowResumeReference: v })}
                />
              </div>
            </div>
          </section>

          {/* AI Calibration */}
          <section>
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                5
              </span>
              AI Calibration
            </h3>
            <CalibrationSlider value={calibration} onChange={setCalibration} />
          </section>

          {/* AI Explainability Panel */}
          {(data.title || data.skills.length > 0) && (
            <section>
              <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  6
                </span>
                Why These Questions?
              </h3>
              <AIExplainability data={data} />
            </section>
          )}
        </div>
      </div>
      {/* Navigation */}
      <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="ai-gradient w-full sm:w-auto">
          Preview Interview Setup
        </Button>
      </div>
    </div>
  );
}
