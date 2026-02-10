import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

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
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is platform_admin
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check admin role
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "platform_admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { organizationId } = await req.json();
    if (!organizationId) {
      return new Response(JSON.stringify({ error: "organizationId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Expire all existing pending invites for this org
    const { error: expireError } = await adminClient
      .from("onboarding_invites")
      .update({ status: "expired" })
      .eq("organization_id", organizationId)
      .eq("status", "pending");

    if (expireError) {
      console.error("Failed to expire old invites:", expireError);
      throw new Error("Failed to invalidate old invites");
    }

    // Get org details
    const { data: org, error: orgError } = await adminClient
      .from("organizations")
      .select("name, owner_email")
      .eq("id", organizationId)
      .single();

    if (orgError || !org) {
      return new Response(JSON.stringify({ error: "Organization not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!org.owner_email) {
      return new Response(JSON.stringify({ error: "Organization has no owner email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate new token with 7-day expiry
    const newToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: invite, error: insertError } = await adminClient
      .from("onboarding_invites")
      .insert({
        organization_id: organizationId,
        email: org.owner_email,
        token: newToken,
        status: "pending",
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create new invite:", insertError);
      throw new Error("Failed to create new invite");
    }

    // Send email (non-blocking)
    const baseUrl = req.headers.get("origin") || "https://interview-flux-ai.lovable.app";
    const resendKey = Deno.env.get("RESEND_API_KEY");

    let emailSent = false;
    if (resendKey) {
      try {
        const { Resend } = await import("npm:resend@2.0.0");
        const resend = new Resend(resendKey);
        const joinUrl = `${baseUrl}/onboarding/join/${newToken}`;

        await resend.emails.send({
          from: "InterviewFlux <noreply@resend.dev>",
          to: [org.owner_email],
          subject: `You're invited to join ${org.name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Welcome to ${org.name}</h1>
              <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
                You've been invited to set up your organization on InterviewFlux AI. Click the button below to get started.
              </p>
              <a href="${joinUrl}" style="display: inline-block; background: #00b8d4; color: #1a1a2e; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px;">
                Get Started
              </a>
              <p style="color: #999; font-size: 13px; margin-top: 32px;">
                This link expires in 7 days. If you didn't expect this email, you can safely ignore it.
              </p>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailErr) {
        console.warn("Email send failed (non-critical):", emailErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        token: newToken,
        emailSent,
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in resend-invite:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
