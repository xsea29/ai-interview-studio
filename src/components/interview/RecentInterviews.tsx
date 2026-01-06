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
      className="rounded-xl bg-card border border-border card-elevated"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">Recent Interviews</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your latest AI interview campaigns
          </p>
        </div>
        <Link to="/interviews">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            View all
            <ExternalLink className="h-3.5 w-3.5" />
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
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{interview.jobTitle}</h3>
                  <StatusBadge status={interview.status} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>{interview.department}</span>
                  <span>•</span>
                  <span>{typeLabels[interview.type]}</span>
                  <span>•</span>
                  <span>{interview.createdAt}</span>
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

              <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
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
