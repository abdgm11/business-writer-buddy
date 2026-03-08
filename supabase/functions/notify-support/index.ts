import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "support@proseai.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Missing authorization header");

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claimsData?.claims) throw new Error("Unauthorized");

    const userEmail = claimsData.claims.email as string || "unknown";
    const userId = claimsData.claims.sub as string;

    const { category, subject, message } = await req.json();
    if (!category || !subject || !message) {
      throw new Error("Missing required fields");
    }

    // Send confirmation to user
    const userEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ProseAI Support <onboarding@resend.dev>",
        to: [userEmail],
        subject: `We received your support request: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: #1a1f36; padding: 20px 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #d4a843; margin: 0; font-size: 20px;">✨ ProseAI Support</h1>
            </div>
            <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi there,</p>
              <p style="color: #374151; font-size: 15px; line-height: 1.6;">We've received your support request and will get back to you within <strong>24 hours</strong>.</p>
              <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px;"><strong>Category:</strong> ${category}</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0;"><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}</p>
              </div>
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">Thank you for reaching out. We're here to help!</p>
              <p style="color: #6b7280; font-size: 13px;">— The ProseAI Team</p>
            </div>
          </div>
        `,
      }),
    });

    // Send alert to admin
    const adminEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ProseAI Tickets <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `[Ticket] ${category}: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1f36; margin: 0 0 16px;">New Support Ticket</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;"><strong>From</strong></td><td style="padding: 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb;">${userEmail}</td></tr>
              <tr><td style="padding: 8px; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;"><strong>User ID</strong></td><td style="padding: 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb;">${user.id}</td></tr>
              <tr><td style="padding: 8px; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;"><strong>Category</strong></td><td style="padding: 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb;">${category}</td></tr>
              <tr><td style="padding: 8px; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;"><strong>Subject</strong></td><td style="padding: 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb;">${subject}</td></tr>
            </table>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
      }),
    });

    const [userRes, adminRes] = await Promise.all([userEmailPromise, adminEmailPromise]);

    if (!userRes.ok) {
      const err = await userRes.text();
      console.error("User email failed:", err);
    }
    if (!adminRes.ok) {
      const err = await adminRes.text();
      console.error("Admin email failed:", err);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in notify-support:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
