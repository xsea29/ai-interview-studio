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
  Download,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  Database,
  Eye,
  Mail,
  RefreshCw,
  Ban,
  Star,
  Trash2,
  Copy
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type InterviewStatus = "not_started" | "in_progress" | "completed";
type InterviewType = "text" | "audio" | "video";
type IntegrityLevel = "high" | "medium" | "low";

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
  atsId?: string;
  source: "csv" | "api" | "manual";
  integrity?: {
    level: IntegrityLevel;
    tabSwitches?: number;
    faceDetected?: boolean;
    audioSilence?: boolean;
  };
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
    atsId: "GH-2024-001",
    source: "csv",
    integrity: { level: "high", tabSwitches: 0, faceDetected: true, audioSilence: false },
  },
  {
    id: "2",
    candidateName: "Sarah Johnson",
    email: "sarah.j@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "in_progress",
    duration: "8m 15s",
    atsId: "GH-2024-002",
    source: "csv",
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
    atsId: "GH-2024-003",
    source: "csv",
    integrity: { level: "high", tabSwitches: 1, faceDetected: true, audioSilence: false },
  },
  {
    id: "4",
    candidateName: "Emily Davis",
    email: "emily.d@email.com",
    jobTitle: "Senior Frontend Developer",
    interviewType: "video",
    status: "not_started",
    atsId: "LV-5678",
    source: "manual",
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
    source: "csv",
    integrity: { level: "medium", tabSwitches: 3, faceDetected: true, audioSilence: false },
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
    atsId: "ASH-1234",
    source: "csv",
    integrity: { level: "high", tabSwitches: 0, faceDetected: true, audioSilence: false },
  },
  {
    id: "7",
    candidateName: "David Chen",
    email: "david.c@email.com",
    jobTitle: "Product Manager",
    interviewType: "audio",
    status: "not_started",
    source: "manual",
  },
  {
    id: "8",
    candidateName: "Lisa Wang",
    email: "lisa.w@email.com",
    jobTitle: "UX Designer",
    interviewType: "text",
    status: "completed",
    completedAt: "5 hours ago",
    duration: "18m 30s",
    score: 65,
    atsId: "WK-9999",
    source: "csv",
    integrity: { level: "low", tabSwitches: 8, faceDetected: false, audioSilence: true },
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

const integrityConfig = {
  high: {
    icon: ShieldCheck,
    label: "High",
    className: "text-success bg-success/10",
  },
  medium: {
    icon: Shield,
    label: "Medium",
    className: "text-warning bg-warning/10",
  },
  low: {
    icon: ShieldAlert,
    label: "Review",
    className: "text-destructive bg-destructive/10",
  },
};

const InterviewMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const filteredInterviews = mockInterviews.filter((interview) => {
    const matchesSearch =
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.atsId?.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  const toggleSelectAll = () => {
    if (selectedCandidates.length === filteredInterviews.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredInterviews.map(i => i.id));
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedCandidates.length} candidates`);
    setSelectedCandidates([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 md:py-8 px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">AI Interview Monitoring</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track candidate progress and AI evaluation results
              </p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as JSON</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Download All PDF Reports</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCandidates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
            >
              <span className="text-sm font-medium">
                {selectedCandidates.length} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("Shortlist")}>
                  Shortlist
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("Reject")}>
                  Reject
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      Export Selected
                      <ChevronDown className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction("CSV Export")}>CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("JSON Export")}>JSON</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("PDF Export")}>PDF Reports</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="ghost" onClick={() => setSelectedCandidates([])}>
                  Clear
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
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
              placeholder="Search by name, email, or ATS ID..."
              className="pl-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
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
            <SelectTrigger className="w-full sm:w-[160px]">
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
                  <th className="text-left px-4 md:px-6 py-4 w-10">
                    <Checkbox 
                      checked={selectedCandidates.length === filteredInterviews.length && filteredInterviews.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-4">
                    Candidate
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-4 hidden lg:table-cell">
                    Position
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-4 hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-4 hidden xl:table-cell">
                    Integrity
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-4">
                    Score
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-4 hidden sm:table-cell">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInterviews.map((interview) => {
                  const TypeIcon = typeIcons[interview.interviewType];
                  const statusInfo = statusConfig[interview.status];
                  const StatusIcon = statusInfo.icon;
                  const integrityInfo = interview.integrity ? integrityConfig[interview.integrity.level] : null;
                  const IntegrityIcon = integrityInfo?.icon;

                  return (
                    <tr
                      key={interview.id}
                      className={`hover:bg-muted/30 transition-colors ${selectedCandidates.includes(interview.id) ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-4 md:px-6 py-4">
                        <Checkbox 
                          checked={selectedCandidates.includes(interview.id)}
                          onCheckedChange={() => toggleCandidate(interview.id)}
                        />
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div>
                          <div className="font-medium text-sm md:text-base">{interview.candidateName}</div>
                          <div className="text-xs md:text-sm text-muted-foreground">
                            {interview.email}
                          </div>
                          {interview.atsId && (
                            <div className="flex items-center gap-1 mt-1">
                              <Database className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] md:text-xs text-muted-foreground font-mono">
                                {interview.atsId}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.jobTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <span className={statusInfo.className}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden xl:table-cell">
                        {integrityInfo && IntegrityIcon ? (
                          <Badge variant="secondary" className={`gap-1 text-xs ${integrityInfo.className}`}>
                            <IntegrityIcon className="h-3 w-3" />
                            {integrityInfo.label}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {interview.score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 md:w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full ai-gradient"
                                style={{ width: `${interview.score}%` }}
                              />
                            </div>
                            <span className="text-xs md:text-sm font-medium">{interview.score}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          {interview.status === "completed" && (
                            <Link to={`/report/${interview.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                                <ExternalLink className="h-3.5 w-3.5" />
                                View Report
                              </Button>
                            </Link>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => toast.info(`Viewing details for ${interview.candidateName}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(interview.email);
                                toast.success("Email copied to clipboard");
                              }}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {interview.status === "not_started" && (
                                <DropdownMenuItem onClick={() => toast.success(`Reminder sent to ${interview.candidateName}`)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Reminder
                                </DropdownMenuItem>
                              )}
                              {interview.status === "completed" && (
                                <>
                                  <DropdownMenuItem onClick={() => toast.success(`${interview.candidateName} shortlisted`)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    Shortlist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.info(`Re-evaluating ${interview.candidateName}`)}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Re-evaluate
                                  </DropdownMenuItem>
                                </>
                              )}
                              {interview.status !== "completed" && (
                                <DropdownMenuItem onClick={() => toast.warning(`Interview cancelled for ${interview.candidateName}`)}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Cancel Interview
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => toast.error(`${interview.candidateName} removed from campaign`)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

        {/* Integrity Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 rounded-lg bg-muted/50 border border-dashed"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Interview Integrity</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            AI monitors interview integrity without invasive surveillance. Flags are for your review, not automatic disqualification.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span>High: No concerns detected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-warning" />
              <span>Medium: Minor flags (e.g., tab switches)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
              <span>Review: Multiple flags require attention</span>
            </div>
          </div>
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
    <div className="rounded-lg bg-card border border-border p-3 md:p-4">
      <div className={`text-xl md:text-2xl font-semibold ${valueColors[variant]}`}>{value}</div>
      <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default InterviewMonitoring;