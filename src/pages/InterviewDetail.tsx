import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Link2, Clock, Users, MessageSquare, Mic, Video, Calendar, Send, Download, ExternalLink, CheckCircle, Circle, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const mockInterview = {
  id: "1",
  title: "Senior Frontend Developer",
  department: "Engineering",
  status: "active",
  type: "video",
  createdAt: "2024-01-15",
  expiresAt: "2024-02-15",
  totalCandidates: 24,
  completed: 18,
  inProgress: 3,
  notStarted: 3,
  questionCount: 8,
  duration: 25,
  skills: ["React", "TypeScript", "System Design", "CSS"],
  adaptiveDifficulty: true,
  allowFollowUp: true,
};

const mockCandidates = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", status: "completed", score: 87, completedAt: "2 hours ago" },
  { id: "2", name: "Marcus Johnson", email: "marcus@example.com", status: "completed", score: 92, completedAt: "5 hours ago" },
  { id: "3", name: "Emily Rodriguez", email: "emily@example.com", status: "completed", score: 78, completedAt: "1 day ago" },
  { id: "4", name: "David Kim", email: "david@example.com", status: "in_progress", score: null, completedAt: null },
  { id: "5", name: "Lisa Wang", email: "lisa@example.com", status: "in_progress", score: null, completedAt: null },
  { id: "6", name: "James Miller", email: "james@example.com", status: "not_started", score: null, completedAt: null },
];

const typeIcons = {
  text: MessageSquare,
  audio: Mic,
  video: Video,
};

const InterviewDetail = () => {
  const { id } = useParams();
  const [filter, setFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");

  const interviewLink = `https://interview.ai/i/${id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(interviewLink);
    toast.success("Interview link copied to clipboard");
  };

  const filteredCandidates = mockCandidates.filter(c => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const TypeIcon = typeIcons[mockInterview.type as keyof typeof typeIcons];
  const completionRate = Math.round((mockInterview.completed / mockInterview.totalCandidates) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back button and header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/interviews">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{mockInterview.title}</h1>
                <Badge variant={mockInterview.status === "active" ? "default" : "secondary"}>
                  {mockInterview.status === "active" ? "Active" : "Closed"}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5">
                {mockInterview.department} • Created {mockInterview.createdAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={copyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{completionRate}%</span>
                      <span className="text-muted-foreground">
                        {mockInterview.completed} of {mockInterview.totalCandidates} completed
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center p-3 rounded-lg bg-green-500/10">
                        <div className="text-2xl font-semibold text-green-600">{mockInterview.completed}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-amber-500/10">
                        <div className="text-2xl font-semibold text-amber-600">{mockInterview.inProgress}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <div className="text-2xl font-semibold text-muted-foreground">{mockInterview.notStarted}</div>
                        <div className="text-xs text-muted-foreground">Not Started</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Candidates List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Candidates</CardTitle>
                    <div className="flex gap-2">
                      {["all", "completed", "in_progress", "not_started"].map((f) => (
                        <Button
                          key={f}
                          variant={filter === f ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setFilter(f as typeof filter)}
                          className="text-xs"
                        >
                          {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f === "not_started" ? "Not Started" : "Completed"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            candidate.status === "completed" ? "bg-green-500/10" :
                            candidate.status === "in_progress" ? "bg-amber-500/10" : "bg-muted"
                          }`}>
                            {candidate.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : candidate.status === "in_progress" ? (
                              <Play className="h-5 w-5 text-amber-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">{candidate.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {candidate.status === "completed" && (
                            <>
                              <div className="text-right">
                                <div className="font-semibold text-primary">{candidate.score}%</div>
                                <div className="text-xs text-muted-foreground">{candidate.completedAt}</div>
                              </div>
                              <Link to={`/report/${candidate.id}`}>
                                <Button variant="outline" size="sm">
                                  View Report
                                </Button>
                              </Link>
                            </>
                          )}
                          {candidate.status === "in_progress" && (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                              In Progress
                            </Badge>
                          )}
                          {candidate.status === "not_started" && (
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4 mr-2" />
                              Remind
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column - Config */}
          <div className="space-y-6">
            {/* Interview Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Interview Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted text-sm font-mono break-all">
                    {interviewLink}
                  </div>
                  <Button onClick={copyLink} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Expires {mockInterview.expiresAt}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium capitalize">{mockInterview.type} Interview</div>
                      <div className="text-sm text-muted-foreground">AI-powered evaluation</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions</span>
                      <span className="font-medium">{mockInterview.questionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{mockInterview.duration} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Adaptive Difficulty</span>
                      <span className="font-medium">{mockInterview.adaptiveDifficulty ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Follow-up Questions</span>
                      <span className="font-medium">{mockInterview.allowFollowUp ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">Skills Evaluated</div>
                    <div className="flex flex-wrap gap-2">
                      {mockInterview.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewDetail;
