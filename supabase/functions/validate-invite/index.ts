import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find invite by token
    const { data: invite, error: inviteError } = await supabase
      .from("onboarding_invites")
      .select("*, organizations(id, name, plan, domain, industry, size, status)")
      .eq("token", token)
      .maybeSingle();

    if (inviteError) throw inviteError;

    if (!invite) {
      return new Response(JSON.stringify({ error: "Invalid invite token" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (invite.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "Invite has already been used", status: invite.status }),
        { status: 410, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (new Date(invite.expires_at) < new Date()) {
      // Mark as expired
      await supabase
        .from("onboarding_invites")
        .update({ status: "expired" })
        .eq("id", invite.id);

      return new Response(JSON.stringify({ error: "Invite has expired" }), {
        status: 410,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get feature overrides for the org
    const { data: features } = await supabase
      .from("organization_feature_overrides")
      .select("feature_name, enabled")
      .eq("organization_id", invite.organization_id);

    return new Response(
      JSON.stringify({
        email: invite.email,
        organization: invite.organizations,
        features: features || [],
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in validate-invite:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
