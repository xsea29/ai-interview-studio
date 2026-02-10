

## Add "Resend Invite" Button to Organization Detail Page

### What Changes

**1. New hook: `useResendInvite`** (in `src/hooks/useOrganizations.ts`)
- A `useMutation` hook that calls `supabase.functions.invoke("resend-invite", { body: { organizationId } })`
- On success: shows a toast with the new token info and whether the email was sent
- On error: shows an error toast

**2. Update `OrganizationDetail.tsx`**
- Import `Mail` (or `RefreshCw`) icon from `lucide-react` and the new `useResendInvite` hook
- Add a "Resend Invite" button in the header action bar (next to Export, Suspend, Delete)
- Only show the button when `org.status` is `pending-activation` (the org hasn't been onboarded yet)
- The button calls `resendInvite.mutateAsync(org.id)` and shows loading state via `resendInvite.isPending`
- On success, display a toast with the new invite link so the admin can copy it as a fallback

### Technical Details

```text
Header action buttons (updated order):
[ Export ] [ Resend Invite* ] [ Suspend/Resume ] [ Delete ]

* Only visible when org.status === "pending-activation"
```

**Hook addition** in `useOrganizations.ts`:
```typescript
export function useResendInvite() {
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const { data, error } = await supabase.functions.invoke("resend-invite", {
        body: { organizationId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.emailSent ? "Invite resent successfully" : "New invite link generated (email not configured)");
    },
    onError: (error) => {
      toast.error(`Failed to resend invite: ${error.message}`);
    },
  });
}
```

**Button** in `OrganizationDetail.tsx`:
```typescript
{org.status === "pending-activation" && (
  <Button variant="outline" size="sm" onClick={() => resendInvite.mutateAsync(org.id)} disabled={resendInvite.isPending}>
    <Mail className="h-4 w-4 mr-2" />
    {resendInvite.isPending ? "Sending..." : "Resend Invite"}
  </Button>
)}
```

### Files Modified
- `src/hooks/useOrganizations.ts` -- add `useResendInvite` hook
- `src/pages/admin/OrganizationDetail.tsx` -- add button and import hook
