import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, Plus, X, GripVertical, MessageSquare, 
  ChevronDown, ChevronUp, Loader2, RefreshCw, Lightbulb,
  Code, Users, Target, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobContextData } from "@/pages/CreateInterview";

export interface InterviewQuestion {
  id: string;
  text: string;
  type: "technical" | "behavioral" | "situational";
  difficulty: "easy" | "medium" | "hard";
  followUps: string[];
  evaluates: string[];
  aiGenerated: boolean;
}

interface QuestionGenerationProps {
  jobContext: JobContextData;
  questions: InterviewQuestion[];
  setQuestions: (questions: InterviewQuestion[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const questionTypeConfig = {
  technical: { icon: Code, label: "Technical", color: "text-blue-500 bg-blue-500/10" },
  behavioral: { icon: Users, label: "Behavioral", color: "text-green-500 bg-green-500/10" },
  situational: { icon: Target, label: "Situational", color: "text-purple-500 bg-purple-500/10" },
};

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-success/20 text-success" },
  medium: { label: "Medium", color: "bg-warning/20 text-warning" },
  hard: { label: "Hard", color: "bg-destructive/20 text-destructive" },
};

// Generate questions based on job context (mock AI generation)
function generateQuestionsFromContext(jobContext: JobContextData): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  const { title, skills, experienceLevel, description } = jobContext;
  
  // Technical questions based on skills
  skills.slice(0, 3).forEach((skill, index) => {
    questions.push({
      id: `tech-${index}-${Date.now()}`,
      text: `Can you describe a complex project where you utilized ${skill}? What challenges did you face and how did you overcome them?`,
      type: "technical",
      difficulty: experienceLevel === "senior" ? "hard" : experienceLevel === "mid" ? "medium" : "easy",
      followUps: [
        `What specific ${skill} features or patterns did you use?`,
        "How did you measure the success of your implementation?",
        "If you could redo this project, what would you do differently?",
      ],
      evaluates: [skill, "Problem Solving", "Technical Depth"],
      aiGenerated: true,
    });
  });

  // Behavioral questions
  const behavioralTemplates = [
    {
      text: "Tell me about a time when you had to work under a tight deadline. How did you prioritize your tasks?",
      evaluates: ["Time Management", "Prioritization", "Stress Management"],
      followUps: [
        "What was the outcome?",
        "How did you communicate progress to stakeholders?",
        "What would you do differently next time?",
      ],
    },
    {
      text: "Describe a situation where you had a disagreement with a team member. How did you handle it?",
      evaluates: ["Communication", "Conflict Resolution", "Teamwork"],
      followUps: [
        "What was the root cause of the disagreement?",
        "How did you find common ground?",
        "What did you learn from this experience?",
      ],
    },
  ];

  behavioralTemplates.forEach((template, index) => {
    questions.push({
      id: `behav-${index}-${Date.now()}`,
      text: template.text,
      type: "behavioral",
      difficulty: "medium",
      followUps: template.followUps,
      evaluates: template.evaluates,
      aiGenerated: true,
    });
  });

  // Situational questions based on experience level
  const situationalByLevel = {
    junior: {
      text: "If you were assigned a task using a technology you're not familiar with, how would you approach learning it?",
      evaluates: ["Learning Aptitude", "Initiative", "Problem Solving"],
      followUps: [
        "What resources would you use?",
        "How would you know when you're ready to start the task?",
        "How would you ask for help if needed?",
      ],
    },
    mid: {
      text: "Imagine you discover a significant bug in production right before a major release. What steps would you take?",
      evaluates: ["Crisis Management", "Decision Making", "Communication"],
      followUps: [
        "Who would you involve in the decision?",
        "How would you communicate this to stakeholders?",
        "What preventive measures would you suggest?",
      ],
    },
    senior: {
      text: "How would you approach mentoring a junior developer who is struggling with their tasks?",
      evaluates: ["Leadership", "Mentoring", "Communication"],
      followUps: [
        "How would you identify the root cause of their struggles?",
        "What specific techniques would you use?",
        "How would you balance helping them vs. doing your own work?",
      ],
    },
  };

  const situational = situationalByLevel[experienceLevel];
  questions.push({
    id: `sit-0-${Date.now()}`,
    text: situational.text,
    type: "situational",
    difficulty: experienceLevel === "senior" ? "hard" : "medium",
    followUps: situational.followUps,
    evaluates: situational.evaluates,
    aiGenerated: true,
  });

  // Add role-specific question based on title
  if (title.toLowerCase().includes("frontend") || title.toLowerCase().includes("react")) {
    questions.push({
      id: `role-0-${Date.now()}`,
      text: "How do you approach building accessible and performant user interfaces? Can you give an example?",
      type: "technical",
      difficulty: "medium",
      followUps: [
        "What tools do you use to test accessibility?",
        "How do you optimize performance in React applications?",
        "How do you handle browser compatibility?",
      ],
      evaluates: ["Accessibility", "Performance", "Best Practices"],
      aiGenerated: true,
    });
  } else if (title.toLowerCase().includes("backend")) {
    questions.push({
      id: `role-0-${Date.now()}`,
      text: "Describe your approach to designing a scalable API. What considerations are most important?",
      type: "technical",
      difficulty: "hard",
      followUps: [
        "How do you handle rate limiting and authentication?",
        "What's your approach to API versioning?",
        "How do you document your APIs?",
      ],
      evaluates: ["System Design", "Scalability", "API Design"],
      aiGenerated: true,
    });
  }

  return questions;
}

export function QuestionGeneration({
  jobContext,
  questions,
  setQuestions,
  onNext,
  onBack,
}: QuestionGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Generate questions on mount if none exist
  useEffect(() => {
    if (questions.length === 0 && jobContext.title) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const generated = generateQuestionsFromContext(jobContext);
    setQuestions(generated);
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const generated = generateQuestionsFromContext(jobContext);
    setQuestions(generated);
    setIsGenerating(false);
  };

  const addQuestion = () => {
    const newQuestion: InterviewQuestion = {
      id: `custom-${Date.now()}`,
      text: "",
      type: "technical",
      difficulty: "medium",
      followUps: [""],
      evaluates: [],
      aiGenerated: false,
    };
    setQuestions([...questions, newQuestion]);
    setEditingId(newQuestion.id);
    setExpandedId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<InterviewQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addFollowUp = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      updateQuestion(questionId, { followUps: [...question.followUps, ""] });
    }
  };

  const updateFollowUp = (questionId: string, index: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newFollowUps = [...question.followUps];
      newFollowUps[index] = value;
      updateQuestion(questionId, { followUps: newFollowUps });
    }
  };

