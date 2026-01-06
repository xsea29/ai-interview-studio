import { motion } from "framer-motion";
import { Users, MessageSquare, CheckCircle, Clock } from "lucide-react";

const stats = [
  {
    label: "Total Candidates",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    label: "Active Interviews",
    value: "38",
    change: "5 today",
    changeType: "neutral" as const,
    icon: MessageSquare,
  },
  {
    label: "Completed",
    value: "892",
    change: "98% rate",
    changeType: "positive" as const,
    icon: CheckCircle,
  },
  {
    label: "Avg. Duration",
    value: "12m",
    change: "-2m vs avg",
    changeType: "positive" as const,
    icon: Clock,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="rounded-lg sm:rounded-xl bg-card border border-border p-3 sm:p-5 card-elevated"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-primary" />
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${
                stat.changeType === "positive"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-semibold tracking-tight">{stat.value}</div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
