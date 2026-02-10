

# Corrected Admin-to-Onboarding Flow

## What Needs Correction

The proposed 10-step scenario has several issues when mapped to the actual platform architecture (Supabase Auth, existing triggers, RLS policies). Here is what changes:

---

## Corrections Summary

### 1. Steps 6-7: Account Creation Must Use Supabase Auth
The proposed flow describes a custom user creation endpoint (`/api/v1/onboarding/join-organization`). This is incorrect. The platform already uses Supabase Auth with existing database triggers:
- `handle_new_user_create_profile` -- auto-creates a profile row on signup
- `handle_new_user_assign_default_role` -- auto-assigns the `client_user` role

Account creation must use `supabase.auth.signUp()`, not a custom endpoint.

### 2. Steps 8-9: Email Verification Should Use Supabase Auth's Native Flow
The proposed flow describes a custom 6-digit OTP code system (`/api/v1/auth/verify-email`). This is unnecessary complexity. Supabase Auth handles email verification natively:
- On `signUp()`, Supabase sends a verification email automatically
- The user clicks the link in the email and is redirected back verified
- No custom OTP implementation needed

### 3. Steps 3-4: Token Validation Should Be an Edge Function
The proposed `validate-invite?token=abc123` should be a Supabase edge function, not a generic REST API, matching the platform's serverless architecture.

### 4. Missing: Organization Membership Table
There is no table linking users to organizations. A new `organization_members` table is needed to track which users belong to which organization and their role within it.

### 5. Missing: Onboarding Invites Table
There is no database table to store invitation tokens. A new `onboarding_invites` table is needed with token, expiry, and status tracking.

---

## Corrected Flow (10 Steps)

```text
Step 1: ADMIN creates organization
        Database writes:
        - organizations (status: pending-activation)
        - organization_billing
        - organization_feature_overrides
        - onboarding_invites (token, email, expires in 72h)
        Edge function: send-invite-email (sends link via Resend)

Step 2: EMAIL delivered to owner
        Contains: /onboarding/join/{token}
        Token expires in 72 hours

Step 3: OWNER clicks link
        Browser loads: /onboarding/join/{token} (PUBLIC route, no auth required)
        Frontend calls edge function: validate-invite

Step 4: EDGE FUNCTION validates token
        Checks: token exists, not expired, status = pending
        Returns: organization name, plan, features, email

Step 5: FRONTEND shows organization preview
        Displays: "Join Acme Corp"
        Shows: plan name, feature count, organization details
        Button: "Get Started"

Step 6: FRONTEND shows signup form
        Fields: First name, Last name, Password
        Email: pre-filled from invite (read-only)
        Action: supabase.auth.signUp() with email + password

Step 7: SUPABASE AUTH handles account creation
        Creates auth.users entry
        Trigger fires: handle_new_user_create_profile (creates profile)
        Trigger fires: handle_new_user_assign_default_role (assigns client_user)
        Supabase sends verification email automatically

Step 8: FRONTEND shows "Check your email"
        Owner opens email, clicks verification link
        Supabase verifies email, redirects to /onboarding/join/{token}?verified=true
        Auth state updates, user is now verified

Step 9: FRONTEND links user to organization
        Calls edge function: accept-invite
        Edge function:
        - Creates organization_members record (user_id, org_id, role: owner)
        - Updates onboarding_invites status to "accepted"
        - Updates profile with organization reference
        Redirects to: /onboarding/{orgId}

Step 10: OWNER completes dynamic onboarding (phases 2-7)
         Steps shown/hidden based on organization's enabled features
         On completion: org status changes to "active"
         Redirect to: / (dashboard)
```

---

## Database Changes Required

### New Table: `onboarding_invites`
| Column          | Type        | Notes                                |
|-----------------|-------------|--------------------------------------|
| id              | uuid (PK)   | auto-generated                       |
| organization_id | uuid (FK)   | references organizations(id)         |
| email           | text        | owner's email address                |
| token           | text        | unique random token                  |
| status          | text        | pending / accepted / expired         |
| expires_at      | timestamptz | 72 hours from creation               |
| created_by      | uuid        | admin user who created the invite    |
| created_at      | timestamptz | auto                                 |

RLS: Platform admins can insert/view. Public can read by token (for validation).

### New Table: `organization_members`
| Column          | Type        | Notes                                |
|-----------------|-------------|--------------------------------------|
| id              | uuid (PK)   | auto-generated                       |
| organization_id | uuid (FK)   | references organizations(id)         |
| user_id         | uuid        | references auth.users(id)            |
| role            | text        | owner / admin / recruiter / viewer   |
| created_at      | timestamptz | auto                                 |

RLS: Members can view their own org. Platform admins can view all.

### Update `profiles` Table
Add column: `organization_id` (uuid, nullable) -- quick lookup for which org a user belongs to.

---

## Edge Functions Required

### 1. `send-invite-email`
- Called after org creation from the admin frontend
- Requires `RESEND_API_KEY` secret
- Sends email with `/onboarding/join/{token}` link
- Returns success/failure

### 2. `validate-invite`
- Called when owner visits `/onboarding/join/{token}`
- Public endpoint (no auth required)
- Validates token existence, expiry, and status
- Returns organization details (name, plan, features, email)

### 3. `accept-invite`
- Called after owner signs up and verifies email
- Requires auth (owner must be logged in)
- Creates `organization_members` record
- Updates invite status to "accepted"
- Updates profile with organization reference

---

## Frontend Routes

| Route                       | Auth Required | Component             |
|-----------------------------|---------------|-----------------------|
| `/onboarding/join/:token`   | No            | InviteJoinPage (NEW)  |
| `/onboarding/:orgId`        | Yes           | CompanyOnboarding (UPDATED) |

### InviteJoinPage States
1. **Loading** -- validating token
2. **Invalid/Expired** -- error message with contact info
3. **Preview** -- shows org details, "Get Started" button
4. **Signup Form** -- name + password fields, email pre-filled
5. **Verify Email** -- "Check your email" screen
6. **Redirect** -- after verification, calls accept-invite, redirects to onboarding

### CompanyOnboarding Updates
- Accept `orgId` param to load organization data
- Fetch enabled features for the org
- Dynamically show/hide phases based on features:
  - Domain Verification: only if `custom-domain` feature enabled
  - Brand Identity: only if `white-label` feature enabled
  - Integrations: only if `ats-api-sync` or `webhooks` enabled
  - Always show: Organization Setup, Billing, Team, Privacy

---

## Implementation Order

1. **Database migration** -- Create `onboarding_invites` and `organization_members` tables with RLS policies. Add `organization_id` to `profiles`.

2. **Edge functions** -- Build `validate-invite`, `accept-invite`, and `send-invite-email` (requires Resend API key).

3. **InviteJoinPage** -- New page with token validation, signup form, email verification, and org linking.

4. **Update CompanyOnboarding** -- Make it org-aware and feature-driven with dynamic phase rendering.

5. **Wire admin flow** -- Update `useCreateOrganization` to generate invite token and call `send-invite-email`. Show the invite link in the success screen as a fallback.

6. **Route updates** -- Add `/onboarding/join/:token` (public) and update `/onboarding/:orgId` (auth required).

---

## Pre-requisite

Before implementing the email sending, a **Resend API key** is needed. The `send-invite-email` edge function will use Resend to deliver invitation emails. The invite link will also be shown directly in the admin success screen so the flow can be tested without email.

