import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  Mic,
  MessageSquare,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Mail,
  Download,
  Users,
  Pause,
  Play,
  Trash2,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type InterviewType = "video" | "audio" | "text";
type InterviewStatus = "active" | "completed" | "draft" | "paused";

interface JobCampaign {
  id: string;
  jobTitle: string;
  department: string;
  type: InterviewType;
  candidateCount: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  status: InterviewStatus;
  createdAt: string;
}

const jobCampaigns: JobCampaign[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    type: "video",
    candidateCount: 24,
    completed: 18,
    inProgress: 4,
    notStarted: 2,
    status: "active",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    jobTitle: "Product Manager",
    department: "Product",
    type: "audio",
    candidateCount: 15,
    completed: 15,
    inProgress: 0,
    notStarted: 0,
    status: "completed",
    createdAt: "1 day ago",
  },
  {
    id: "3",
    jobTitle: "UX Designer",
    department: "Design",
    type: "text",
    candidateCount: 32,
    completed: 28,
    inProgress: 3,
    notStarted: 1,
    status: "active",
    createdAt: "2 days ago",
  },
  {
    id: "4",
    jobTitle: "Data Scientist",
    department: "Analytics",
    type: "video",
    candidateCount: 18,
    completed: 0,
    inProgress: 0,
    notStarted: 18,
    status: "draft",
    createdAt: "3 days ago",
  },
  {
    id: "5",
    jobTitle: "DevOps Engineer",
    department: "Engineering",
    type: "video",
    candidateCount: 12,
    completed: 6,
    inProgress: 2,
    notStarted: 4,
    status: "paused",
    createdAt: "5 days ago",
  },
  {
    id: "6",
    jobTitle: "Marketing Manager",
    department: "Marketing",
    type: "audio",
    candidateCount: 20,
    completed: 20,
    inProgress: 0,
    notStarted: 0,
    status: "completed",
    createdAt: "1 week ago",
  },
];

const typeIcons = {
  video: Video,
  audio: Mic,
  text: MessageSquare,
};

const typeLabels = {
  video: "Video Interview",
  audio: "Audio Interview",
  text: "Text Interview",
};

function StatusBadge({ status }: { status: InterviewStatus }) {
  const styles = {
    active: "status-badge bg-success/10 text-success",
    completed: "status-badge bg-primary/10 text-primary",
    draft: "status-badge status-pending",
    paused: "status-badge bg-warning/10 text-warning",
  };

  const labels = {
    active: "Active",
    completed: "Completed",
    draft: "Draft",
    paused: "Paused",
  };

  return <span className={styles[status]}>{labels[status]}</span>;
}

export default function InterviewJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredCampaigns = jobCampaigns.filter(
    (campaign) =>
      campaign.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: string, campaign: JobCampaign) => {
    switch (action) {
      case "view":
        toast({
          title: "Opening Campaign",
          description: `Viewing details for ${campaign.jobTitle}`,
        });
        break;
      case "send-reminders":
        toast({
          title: "Reminders Sent",
          description: `Sent reminders to ${campaign.notStarted + campaign.inProgress} pending candidates`,
        });
        break;
      case "export":
        toast({
          title: "Export Started",
          description: `Exporting data for ${campaign.jobTitle}`,
        });
        break;
      case "duplicate":
        toast({
          title: "Campaign Duplicated",
          description: `Created a copy of ${campaign.jobTitle}`,
        });
        break;
      case "pause":
        toast({
          title: "Campaign Paused",
          description: `${campaign.jobTitle} has been paused`,
        });
        break;
      case "resume":
        toast({
          title: "Campaign Resumed",
          description: `${campaign.jobTitle} is now active`,
        });
        break;
      case "delete":
        toast({
          title: "Campaign Deleted",
          description: `${campaign.jobTitle} has been removed`,
          variant: "destructive",
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 sm:py-8 px-4 sm:px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Interview Campaigns
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage job-based interview campaigns
            </p>
          </div>
          <Link to="/create">
            <Button className="ai-gradient text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title or department..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total Campaigns
            </p>
            <p className="text-xl sm:text-2xl font-semibold mt-1">
              {jobCampaigns.length}
            </p>
          </div>
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            <p className="text-xl sm:text-2xl font-semibold mt-1 text-success">
              {jobCampaigns.filter((c) => c.status === "active").length}
            </p>
          </div>
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total Candidates
            </p>
            <p className="text-xl sm:text-2xl font-semibold mt-1">
              {jobCampaigns.reduce((sum, c) => sum + c.candidateCount, 0)}
            </p>
          </div>
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Completion Rate
            </p>
            <p className="text-xl sm:text-2xl font-semibold mt-1 text-primary">
              {Math.round(
                (jobCampaigns.reduce((sum, c) => sum + c.completed, 0) /
                  jobCampaigns.reduce((sum, c) => sum + c.candidateCount, 0)) *
                  100
              )}
              %
            </p>
          </div>
        </motion.div>

        {/* Campaigns List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg sm:rounded-xl bg-card border border-border card-elevated"
        >
          <div className="divide-y divide-border">
            {filteredCampaigns.map((campaign, index) => {
              const TypeIcon = typeIcons[campaign.type];
              const progress =
                campaign.candidateCount > 0
                  ? (campaign.completed / campaign.candidateCount) * 100
                  : 0;

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                        {campaign.jobTitle}
                      </h3>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-3 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span className="hidden sm:inline">
                        {campaign.department}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{typeLabels[campaign.type]}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.candidateCount} candidates
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {campaign.createdAt}
                      </span>
                    </div>
                    {/* Mobile progress indicator */}
                    <div className="sm:hidden mt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full ai-gradient transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {campaign.completed}/{campaign.candidateCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-sm font-medium text-success">
                        {campaign.completed}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        In Progress
                      </p>
                      <p className="text-sm font-medium text-warning">
                        {campaign.inProgress}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-sm font-medium text-muted-foreground">
                        {campaign.notStarted}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Progress */}
                  <div className="hidden lg:block w-32">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full ai-gradient transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-popover border border-border"
                    >
                      <DropdownMenuItem
                        onClick={() => handleAction("view", campaign)}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("send-reminders", campaign)}
                        className="cursor-pointer"
                        disabled={
                          campaign.notStarted + campaign.inProgress === 0
                        }
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reminders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("export", campaign)}
                        className="cursor-pointer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("duplicate", campaign)}
                        className="cursor-pointer"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Campaign
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {campaign.status === "paused" ? (
                        <DropdownMenuItem
                          onClick={() => handleAction("resume", campaign)}
                          className="cursor-pointer"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Resume Campaign
                        </DropdownMenuItem>
                      ) : campaign.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => handleAction("pause", campaign)}
                          className="cursor-pointer"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Campaign
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => handleAction("delete", campaign)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              );
            })}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No campaigns found matching your search.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
