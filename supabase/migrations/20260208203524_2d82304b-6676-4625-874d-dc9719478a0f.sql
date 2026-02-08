
-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT,
  plan TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active',
  owner_email TEXT,
  data_residency TEXT DEFAULT 'US',
  retention_days INTEGER DEFAULT 90,
  sso_enabled BOOLEAN DEFAULT false,
  consent_configured BOOLEAN DEFAULT false,
  gdpr_compliant BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view all organizations"
  ON public.organizations FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can insert organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can update organizations"
  ON public.organizations FOR UPDATE
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can delete organizations"
  ON public.organizations FOR DELETE
  USING (public.has_role(auth.uid(), 'platform_admin'));

-- Organization feature overrides
CREATE TABLE public.organization_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  overridden_by UUID,
  overridden_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, feature_name)
);

ALTER TABLE public.organization_feature_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view feature overrides"
  ON public.organization_feature_overrides FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can insert feature overrides"
  ON public.organization_feature_overrides FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can update feature overrides"
  ON public.organization_feature_overrides FOR UPDATE
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can delete feature overrides"
  ON public.organization_feature_overrides FOR DELETE
  USING (public.has_role(auth.uid(), 'platform_admin'));

-- Organization billing
CREATE TABLE public.organization_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  next_billing_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT true,
  recipient_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organization_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view billing"
  ON public.organization_billing FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can insert billing"
  ON public.organization_billing FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can update billing"
  ON public.organization_billing FOR UPDATE
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can delete billing"
  ON public.organization_billing FOR DELETE
  USING (public.has_role(auth.uid(), 'platform_admin'));

-- Feature change audit log
CREATE TABLE public.feature_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  feature_name TEXT NOT NULL,
  old_value BOOLEAN,
  new_value BOOLEAN,
  changed_by UUID,
  change_type TEXT NOT NULL DEFAULT 'org_override',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_change_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view audit logs"
  ON public.feature_change_audit FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_admin'));

CREATE POLICY "Platform admins can insert audit logs"
  ON public.feature_change_audit FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_billing_updated_at
  BEFORE UPDATE ON public.organization_billing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
