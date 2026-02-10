import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getPlanPrice, type PlanType } from "@/lib/planFeatureConfig";
import { initialFeatures } from "@/lib/featureFlagConfig";
import { getDefaultFeaturesForPlan } from "@/lib/planFeatureConfig";

export interface Organization {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  plan: string;
  status: string;
  owner_email: string | null;
  data_residency: string | null;
  retention_days: number | null;
  sso_enabled: boolean | null;
  consent_configured: boolean | null;
  gdpr_compliant: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface OrgFeatureOverride {
  id: string;
  organization_id: string;
  feature_name: string;
  enabled: boolean;
  overridden_by: string | null;
  overridden_at: string | null;
}

export interface OrgBilling {
  id: string;
  organization_id: string;
  plan: string;
  billing_cycle: string;
  amount: number;
  next_billing_date: string | null;
  status: string;
  auto_renew: boolean | null;
  recipient_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureAuditEntry {
  id: string;
  organization_id: string | null;
  feature_name: string;
  old_value: boolean | null;
  new_value: boolean | null;
  changed_by: string | null;
  change_type: string;
  created_at: string;
}

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Organization[];
    },
  });
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Organization;
    },
    enabled: !!id,
  });
}

export function useOrgBilling(orgId: string | undefined) {
  return useQuery({
    queryKey: ["org-billing", orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase
        .from("organization_billing")
        .select("*")
        .eq("organization_id", orgId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return (data as OrgBilling) || null;
    },
    enabled: !!orgId,
  });
}

export function useOrgFeatureOverrides(orgId: string | undefined) {
  return useQuery({
    queryKey: ["org-feature-overrides", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("organization_feature_overrides")
        .select("*")
        .eq("organization_id", orgId);
      if (error) throw error;
      return data as OrgFeatureOverride[];
    },
    enabled: !!orgId,
  });
}

export function useFeatureAuditLog(orgId: string | undefined) {
  return useQuery({
    queryKey: ["feature-audit", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("feature_change_audit")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as FeatureAuditEntry[];
    },
    enabled: !!orgId,
  });
}

export interface CreateOrgInput {
  name: string;
  domain: string;
  industry: string;
  size: string;
  plan: PlanType;
  ownerEmail: string;
  billingCycle: "monthly" | "annual";
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrgInput) => {
      // 1. Create the organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: input.name,
          domain: input.domain || null,
          industry: input.industry || null,
          size: input.size || null,
          plan: input.plan,
          status: "pending-activation",
          owner_email: input.ownerEmail || null,
          sso_enabled: input.plan === "enterprise",
          retention_days: input.plan === "starter" ? 90 : input.plan === "professional" ? 180 : 365,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Create billing record
      const price = getPlanPrice(input.plan, input.billingCycle);
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + (input.billingCycle === "annual" ? 12 : 1));

      const { error: billError } = await supabase
        .from("organization_billing")
        .insert({
          organization_id: org.id,
          plan: input.plan,
          billing_cycle: input.billingCycle,
          amount: price,
          next_billing_date: nextBilling.toISOString().split("T")[0],
          status: "active",
          auto_renew: true,
          recipient_email: input.ownerEmail || null,
        });

      if (billError) throw billError;

      // 3. Create feature overrides for plan-specific features
      const planFeatures = getDefaultFeaturesForPlan(input.plan);
      const overrides = initialFeatures
        .filter((f) => planFeatures[f.id] !== f.enabled)
        .map((f) => ({
          organization_id: org.id,
          feature_name: f.id,
          enabled: planFeatures[f.id],
        }));

      if (overrides.length > 0) {
        const { error: featureError } = await supabase
          .from("organization_feature_overrides")
          .insert(overrides);
        if (featureError) throw featureError;
      }

      // 4. Generate invite token and create onboarding_invites record
      let inviteToken: string | null = null;
      if (input.ownerEmail) {
        inviteToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error: inviteError } = await supabase
          .from("onboarding_invites")
          .insert({
            organization_id: org.id,
            email: input.ownerEmail,
            token: inviteToken,
            status: "pending",
            created_by: user?.id || null,
          });

        if (inviteError) {
          console.error("Failed to create invite:", inviteError);
          inviteToken = null;
        } else {
          // 5. Try to send invite email (non-blocking)
          supabase.functions
            .invoke("send-invite-email", {
              body: {
                email: input.ownerEmail,
                organizationName: input.name,
                token: inviteToken,
                baseUrl: window.location.origin,
              },
            })
            .then(({ error }) => {
              if (error) console.warn("Email send failed (non-critical):", error);
            });
        }
      }

      return { ...org, inviteToken } as Organization & { inviteToken: string | null };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Organization> }) => {
      const { data, error } = await supabase
        .from("organizations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Organization;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization", data.id] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("organizations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete organization: ${error.message}`);
    },
  });
}

export function useToggleFeatureOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      featureName,
      enabled,
      userId,
    }: {
      orgId: string;
      featureName: string;
      enabled: boolean;
      userId?: string;
    }) => {
      // Upsert the override
      const { error: overrideError } = await supabase
        .from("organization_feature_overrides")
        .upsert(
          {
            organization_id: orgId,
            feature_name: featureName,
            enabled,
            overridden_by: userId || null,
            overridden_at: new Date().toISOString(),
          },
          { onConflict: "organization_id,feature_name" }
        );
      if (overrideError) throw overrideError;

      // Log the change
      const { error: auditError } = await supabase
        .from("feature_change_audit")
        .insert({
          organization_id: orgId,
          feature_name: featureName,
          old_value: !enabled,
          new_value: enabled,
          changed_by: userId || null,
          change_type: "org_override",
        });
      if (auditError) console.error("Audit log failed:", auditError);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["org-feature-overrides", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["feature-audit", variables.orgId] });
      toast.success("Feature override updated");
    },
    onError: (error) => {
      toast.error(`Failed to update feature: ${error.message}`);
    },
  });
}
