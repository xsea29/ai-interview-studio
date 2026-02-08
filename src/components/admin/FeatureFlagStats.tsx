import { Flag, FlaskConical, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { FeatureFlag } from "@/lib/featureFlagConfig";

interface FeatureFlagStatsProps {
  features: FeatureFlag[];
}

export function FeatureFlagStats({ features }: FeatureFlagStatsProps) {
  const enabledCount = features.filter((f) => f.enabled).length;
  const betaCount = features.filter((f) => f.type === "beta").length;
  const internalCount = features.filter((f) => f.type === "internal").length;

  const stats = [
    {
      label: "Enabled Features",
      value: enabledCount,
      valueClass: "text-success",
      icon: Flag,
      iconClass: "text-success",
      bgClass: "bg-success/10",
    },
    {
      label: "Beta Features",
      value: betaCount,
      valueClass: "text-warning",
      icon: FlaskConical,
      iconClass: "text-warning",
      bgClass: "bg-warning/10",
    },
    {
      label: "Internal / Testing",
      value: internalCount,
      valueClass: "text-muted-foreground",
      icon: Eye,
      iconClass: "text-muted-foreground",
      bgClass: "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-semibold mt-1 ${s.valueClass}`}>{s.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${s.bgClass} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.iconClass}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
