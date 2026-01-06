import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Star, TrendingUp, AlertCircle, CheckCircle, MessageSquare, Clock, Award, Shield, ShieldCheck, Database, Target, Gauge } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockReport = {
  candidate: {
    name: "Sarah Chen",
    email: "sarah@example.com",
    position: "Senior Frontend Developer",
    completedAt: "January 15, 2024 at 2:30 PM",
    duration: "23 minutes",
    atsId: "GH-2024-001",
    source: "CSV Import",
  },
  overall: {
    score: 87,
    recommendation: "Strong Hire",
    recommendationColor: "text-green-600",
    jobMatch: 92,
    confidence: "High",
    summary: "Sarah demonstrated exceptional technical skills and strong problem-solving abilities. Her communication was clear and structured, with excellent examples from past experience.",
  },
  integrity: {
    level: "high",
    tabSwitches: 0,
    faceDetected: true,
    audioSilence: false,
    networkIssues: false,
  },
  skills: [
    { name: "React", score: 92, level: "Expert" },
    { name: "TypeScript", score: 88, level: "Advanced" },
    { name: "System Design", score: 85, level: "Advanced" },
    { name: "CSS/Styling", score: 82, level: "Proficient" },
    { name: "Problem Solving", score: 90, level: "Expert" },
  ],
  communication: {
    score: 85,
    clarity: 88,
    structure: 82,
    examples: 90,
  },
  strengths: [
    "Strong understanding of React patterns and best practices",
    "Excellent at breaking down complex problems",
    "Clear communication with real-world examples",
    "Good understanding of performance optimization",
  ],
  improvements: [
    "Could improve depth in system design discussions",
    "Consider more edge cases in initial problem analysis",
  ],
  concerns: [],
  questions: [
    {
      question: "Describe your experience with React state management",
      response: "Detailed response about Redux, Context API, and Zustand...",
      score: 90,
      feedback: "Comprehensive answer with practical examples",
    },
    {
      question: "How would you optimize a slow React application?",
      response: "Discussed React.memo, useMemo, code splitting...",
      score: 88,
      feedback: "Good technical depth, mentioned key optimization techniques",
    },
    {
      question: "Walk me through a challenging project you worked on",
      response: "Described leading a team to rebuild a legacy dashboard...",
      score: 92,
      feedback: "Excellent storytelling and demonstrated leadership",
    },
  ],
};

const getRecommendationBadge = (recommendation: string) => {
  const styles: Record<string, string> = {
    "Strong Hire": "bg-success/10 text-success border-success/20",
    "Hire": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Review": "bg-warning/10 text-warning border-warning/20",
    "No Hire": "bg-destructive/10 text-destructive border-destructive/20",
  };
  return styles[recommendation] || styles["Review"];
};

const getConfidenceBadge = (confidence: string) => {
  const styles: Record<string, string> = {
    "High": "bg-success/10 text-success",
    "Medium": "bg-warning/10 text-warning",
    "Low": "bg-muted text-muted-foreground",
  };
  return styles[confidence] || styles["Medium"];
};

const EvaluationReport = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8 max-w-5xl px-4">
        {/* Back button and header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/interviews">
              <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Here's how the AI evaluated this candidate</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  {mockReport.candidate.name} • {mockReport.candidate.position}
                </p>
                {mockReport.candidate.atsId && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Database className="h-3 w-3" />
                    {mockReport.candidate.atsId}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Overall Score - Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 overflow-hidden">
              <CardContent className="p-5 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                    {/* Score Circle */}
                    <div className="relative mx-auto sm:mx-0">
                      <div className="h-24 w-24 md:h-28 md:w-28 rounded-full ai-gradient-subtle flex items-center justify-center ai-glow-sm">
                        <span className="text-3xl md:text-4xl font-bold text-primary">{mockReport.overall.score}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 md:h-8 md:w-8 rounded-full ai-gradient flex items-center justify-center">
                        <Award className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-foreground" />
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                        <Badge className={`text-xs md:text-sm px-3 py-1 ${getRecommendationBadge(mockReport.overall.recommendation)}`}>
                          {mockReport.overall.recommendation}
                        </Badge>
                        <Badge variant="secondary" className={`text-xs gap-1 ${getConfidenceBadge(mockReport.overall.confidence)}`}>
                          <Gauge className="h-3 w-3" />
                          {mockReport.overall.confidence} Confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-xl">
                        {mockReport.overall.summary}
                      </p>
                    </div>
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex flex-row lg:flex-col gap-4 lg:gap-3 text-sm text-muted-foreground border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span><strong className="text-foreground">{mockReport.overall.jobMatch}%</strong> Job Match</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{mockReport.candidate.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      <span>High Integrity</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integrity Summary - Collapsible Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Integrity Summary</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      No concerning behaviors detected. Face visible throughout, no tab switches, stable audio and network connection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Skills Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Skills Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {mockReport.skills.map((skill, index) => (
                    <div key={skill.name} className="space-y-1.5 md:space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <Badge variant="secondary" className="text-[10px] md:text-xs">{skill.level}</Badge>
                        </div>
                        <span className="font-semibold text-sm text-primary">{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-1.5 md:h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Communication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Communication Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4 md:mb-6">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full ai-gradient-subtle flex items-center justify-center">
                      <span className="text-2xl md:text-3xl font-bold text-primary">{mockReport.communication.score}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="text-center p-2 md:p-3 rounded-lg bg-muted">
                      <div className="text-lg md:text-xl font-semibold">{mockReport.communication.clarity}%</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">Clarity</div>
                    </div>
                    <div className="text-center p-2 md:p-3 rounded-lg bg-muted">
                      <div className="text-lg md:text-xl font-semibold">{mockReport.communication.structure}%</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">Structure</div>
                    </div>
                    <div className="text-center p-2 md:p-3 rounded-lg bg-muted">
                      <div className="text-lg md:text-xl font-semibold">{mockReport.communication.examples}%</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">Examples</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    AI-Detected Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 md:space-y-3">
                    {mockReport.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 md:gap-3">
                        <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-warning mt-0.5 flex-shrink-0" />
                        <span className="text-xs md:text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    AI-Detected Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 md:space-y-3">
                    {mockReport.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 md:gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                        <span className="text-xs md:text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                  {mockReport.concerns.length > 0 && (
                    <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="font-medium text-destructive text-sm mb-2">AI-Detected Concerns</div>
                      <ul className="space-y-2">
                        {mockReport.concerns.map((concern, index) => (
                          <li key={index} className="text-xs md:text-sm text-destructive">{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Question Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg">Key Answer Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {mockReport.questions.map((q, index) => (
                  <div key={index} className="p-3 md:p-4 rounded-lg border bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 md:mb-3">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm font-medium text-primary shrink-0">
                          {index + 1}
                        </div>
                        <span className="font-medium text-sm md:text-base">{q.question}</span>
                      </div>
                      <Badge variant="secondary" className="text-primary text-xs self-start">
                        {q.score}%
                      </Badge>
                    </div>
                    <div className="ml-8 md:ml-11">
                      <p className="text-xs md:text-sm text-muted-foreground mb-2 italic">"{q.response}"</p>
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-success" />
                        <span className="text-success">{q.feedback}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EvaluationReport;