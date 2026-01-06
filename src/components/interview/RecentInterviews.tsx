import { motion } from "framer-motion";
import { MoreHorizontal, Video, Mic, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type InterviewType = "video" | "audio" | "text";
type InterviewStatus = "active" | "completed" | "draft";

interface Interview {
  id: string;
  jobTitle: string;
  department: string;
  type: InterviewType;
  candidateCount: number;
  completed: number;
  status: InterviewStatus;
  createdAt: string;
}

const interviews: Interview[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    type: "video",
    candidateCount: 24,
    completed: 18,
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
    status: "draft",
    createdAt: "3 days ago",
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

export function RecentInterviews() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg sm:rounded-xl bg-card border border-border card-elevated"
    >
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Recent Interviews</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block">
            Your latest AI interview campaigns
          </p>
        </div>
        <Link to="/interviews">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground text-xs sm:text-sm h-8 px-2 sm:px-3">
            View all
            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border">
        {interviews.map((interview, index) => {
          const TypeIcon = typeIcons[interview.type];
          const progress = interview.candidateCount > 0 
            ? (interview.completed / interview.candidateCount) * 100 
            : 0;

          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <TypeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{interview.jobTitle}</h3>
                  <StatusBadge status={interview.status} />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{interview.department}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{typeLabels[interview.type].replace('AI ', '').replace(' Interview', '')}</span>
                  <span>•</span>
                  <span>{interview.createdAt}</span>
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
                      {interview.completed}/{interview.candidateCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block w-32">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {interview.completed}/{interview.candidateCount}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full ai-gradient transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: InterviewStatus }) {
  const styles = {
    active: "status-badge bg-success/10 text-success",
    completed: "status-badge bg-primary/10 text-primary",
    draft: "status-badge status-pending",
  };

  const labels = {
    active: "Active",
    completed: "Completed",
    draft: "Draft",
  };

  return <span className={styles[status]}>{labels[status]}</span>;
}
