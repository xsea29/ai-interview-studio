
-- 1. Create onboarding_invites table
CREATE TABLE public.onboarding_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '72 hours'),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Validation trigger for status
CREATE OR REPLACE FUNCTION public.validate_onboarding_invite_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'accepted', 'expired') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_onboarding_invite_status
BEFORE INSERT OR UPDATE ON public.onboarding_invites
FOR EACH ROW EXECUTE FUNCTION public.validate_onboarding_invite_status();

ALTER TABLE public.onboarding_invites ENABLE ROW LEVEL SECURITY;

-- Platform admins can manage invites
CREATE POLICY "Platform admins can insert invites"
ON public.onboarding_invites FOR INSERT
WITH CHECK (has_role(auth.uid(), 'platform_admin'::app_role));

CREATE POLICY "Platform admins can view invites"
ON public.onboarding_invites FOR SELECT
USING (has_role(auth.uid(), 'platform_admin'::app_role));

CREATE POLICY "Platform admins can update invites"
ON public.onboarding_invites FOR UPDATE
USING (has_role(auth.uid(), 'platform_admin'::app_role));

-- Public can read by token (for validation via edge function using service role, so no anon policy needed)

-- 2. Create organization_members table
CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Validation trigger for role
CREATE OR REPLACE FUNCTION public.validate_org_member_role()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.role NOT IN ('owner', 'admin', 'recruiter', 'viewer') THEN
    RAISE EXCEPTION 'Invalid role: %', NEW.role;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_org_member_role
BEFORE INSERT OR UPDATE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.validate_org_member_role();

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Members can view their own org membership
CREATE POLICY "Members can view own org"
ON public.organization_members FOR SELECT
USING (user_id = auth.uid());

-- Platform admins can manage all
CREATE POLICY "Platform admins can view all members"
ON public.organization_members FOR SELECT
USING (has_role(auth.uid(), 'platform_admin'::app_role));

CREATE POLICY "Platform admins can insert members"
ON public.organization_members FOR INSERT
WITH CHECK (has_role(auth.uid(), 'platform_admin'::app_role));

CREATE POLICY "Platform admins can update members"
ON public.organization_members FOR UPDATE
USING (has_role(auth.uid(), 'platform_admin'::app_role));

CREATE POLICY "Platform admins can delete members"
ON public.organization_members FOR DELETE
USING (has_role(auth.uid(), 'platform_admin'::app_role));

-- 3. Add organization_id to profiles
ALTER TABLE public.profiles ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
