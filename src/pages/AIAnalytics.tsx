import { motion } from "framer-motion";
import { Brain, Clock, TrendingUp, Users, CheckCircle, Gauge, BarChart3, Activity } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockAnalytics = {
  totalInterviews: 156,
  completedThisMonth: 42,
  avgCompletionRate: 94,
  avgConfidence: 82,
  timeSaved: 168,
  timeSavedUnit: "hours",
  avgDuration: 24,
  topSkillsEvaluated: [
    { skill: "React", count: 45 },
    { skill: "TypeScript", count: 38 },
    { skill: "System Design", count: 32 },
    { skill: "Problem Solving", count: 28 },
    { skill: "Communication", count: 24 },
  ],
  confidenceBreakdown: {
    high: 65,
    medium: 28,
    low: 7,
  },
  weeklyTrend: [
    { week: "Week 1", count: 8 },
    { week: "Week 2", count: 12 },
    { week: "Week 3", count: 10 },
    { week: "Week 4", count: 12 },
  ],
};

const AIAnalytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8 max-w-6xl px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">AI Interview Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track AI screening impact — not pipeline analytics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="card-elevated">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl ai-gradient-subtle flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">{mockAnalytics.totalInterviews}</p>
                    <p className="text-xs text-muted-foreground">Total AI Interviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="card-elevated">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">{mockAnalytics.timeSaved}h</p>
                    <p className="text-xs text-muted-foreground">Time Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-elevated">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gauge className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">{mockAnalytics.avgConfidence}%</p>
                    <p className="text-xs text-muted-foreground">Avg Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="card-elevated">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">{mockAnalytics.avgCompletionRate}%</p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Time Saved Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Time Saved vs Manual Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Total Screening Time Saved</p>
                      <p className="text-xs text-muted-foreground">vs 45 min/candidate manual screening</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">{mockAnalytics.timeSaved}</p>
                      <p className="text-xs text-muted-foreground">hours this month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Average AI Interview Duration</p>
                      <p className="text-xs text-muted-foreground">Time candidate spent</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{mockAnalytics.avgDuration}</p>
                      <p className="text-xs text-muted-foreground">minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-success">ROI Estimate</p>
                      <p className="text-xs text-muted-foreground">Based on $50/hr recruiter time</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">${mockAnalytics.timeSaved * 50}</p>
                      <p className="text-xs text-muted-foreground">saved this month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Confidence Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  AI Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-success"></span>
                        High Confidence
                      </span>
                      <span className="text-sm text-muted-foreground">{mockAnalytics.confidenceBreakdown.high}%</span>
                    </div>
                    <Progress value={mockAnalytics.confidenceBreakdown.high} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-warning"></span>
                        Medium Confidence
                      </span>
                      <span className="text-sm text-muted-foreground">{mockAnalytics.confidenceBreakdown.medium}%</span>
                    </div>
                    <Progress value={mockAnalytics.confidenceBreakdown.medium} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                        Low Confidence
                      </span>
                      <span className="text-sm text-muted-foreground">{mockAnalytics.confidenceBreakdown.low}%</span>
                    </div>
                    <Progress value={mockAnalytics.confidenceBreakdown.low} className="h-2" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  High confidence means AI is certain about its evaluation. Low confidence suggests manual review is recommended.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Skills Evaluated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Top Skills Evaluated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.topSkillsEvaluated.map((skill, index) => (
                    <div key={skill.skill} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground w-4">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{skill.skill}</span>
                          <span className="text-xs text-muted-foreground">{skill.count} interviews</span>
                        </div>
                        <Progress value={(skill.count / mockAnalytics.topSkillsEvaluated[0].count) * 100} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  This Month's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 gap-2">
                  {mockAnalytics.weeklyTrend.map((week, index) => {
                    const maxCount = Math.max(...mockAnalytics.weeklyTrend.map(w => w.count));
                    const height = (week.count / maxCount) * 100;
                    return (
                      <div key={week.week} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full rounded-t-md ai-gradient transition-all"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{week.week.split(' ')[1]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This month</span>
                  <span className="text-sm font-medium">{mockAnalytics.completedThisMonth} interviews completed</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              These analytics focus on AI interview impact only — not hiring pipeline metrics. 
              For pipeline analytics, use your connected ATS.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AIAnalytics;
