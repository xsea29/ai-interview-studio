import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { initialFeatures } from "@/lib/featureFlagConfig";
import { getDefaultFeaturesForPlan, type PlanType } from "@/lib/planFeatureConfig";

/**
 * Hook that resolves feature availability for a given organization.
 * Resolution order: org overrides → plan defaults → platform defaults
 */
export function useFeatureFlag(featureName: string, orgId?: string) {
  const { data: overrides } = useQuery({
    queryKey: ["org-feature-overrides", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("organization_feature_overrides")
        .select("feature_name, enabled")
        .eq("organization_id", orgId);
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
    staleTime: 30_000,
  });

  const { data: org } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase
        .from("organizations")
        .select("plan")
        .eq("id", orgId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
    staleTime: 30_000,
  });

  return useMemo(() => {
    // Check org override first
    const override = overrides?.find((o) => o.feature_name === featureName);
    if (override) return override.enabled;

    // Check plan defaults
    if (org?.plan) {
      const planDefaults = getDefaultFeaturesForPlan(org.plan as PlanType);
      if (planDefaults[featureName] !== undefined) return planDefaults[featureName];
    }

    // Fall back to platform default
    const platformFeature = initialFeatures.find((f) => f.id === featureName);
    return platformFeature?.enabled ?? false;
  }, [featureName, overrides, org]);
}

/**
 * Hook that returns all resolved features for an organization
 */
export function useOrgFeatures(orgId?: string) {
  const { data: overrides } = useQuery({
    queryKey: ["org-feature-overrides", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("organization_feature_overrides")
        .select("feature_name, enabled")
        .eq("organization_id", orgId);
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
    staleTime: 30_000,
  });

  const { data: org } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase
        .from("organizations")
        .select("plan")
        .eq("id", orgId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
    staleTime: 30_000,
  });

  return useMemo(() => {
    const result: Record<string, boolean> = {};
    const overrideMap = Object.fromEntries(
      (overrides || []).map((o) => [o.feature_name, o.enabled])
    );

    const planDefaults = org?.plan
      ? getDefaultFeaturesForPlan(org.plan as PlanType)
      : {};

    for (const f of initialFeatures) {
      if (overrideMap[f.id] !== undefined) {
        result[f.id] = overrideMap[f.id];
      } else if (planDefaults[f.id] !== undefined) {
        result[f.id] = planDefaults[f.id];
      } else {
        result[f.id] = f.enabled;
      }
    }

    return result;
  }, [overrides, org]);
}
