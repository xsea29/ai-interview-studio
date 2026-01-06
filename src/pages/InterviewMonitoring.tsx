import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Video, 
  Mic, 
  MessageSquare,
  Clock,
  CheckCircle,
  Circle,
  Play,
  ExternalLink,
  Download
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type InterviewStatus = "not_started" | "in_progress" | "completed";
type InterviewType = "text" | "audio" | "video";

interface CandidateInterview {
  id: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  completedAt?: string;
  duration?: string;
  score?: number;
}

const mockInterviews: CandidateInterview[] = [
  {
    id: "1",
    candidateName: "John Smith",
    email: "john.smith@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "completed",
    completedAt: "2 hours ago",
    duration: "14m 32s",
    score: 87,
  },
  {
    id: "2",
    candidateName: "Sarah Johnson",
    email: "sarah.j@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "in_progress",
    duration: "8m 15s",
  },
  {
    id: "3",
    candidateName: "Mike Brown",
    email: "mike.b@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "completed",
    completedAt: "1 day ago",
    duration: "12m 45s",
    score: 92,
  },
  {
    id: "4",
    candidateName: "Emily Davis",
    email: "emily.d@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "not_started",
  },
  {
    id: "5",
    candidateName: "Chris Wilson",
    email: "chris.w@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "completed",
    completedAt: "3 hours ago",
    duration: "11m 20s",
    score: 78,
  },
  {
    id: "6",
    candidateName: "Amanda Lee",
    email: "amanda.l@email.com",
    jobTitle: "Product Manager",
    interviewType: "audio",
    status: "completed",
    completedAt: "1 day ago",
    duration: "15m 10s",
    score: 85,
  },
  {
    id: "7",
    candidateName: "David Chen",
    email: "david.c@email.com",
    jobTitle: "Product Manager",
    interviewType: "audio",
    status: "not_started",
  },
  {
    id: "8",
    candidateName: "Lisa Wang",
    email: "lisa.w@email.com",
    jobTitle: "UX Designer",
    interviewType: "text",
    status: "in_progress",
    duration: "5m 30s",
  },
];

const typeIcons = {
  video: Video,
  audio: Mic,
  text: MessageSquare,
};

const statusConfig = {
  not_started: {
    icon: Circle,
    label: "Not started",
    className: "status-pending",
  },
  in_progress: {
    icon: Play,
    label: "In progress",
    className: "status-in-progress",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    className: "status-completed",
  },
};

const InterviewMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    const matchesType = typeFilter === "all" || interview.interviewType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: mockInterviews.length,
    completed: mockInterviews.filter((i) => i.status === "completed").length,
    inProgress: mockInterviews.filter((i) => i.status === "in_progress").length,
    notStarted: mockInterviews.filter((i) => i.status === "not_started").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Interview Monitoring</h1>
            <p className="text-muted-foreground mt-0.5">
              Track candidate interview progress and results
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Results
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Candidates" value={stats.total} />
          <StatCard label="Completed" value={stats.completed} variant="success" />
          <StatCard label="In Progress" value={stats.inProgress} variant="warning" />
          <StatCard label="Not Started" value={stats.notStarted} variant="muted" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates..."
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="not_started">Not started</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card border border-border card-elevated overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Candidate
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Position
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Type
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Duration
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Score
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInterviews.map((interview) => {
                  const TypeIcon = typeIcons[interview.interviewType];
                  const statusInfo = statusConfig[interview.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={interview.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{interview.candidateName}</div>
                          <div className="text-sm text-muted-foreground">
                            {interview.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">{interview.jobTitle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">
                            {interview.interviewType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusInfo.className}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {interview.duration || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {interview.score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full ai-gradient"
                                style={{ width: `${interview.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{interview.score}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {interview.status === "completed" && (
                            <Button variant="ghost" size="sm" className="gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              View
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No interviews found</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "warning" | "muted";
}) {
  const valueColors = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    muted: "text-muted-foreground",
  };

  return (
    <div className="rounded-lg bg-card border border-border p-4">
      <div className={`text-2xl font-semibold ${valueColors[variant]}`}>{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default InterviewMonitoring;
