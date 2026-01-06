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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="rounded-xl bg-card border border-border p-5 card-elevated"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.changeType === "positive"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
