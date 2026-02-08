import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  initialFeatures,
  categoryConfig,
  type FeatureFlag,
  type FeatureFlagCategory,
} from "@/lib/featureFlagConfig";
import { FeatureFlagStats } from "@/components/admin/FeatureFlagStats";
import { FeatureFlagTable } from "@/components/admin/FeatureFlagTable";

const ALL_CATEGORY = "all" as const;
type CategoryFilter = FeatureFlagCategory | typeof ALL_CATEGORY;

export default function FeatureFlags() {
  const [features, setFeatures] = useState<FeatureFlag[]>(initialFeatures);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(ALL_CATEGORY);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
    const feature = features.find((f) => f.id === id);
    if (feature) {
      toast.success(`${feature.name} ${feature.enabled ? "disabled" : "enabled"}`);
    }
  };

  const filteredFeatures = useMemo(() => {
    return features.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === ALL_CATEGORY || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [features, search, activeCategory]);

  // Count features per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: features.length };
    for (const f of features) {
      counts[f.category] = (counts[f.category] || 0) + 1;
    }
    return counts;
  }, [features]);

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: ALL_CATEGORY, label: "All" },
    ...Object.entries(categoryConfig).map(([key, cfg]) => ({
      key: key as FeatureFlagCategory,
      label: cfg.label,
    })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Feature Flags</h1>
        <p className="text-muted-foreground mt-1">
          Toggle platform features globally across all organizations
        </p>
      </div>

      {/* Stats */}
      <FeatureFlagStats features={features} />

      {/* Search + Category Filter */}
      <Card className="card-elevated">
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
                <Badge
                  variant="secondary"
                  className={`ml-0.5 h-4 min-w-4 px-1 text-[10px] ${
                    activeCategory === cat.key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : ""
                  }`}
                >
                  {categoryCounts[cat.key] ?? 0}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Table */}
      <Card className="card-elevated">
        <FeatureFlagTable
          features={filteredFeatures}
          allFeatures={features}
          onToggle={toggleFeature}
        />
      </Card>
    </div>
  );
}
