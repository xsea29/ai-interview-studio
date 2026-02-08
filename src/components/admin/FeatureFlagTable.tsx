import { Info, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  typeConfig,
  availabilityConfig,
  categoryConfig,
  type FeatureFlag,
} from "@/lib/featureFlagConfig";

interface FeatureFlagTableProps {
  features: FeatureFlag[];
  allFeatures: FeatureFlag[];
  onToggle: (id: string) => void;
}

export function FeatureFlagTable({ features, allFeatures, onToggle }: FeatureFlagTableProps) {
  const getDependencyStatus = (flag: FeatureFlag): "met" | "unmet" | "none" => {
    if (!flag.dependsOn || flag.dependsOn.length === 0) return "none";
    const allMet = flag.dependsOn.some((depId) => {
      const dep = allFeatures.find((f) => f.id === depId);
      return dep?.enabled;
    });
    return allMet ? "met" : "unmet";
  };

  if (features.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No features match your search.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[260px]">Feature</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[130px]">Category</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="w-[130px]">Availability</TableHead>
          <TableHead className="w-[90px] text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => {
          const depStatus = getDependencyStatus(feature);
          const catCfg = categoryConfig[feature.category];

          return (
            <TableRow key={feature.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{feature.name}</span>
                  {feature.dependsOn && feature.dependsOn.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Link2
                          className={`h-3.5 w-3.5 ${
                            depStatus === "unmet"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Depends on:{" "}
                          {feature.dependsOn
                            .map((id) => allFeatures.find((f) => f.id === id)?.name ?? id)
                            .join(" or ")}
                          {depStatus === "unmet" && (
                            <span className="block mt-1 text-destructive">
                              ⚠ Dependency not enabled
                            </span>
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[280px] truncate">
                {feature.description}
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">{catCfg.label}</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={typeConfig[feature.type].className}>
                  {typeConfig[feature.type].label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={availabilityConfig[feature.availability].className}
                >
                  {availabilityConfig[feature.availability].label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => onToggle(feature.id)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
