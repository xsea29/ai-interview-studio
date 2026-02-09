
-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE
-- When only RESTRICTIVE policies exist with no PERMISSIVE ones, PostgreSQL denies all access

-- organizations table
DROP POLICY IF EXISTS "Platform admins can view all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Platform admins can insert organizations" ON public.organizations;
DROP POLICY IF EXISTS "Platform admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Platform admins can delete organizations" ON public.organizations;

CREATE POLICY "Platform admins can view all organizations"
  ON public.organizations FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can insert organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can update organizations"
  ON public.organizations FOR UPDATE
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can delete organizations"
  ON public.organizations FOR DELETE
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

-- organization_billing table
DROP POLICY IF EXISTS "Platform admins can view billing" ON public.organization_billing;
DROP POLICY IF EXISTS "Platform admins can insert billing" ON public.organization_billing;
DROP POLICY IF EXISTS "Platform admins can update billing" ON public.organization_billing;
DROP POLICY IF EXISTS "Platform admins can delete billing" ON public.organization_billing;

CREATE POLICY "Platform admins can view billing"
  ON public.organization_billing FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can insert billing"
  ON public.organization_billing FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can update billing"
  ON public.organization_billing FOR UPDATE
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can delete billing"
  ON public.organization_billing FOR DELETE
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

-- organization_feature_overrides table
DROP POLICY IF EXISTS "Platform admins can view feature overrides" ON public.organization_feature_overrides;
DROP POLICY IF EXISTS "Platform admins can insert feature overrides" ON public.organization_feature_overrides;
DROP POLICY IF EXISTS "Platform admins can update feature overrides" ON public.organization_feature_overrides;
DROP POLICY IF EXISTS "Platform admins can delete feature overrides" ON public.organization_feature_overrides;

CREATE POLICY "Platform admins can view feature overrides"
  ON public.organization_feature_overrides FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can insert feature overrides"
  ON public.organization_feature_overrides FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can update feature overrides"
  ON public.organization_feature_overrides FOR UPDATE
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can delete feature overrides"
  ON public.organization_feature_overrides FOR DELETE
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

-- feature_change_audit table
DROP POLICY IF EXISTS "Platform admins can view audit logs" ON public.feature_change_audit;
DROP POLICY IF EXISTS "Platform admins can insert audit logs" ON public.feature_change_audit;

CREATE POLICY "Platform admins can view audit logs"
  ON public.feature_change_audit FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'::public.app_role));

CREATE POLICY "Platform admins can insert audit logs"
  ON public.feature_change_audit FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'::public.app_role));
