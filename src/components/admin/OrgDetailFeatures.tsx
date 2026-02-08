import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  initialFeatures,
  categoryConfig,
  type FeatureFlag,
  type FeatureFlagCategory,
} from "@/lib/featureFlagConfig";
import { getDefaultFeaturesForPlan, type PlanType } from "@/lib/planFeatureConfig";
import {
  useOrgFeatureOverrides,
  useToggleFeatureOverride,
  type Organization,
} from "@/hooks/useOrganizations";
import { useAuth } from "@/auth/useAuth";

interface OrgDetailFeaturesProps {
  org: Organization;
}

export function OrgDetailFeatures({ org }: OrgDetailFeaturesProps) {
  const { user } = useAuth();
  const { data: overrides = [], isLoading } = useOrgFeatureOverrides(org.id);
  const toggleMutation = useToggleFeatureOverride();
  const [confirmFeature, setConfirmFeature] = useState<{ id: string; newValue: boolean } | null>(null);
  const [activeCategory, setActiveCategory] = useState<FeatureFlagCategory | "all">("all");

  const planDefaults = getDefaultFeaturesForPlan(org.plan as PlanType);
  const overrideMap = Object.fromEntries(overrides.map((o) => [o.feature_name, o.enabled]));

  const getEffectiveValue = (featureId: string): boolean => {
    if (overrideMap[featureId] !== undefined) return overrideMap[featureId];
    return planDefaults[featureId] ?? false;
  };

  const isOverridden = (featureId: string): boolean => {
    return overrideMap[featureId] !== undefined;
  };

  const handleToggle = (featureId: string) => {
    const current = getEffectiveValue(featureId);
    setConfirmFeature({ id: featureId, newValue: !current });
  };

  const confirmToggle = () => {
    if (!confirmFeature) return;
    toggleMutation.mutate({
      orgId: org.id,
      featureName: confirmFeature.id,
      enabled: confirmFeature.newValue,
      userId: user?.id,
    });
    setConfirmFeature(null);
  };

  const filteredFeatures =
    activeCategory === "all"
      ? initialFeatures
      : initialFeatures.filter((f) => f.category === activeCategory);

  const enabledCount = initialFeatures.filter((f) => getEffectiveValue(f.id)).length;

  const categories: { key: FeatureFlagCategory | "all"; label: string }[] = [
    { key: "all", label: "All" },
    ...Object.entries(categoryConfig).map(([key, cfg]) => ({
      key: key as FeatureFlagCategory,
      label: cfg.label,
    })),
  ];

  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading features...
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>
                {enabledCount} of {initialFeatures.length} features enabled • Plan:{" "}
                <span className="capitalize font-medium">{org.plan}</span>
              </CardDescription>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Plan Default</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeatures.map((feature) => {
                const effective = getEffectiveValue(feature.id);
                const overridden = isOverridden(feature.id);
                const planDefault = planDefaults[feature.id] ?? false;
                return (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {categoryConfig[feature.category].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {planDefault ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </TableCell>
                    <TableCell>
                      {overridden ? (
                        <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30 text-xs">
                          Overridden
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Inherited
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={effective}
                        onCheckedChange={() => handleToggle(feature.id)}
                        disabled={toggleMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmFeature} onOpenChange={() => setConfirmFeature(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Override Feature</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmFeature && (
                <>
                  You are about to{" "}
                  <strong>{confirmFeature.newValue ? "enable" : "disable"}</strong>{" "}
                  <strong>
                    {initialFeatures.find((f) => f.id === confirmFeature.id)?.name}
                  </strong>{" "}
                  for <strong>{org.name}</strong>. This overrides the plan default and will be logged
                  in the audit trail.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>Confirm Override</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
