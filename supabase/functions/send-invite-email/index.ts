import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.warn("RESEND_API_KEY not configured, skipping email send");
      return new Response(
        JSON.stringify({ success: false, skipped: true, reason: "RESEND_API_KEY not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, organizationName, token, baseUrl } = await req.json();

    if (!email || !organizationName || !token) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const joinUrl = `${baseUrl || "https://interview-flux-ai.lovable.app"}/onboarding/join/${token}`;

    const resend = new Resend(resendKey);
    const emailResponse = await resend.emails.send({
      from: "InterviewFlux <noreply@resend.dev>",
      to: [email],
      subject: `You're invited to join ${organizationName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Welcome to ${organizationName}</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
            You've been invited to set up your organization on InterviewFlux AI. Click the button below to get started.
          </p>
          <a href="${joinUrl}" style="display: inline-block; background: #00b8d4; color: #1a1a2e; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px;">
            Get Started
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 32px;">
            This link expires in 72 hours. If you didn't expect this email, you can safely ignore it.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-invite-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
