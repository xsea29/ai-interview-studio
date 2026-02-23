import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Copy, Link2, Clock, Users, MessageSquare, Mic, Video,
  Calendar, Send, Download, CheckCircle, Circle, Play, Pause, Eye,
  Mail, MoreHorizontal, Search, ExternalLink, RefreshCw, XCircle,
  BarChart3, Star, AlertCircle, Filter, Trash2
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type CandidateStatus = "completed" | "in_progress" | "not_started" | "expired" | "withdrawn";

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  score: number | null;
  completedAt: string | null;
  invitedAt: string;
  lastActivity: string | null;
  remindersSent: number;
  flagged: boolean;
}

const mockJob = {
  id: "1",
  jobTitle: "Senior Frontend Developer",
  department: "Engineering",
  location: "Remote — US/EU",
  type: "video" as const,
  status: "active" as const,
  candidateCount: 24,
  completed: 18,
  inProgress: 3,
  notStarted: 2,
  expired: 1,
  withdrawn: 0,
  createdAt: "Jan 12, 2026",
  expiresAt: "Feb 12, 2026",
  questionCount: 8,
  duration: 25,
  maxAttempts: 1,
  accessWindow: 72,
  skills: ["React", "TypeScript", "System Design", "CSS", "Node.js"],
  adaptiveDifficulty: true,
  followUp: true,
  avgScore: 82,
  topScore: 96,
  avgCompletionTime: "18 min",
  interviewLink: "https://interview.ai/j/abc123",
};

const mockCandidates: Candidate[] = [
  { id: "c1", name: "Sarah Chen", email: "sarah.chen@example.com", status: "completed", score: 96, completedAt: "2 hours ago", invitedAt: "Jan 14", lastActivity: "2 hours ago", remindersSent: 0, flagged: false },
  { id: "c2", name: "Marcus Johnson", email: "marcus.j@example.com", status: "completed", score: 92, completedAt: "5 hours ago", invitedAt: "Jan 14", lastActivity: "5 hours ago", remindersSent: 0, flagged: false },
  { id: "c3", name: "Emily Rodriguez", email: "emily.r@example.com", status: "completed", score: 88, completedAt: "1 day ago", invitedAt: "Jan 13", lastActivity: "1 day ago", remindersSent: 0, flagged: false },
  { id: "c4", name: "Aisha Patel", email: "aisha.p@example.com", status: "completed", score: 85, completedAt: "1 day ago", invitedAt: "Jan 13", lastActivity: "1 day ago", remindersSent: 1, flagged: false },
  { id: "c5", name: "James Miller", email: "james.m@example.com", status: "completed", score: 81, completedAt: "2 days ago", invitedAt: "Jan 12", lastActivity: "2 days ago", remindersSent: 0, flagged: true },
  { id: "c6", name: "Priya Sharma", email: "priya.s@example.com", status: "completed", score: 79, completedAt: "2 days ago", invitedAt: "Jan 12", lastActivity: "2 days ago", remindersSent: 0, flagged: false },
  { id: "c7", name: "David Kim", email: "david.k@example.com", status: "in_progress", score: null, completedAt: null, invitedAt: "Jan 15", lastActivity: "30 min ago", remindersSent: 0, flagged: false },
  { id: "c8", name: "Lisa Wang", email: "lisa.w@example.com", status: "in_progress", score: null, completedAt: null, invitedAt: "Jan 15", lastActivity: "1 hour ago", remindersSent: 0, flagged: false },
  { id: "c9", name: "Tom Bradley", email: "tom.b@example.com", status: "in_progress", score: null, completedAt: null, invitedAt: "Jan 14", lastActivity: "3 hours ago", remindersSent: 1, flagged: false },
  { id: "c10", name: "Nina Foster", email: "nina.f@example.com", status: "not_started", score: null, completedAt: null, invitedAt: "Jan 16", lastActivity: null, remindersSent: 0, flagged: false },
  { id: "c11", name: "Alex Turner", email: "alex.t@example.com", status: "not_started", score: null, completedAt: null, invitedAt: "Jan 16", lastActivity: null, remindersSent: 2, flagged: false },
  { id: "c12", name: "Rachel Green", email: "rachel.g@example.com", status: "expired", score: null, completedAt: null, invitedAt: "Jan 10", lastActivity: null, remindersSent: 3, flagged: false },
];

const typeIcons = { video: Video, audio: Mic, text: MessageSquare };
const typeLabels = { video: "Video Interview", audio: "Audio Interview", text: "Text Interview" };

const statusConfig: Record<CandidateStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  completed: { label: "Completed", color: "text-success bg-success/10", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "text-warning bg-warning/10", icon: Play },
  not_started: { label: "Not Started", color: "text-muted-foreground bg-muted", icon: Circle },
  expired: { label: "Expired", color: "text-destructive bg-destructive/10", icon: XCircle },
  withdrawn: { label: "Withdrawn", color: "text-muted-foreground bg-muted", icon: XCircle },
};

