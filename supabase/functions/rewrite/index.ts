import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_DAILY_LIMIT = 3;

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: extract user ID from JWT ---
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const claims = decodeJwtPayload(token);
      if (claims) {
        const sub = claims.sub as string | undefined;
        if (sub && claims.aud === "authenticated") {
          const exp = claims.exp as number | undefined;
          if (!exp || exp * 1000 > Date.now()) {
            userId = sub;
          }
        }
      }
    }

    const { text, context, tone } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Plan check: enforce daily limit for free users ---
    if (userId) {
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Check if user has an active pro payment
      const { data: proPayments } = await adminClient
        .from("payments")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "paid")
        .eq("plan", "pro")
        .limit(1);

      const isPro = (proPayments?.length ?? 0) > 0;

      if (!isPro) {
        // Count today's rewrites
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const { count } = await adminClient
          .from("rewrites")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", todayStart.toISOString());

        if ((count ?? 0) >= FREE_DAILY_LIMIT) {
          return new Response(
            JSON.stringify({
              error: "Daily limit reached",
              message: `Free plan allows ${FREE_DAILY_LIMIT} rewrites per day. Upgrade to Pro for unlimited rewrites.`,
              limit_reached: true,
            }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // --- AI rewrite ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const toneInstructions: Record<string, string> = {
      formal: "Use highly formal, board-level professional language. Avoid contractions. Use sophisticated vocabulary.",
      friendly: "Use a warm but professional tone. Approachable yet polished. Light contractions are OK.",
      assertive: "Use direct, confident, and decisive language. Be concise and action-oriented. No hedging.",
      diplomatic: "Use tactful, careful language. Soften negative messages. Focus on solutions. Use hedging phrases like 'it appears' or 'we might consider'.",
    };

    const contextInstructions: Record<string, string> = {
      email: "This is a business email. Use proper salutation conventions and professional email structure.",
      report: "This is a business report. Use objective, data-driven language. Be precise and structured.",
      presentation: "This is for a presentation/speech. Use impactful, clear language. Short sentences for emphasis.",
      linkedin: "This is a LinkedIn post. Professional but personable. Engaging and thought-leadership oriented.",
      slack: "This is a Slack/Teams message. Professional but concise. Casual enough for internal comms but still polished.",
    };

    const systemPrompt = `You are ProseAI, an expert Business English writing coach. Your job is to rewrite text into polished, professional Business English and explain every change you make.

TONE: ${toneInstructions[tone] || toneInstructions.formal}
CONTEXT: ${contextInstructions[context] || contextInstructions.email}

You must respond using the "rewrite_text" tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please rewrite the following text into polished, professional Business English. Identify each specific change you make, showing the original phrase and the improved version, with a brief explanation of why the change improves the writing.\n\nText to rewrite:\n"${text.trim()}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "rewrite_text",
              description: "Return the polished text and a list of corrections with explanations.",
              parameters: {
                type: "object",
                properties: {
                  polished: {
                    type: "string",
                    description: "The fully rewritten, polished version of the text",
                  },
                  corrections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        original: { type: "string", description: "The original phrase from the input" },
                        improved: { type: "string", description: "The improved phrase" },
                        reason: { type: "string", description: "Brief explanation of why this change improves the writing (e.g. grammar rule, tone, clarity)" },
                      },
                      required: ["original", "improved", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["polished", "corrections"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "rewrite_text" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Unexpected AI response format" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("rewrite error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