  const removeFollowUp = (questionId: string, index: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newFollowUps = question.followUps.filter((_, i) => i !== index);
      updateQuestion(questionId, { followUps: newFollowUps });
    }
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions];
    const [removed] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, removed);
    setQuestions(newQuestions);
  };

  const isValid = questions.length >= 3 && questions.every(q => q.text.trim() !== "");

  const questionsByType = {
    technical: questions.filter(q => q.type === "technical").length,
    behavioral: questions.filter(q => q.type === "behavioral").length,
    situational: questions.filter(q => q.type === "situational").length,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg sm:rounded-xl bg-card border border-border card-elevated p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 ai-gradient-subtle rounded-lg mb-6">
          <div className="h-10 w-10 rounded-lg ai-gradient flex items-center justify-center shrink-0">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">AI Question Generation</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Questions are generated based on job context: <strong>{jobContext.title}</strong>
              {jobContext.skills.length > 0 && (
                <span> • Skills: {jobContext.skills.slice(0, 3).join(", ")}</span>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(questionTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = questionsByType[type as keyof typeof questionsByType];
            return (
              <div key={type} className={`p-3 rounded-lg ${config.color.split(" ")[1]}`}>
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color.split(" ")[0]}`} />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <div className="text-2xl font-bold mt-1">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Loading state */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full ai-gradient flex items-center justify-center mb-4 ai-glow">
              <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
            </div>
            <h3 className="font-medium text-lg mb-1">Generating Questions</h3>
            <p className="text-sm text-muted-foreground">
              AI is crafting questions based on {jobContext.title}...
            </p>
          </div>
        )}

        {/* Questions list */}
        {!isGenerating && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {questions.map((question, index) => {
                const typeConfig = questionTypeConfig[question.type];
                const TypeIcon = typeConfig.icon;
                const isExpanded = expandedId === question.id;
                const isEditing = editingId === question.id;

                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    layout
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    {/* Question header */}
                    <div
                      className="flex items-start gap-3 p-4 bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : question.id)}
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          {index + 1}.
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <Textarea
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                            placeholder="Enter your question..."
                            className="min-h-[80px]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed">
                            {question.text || <span className="text-muted-foreground italic">Click to add question...</span>}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className={typeConfig.color}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                          <Badge variant="outline" className={difficultyConfig[question.difficulty].color}>
                            {difficultyConfig[question.difficulty].label}
                          </Badge>
                          {question.aiGenerated && (
                            <Badge variant="outline" className="text-primary bg-primary/10">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {question.followUps.filter(f => f.trim()).length} follow-ups
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(isEditing ? null : question.id);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(question.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border bg-muted/20"
                        >
                          <div className="p-4 space-y-4">
                            {/* Question settings */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1.5 block">Type</label>
                                <Select
                                  value={question.type}
                                  onValueChange={(v: InterviewQuestion["type"]) => 
                                    updateQuestion(question.id, { type: v })
                                  }
                                >
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="technical">Technical</SelectItem>
                                    <SelectItem value="behavioral">Behavioral</SelectItem>
                                    <SelectItem value="situational">Situational</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1.5 block">Difficulty</label>
                                <Select
                                  value={question.difficulty}
                                  onValueChange={(v: InterviewQuestion["difficulty"]) => 
                                    updateQuestion(question.id, { difficulty: v })
                                  }
                                >
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Follow-up prompts */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium flex items-center gap-1.5">
                                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                                  Follow-up Prompts
                                  <span className="font-normal text-muted-foreground">(for AI interviewer)</span>
                                </label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addFollowUp(question.id)}
                                  className="h-7 text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Follow-up
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {question.followUps.map((followUp, fIndex) => (
                                  <div key={fIndex} className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-4">{fIndex + 1}.</span>
                                    <Input
                                      value={followUp}
                                      onChange={(e) => updateFollowUp(question.id, fIndex, e.target.value)}
                                      placeholder="Enter follow-up question..."
                                      className="flex-1 text-sm"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 shrink-0"
                                      onClick={() => removeFollowUp(question.id, fIndex)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Skills evaluated */}
                            <div>
                              <label className="text-xs font-medium mb-2 block">Skills Evaluated</label>
                              <div className="flex flex-wrap gap-1.5">
                                {question.evaluates.map((skill, sIndex) => (
                                  <Badge key={sIndex} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Add question button */}
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={addQuestion}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Question
            </Button>
          </div>
        )}

        {/* Tip */}
        {!isGenerating && questions.length > 0 && (
          <Card className="mt-6 bg-accent/30 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Pro Tip</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click on any question to expand and customize follow-up prompts. 
                    The AI interviewer will use these to dig deeper based on candidate responses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {questions.length} question{questions.length !== 1 ? "s" : ""} ready
          </span>
          <Button 
            onClick={onNext} 
            disabled={!isValid || isGenerating} 
            className="ai-gradient w-full sm:w-auto"
          >
            Continue to Access & Notify
          </Button>
        </div>
      </div>
    </div>
  );
}