export default function JobCampaignDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidateFilter, setCandidateFilter] = useState<"all" | CandidateStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const job = mockJob;
  const TypeIcon = typeIcons[job.type];
  const completionRate = Math.round((job.completed / job.candidateCount) * 100);

  const filteredCandidates = mockCandidates.filter((c) => {
    const matchesFilter = candidateFilter === "all" || c.status === candidateFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const copyLink = () => {
    navigator.clipboard.writeText(job.interviewLink);
    toast({ title: "Link Copied", description: "Interview link copied to clipboard" });
  };

  const sendReminder = (candidate: Candidate) => {
    toast({ title: "Reminder Sent", description: `Reminder sent to ${candidate.name}` });
  };

  const sendBulkReminders = () => {
    const pending = mockCandidates.filter((c) => c.status === "not_started" || c.status === "in_progress");
    toast({ title: "Reminders Sent", description: `Sent reminders to ${pending.length} candidates` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 sm:py-8 px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/interviews/jobs")} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-semibold">{job.jobTitle}</h1>
                  <Badge variant={job.status === "active" ? "default" : "secondary"} className="capitalize">
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.department} • {job.location} • Created {job.createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm" onClick={sendBulkReminders}>
                <Send className="h-4 w-4 mr-1.5" />
                Send Reminders
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => toast({ title: "Campaign paused" })}>
                    <Pause className="h-4 w-4 mr-2" /> Pause Campaign
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Link regenerated" })}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Regenerate Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto gap-0">
            {[
              { value: "overview", label: "Overview" },
              { value: "candidates", label: `Candidates (${job.candidateCount})` },
              { value: "link", label: "Interview Link" },
              { value: "settings", label: "Settings" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* Stats Row */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-semibold mt-1">{completionRate}%</p>
                  <Progress value={completionRate} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-semibold mt-1">{job.avgScore}<span className="text-sm text-muted-foreground">/100</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Top: {job.topScore}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Avg. Time</p>
                  <p className="text-2xl font-semibold mt-1">{job.avgCompletionTime}</p>
                  <p className="text-xs text-muted-foreground mt-1">of {job.duration} min allowed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Pending Action</p>
                  <p className="text-2xl font-semibold mt-1 text-warning">{job.notStarted + job.inProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">{job.notStarted} not started</p>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Progress Breakdown */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Candidate Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Completed", count: job.completed, color: "bg-success/10 text-success" },
                        { label: "In Progress", count: job.inProgress, color: "bg-warning/10 text-warning" },
                        { label: "Not Started", count: job.notStarted, color: "bg-muted text-muted-foreground" },
                        { label: "Expired", count: job.expired, color: "bg-destructive/10 text-destructive" },
                      ].map((s) => (
                        <div key={s.label} className={`rounded-lg p-3 text-center ${s.color}`}>
                          <p className="text-2xl font-semibold">{s.count}</p>
                          <p className="text-xs mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
                      <div className="bg-success transition-all" style={{ width: `${(job.completed / job.candidateCount) * 100}%` }} />
                      <div className="bg-warning transition-all" style={{ width: `${(job.inProgress / job.candidateCount) * 100}%` }} />
                      <div className="bg-muted-foreground/30 transition-all" style={{ width: `${(job.notStarted / job.candidateCount) * 100}%` }} />
                      <div className="bg-destructive/60 transition-all" style={{ width: `${(job.expired / job.candidateCount) * 100}%` }} />
                    </div>

                    {/* Top Performers */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-warning" /> Top Performers
                      </h4>
                      <div className="space-y-2">
                        {mockCandidates
                          .filter((c) => c.status === "completed" && c.score)
                          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                          .slice(0, 3)
                          .map((c, i) => (
                            <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground w-5">#{i + 1}</span>
                                <div>
                                  <p className="text-sm font-medium">{c.name}</p>
                                  <p className="text-xs text-muted-foreground">{c.completedAt}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-primary">{c.score}%</span>
                                <Link to={`/report/${c.id}`}>
                                  <Button variant="ghost" size="sm" className="text-xs h-7">View Report</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar Quick Info */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                {/* Interview Link Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="h-4 w-4" /> Interview Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-2.5 rounded-md bg-muted text-xs font-mono break-all">{job.interviewLink}</div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={copyLink} className="flex-1 text-xs">
                        <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Expires {job.expiresAt}
                    </div>
                  </CardContent>
                </Card>

                {/* Config Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/5">
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{typeLabels[job.type]}</p>
                        <p className="text-xs text-muted-foreground">AI-powered</p>
                      </div>
                    </div>
                    {[
                      { label: "Questions", value: job.questionCount },
                      { label: "Duration", value: `${job.duration} min` },
                      { label: "Max Attempts", value: job.maxAttempts },
                      { label: "Access Window", value: `${job.accessWindow}h` },
                      { label: "Adaptive", value: job.adaptiveDifficulty ? "On" : "Off" },
                      { label: "Follow-ups", value: job.followUp ? "On" : "Off" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                    <div className="pt-1">
                      <p className="text-xs text-muted-foreground mb-1.5">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0.5">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={sendBulkReminders}>
                      <Mail className="h-3.5 w-3.5 mr-2" /> Send All Reminders
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Download className="h-3.5 w-3.5 mr-2" /> Export Results (CSV)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <BarChart3 className="h-3.5 w-3.5 mr-2" /> View Analytics
                    </Button>
                    <Link to={`/readiness/${jobId}`}>
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Eye className="h-3.5 w-3.5 mr-2" /> Readiness Check
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* ── Candidates Tab ── */}
          <TabsContent value="candidates" className="space-y-4 mt-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search candidates..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {(["all", "completed", "in_progress", "not_started", "expired"] as const).map((f) => (
                  <Button
                    key={f}
                    variant={candidateFilter === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCandidateFilter(f)}
                    className="text-xs whitespace-nowrap"
                  >
                    {f === "all" ? `All (${mockCandidates.length})` :
                      `${statusConfig[f].label} (${mockCandidates.filter((c) => c.status === f).length})`}
                  </Button>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[1fr_120px_100px_100px_80px_60px] gap-3 px-4 py-3 border-b border-border text-xs text-muted-foreground font-medium">
                  <span>Candidate</span>
                  <span>Status</span>
                  <span>Score</span>
                  <span>Invited</span>
                  <span>Reminders</span>
                  <span></span>
                </div>

                <div className="divide-y divide-border">
                  {filteredCandidates.map((candidate) => {
                    const sc = statusConfig[candidate.status];
                    const StatusIcon = sc.icon;
                    return (
                      <div key={candidate.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_100px_100px_80px_60px] gap-2 sm:gap-3 sm:items-center px-4 py-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${sc.color}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate flex items-center gap-1.5">
                              {candidate.name}
                              {candidate.flagged && <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                          </div>
                        </div>

                        <div className="ml-11 sm:ml-0">
                          <Badge variant="secondary" className={`text-[10px] ${sc.color} border-0`}>{sc.label}</Badge>
                        </div>

                        <div className="ml-11 sm:ml-0">
                          {candidate.score !== null ? (
                            <span className={`text-sm font-semibold ${candidate.score >= 80 ? "text-success" : candidate.score >= 60 ? "text-warning" : "text-destructive"}`}>
                              {candidate.score}%
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>

                        <div className="hidden sm:block text-xs text-muted-foreground">{candidate.invitedAt}</div>
                        <div className="hidden sm:block text-xs text-muted-foreground">{candidate.remindersSent}</div>

                        <div className="ml-11 sm:ml-0 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              {candidate.status === "completed" && (
                                <DropdownMenuItem asChild>
                                  <Link to={`/report/${candidate.id}`}>
                                    <Eye className="h-4 w-4 mr-2" /> View Report
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {(candidate.status === "not_started" || candidate.status === "in_progress") && (
                                <DropdownMenuItem onClick={() => sendReminder(candidate)}>
                                  <Send className="h-4 w-4 mr-2" /> Send Reminder
                                </DropdownMenuItem>
                              )}
                              {candidate.status === "expired" && (
                                <DropdownMenuItem onClick={() => toast({ title: "Link Resent", description: `New link sent to ${candidate.name}` })}>
                                  <RefreshCw className="h-4 w-4 mr-2" /> Resend Link
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" /> Email Candidate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCandidates.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">No candidates match your filter.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Interview Link Tab ── */}
          <TabsContent value="link" className="space-y-6 mt-0">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Link2 className="h-5 w-5" /> Shareable Interview Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted font-mono text-sm break-all">{job.interviewLink}</div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={copyLink}><Copy className="h-4 w-4 mr-2" /> Copy Link</Button>
                    <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" /> Open Preview</Button>
                    <Button variant="outline" onClick={() => toast({ title: "Link Regenerated", description: "Old link has been invalidated" })}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{job.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium">{job.expiresAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Uses:</span>
                      <span className="font-medium">{job.candidateCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Access Window:</span>
                      <span className="font-medium">{job.accessWindow} hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bulk Invite via Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Send the interview link directly to candidates via email. They'll receive a personalized invitation with instructions.</p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter email addresses (comma separated)" className="flex-1" />
                    <Button><Send className="h-4 w-4 mr-2" /> Send Invites</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Settings Tab ── */}
          <TabsContent value="settings" className="space-y-6 mt-0">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Interview Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Interview Type", value: typeLabels[job.type] },
                      { label: "Number of Questions", value: String(job.questionCount) },
                      { label: "Duration Limit", value: `${job.duration} minutes` },
                      { label: "Max Attempts", value: String(job.maxAttempts) },
                      { label: "Access Window", value: `${job.accessWindow} hours` },
                      { label: "Adaptive Difficulty", value: job.adaptiveDifficulty ? "Enabled" : "Disabled" },
                      { label: "Follow-up Questions", value: job.followUp ? "Enabled" : "Disabled" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills Evaluated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-sm px-3 py-1">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Pause Campaign</p>
                      <p className="text-xs text-muted-foreground">Temporarily stop accepting new interviews</p>
                    </div>
                    <Button variant="outline" size="sm"><Pause className="h-4 w-4 mr-1.5" /> Pause</Button>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-destructive">Delete Campaign</p>
                      <p className="text-xs text-muted-foreground">Permanently remove this campaign and all data</p>
                    </div>
                    <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1.5" /> Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
