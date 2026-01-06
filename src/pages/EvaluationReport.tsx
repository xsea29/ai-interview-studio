import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Star, TrendingUp, AlertCircle, CheckCircle, MessageSquare, Clock, Award } from "lucide-react";
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
  },
  overall: {
    score: 87,
    recommendation: "Strong Hire",
    recommendationColor: "text-green-600",
    summary: "Sarah demonstrated exceptional technical skills and strong problem-solving abilities. Her communication was clear and structured, with excellent examples from past experience.",
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
    "Strong Hire": "bg-green-500/10 text-green-600 border-green-500/20",
    "Hire": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Review": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "No Hire": "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return styles[recommendation] || styles["Review"];
};

const EvaluationReport = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-5xl">
        {/* Back button and header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/interviews">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AI Evaluation Report</h1>
              <p className="text-muted-foreground mt-0.5">
                {mockReport.candidate.name} • {mockReport.candidate.position}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">{mockReport.overall.score}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`text-sm px-3 py-1 ${getRecommendationBadge(mockReport.overall.recommendation)}`}>
                          {mockReport.overall.recommendation}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground max-w-xl">
                        {mockReport.overall.summary}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 justify-end">
                      <Clock className="h-4 w-4" />
                      {mockReport.candidate.duration}
                    </div>
                    <div className="mt-1">{mockReport.candidate.completedAt}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Skills Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Skills Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockReport.skills.map((skill, index) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">{skill.level}</Badge>
                        </div>
                        <span className="font-semibold text-primary">{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-2" />
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Communication Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{mockReport.communication.score}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <div className="text-xl font-semibold">{mockReport.communication.clarity}%</div>
                      <div className="text-xs text-muted-foreground">Clarity</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <div className="text-xl font-semibold">{mockReport.communication.structure}%</div>
                      <div className="text-xs text-muted-foreground">Structure</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <div className="text-xl font-semibold">{mockReport.communication.examples}%</div>
                      <div className="text-xs text-muted-foreground">Examples</div>
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {mockReport.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {mockReport.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                  {mockReport.concerns.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="font-medium text-red-600 mb-2">AI-Detected Concerns</div>
                      <ul className="space-y-2">
                        {mockReport.concerns.map((concern, index) => (
                          <li key={index} className="text-sm text-red-600">{concern}</li>
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
              <CardHeader>
                <CardTitle className="text-lg">Question-by-Question Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReport.questions.map((q, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{q.question}</span>
                      </div>
                      <Badge variant="secondary" className="text-primary">
                        {q.score}%
                      </Badge>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm text-muted-foreground mb-2">{q.response}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">{q.feedback}</span>
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
