import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_CHARS = 2000;
const ANON_WINDOW_MINUTES = 60;
const ANON_LIMIT = 3;

function sanitizeText(input: string): string {
  return input
    .replace(/<script[\s>][\s\S]*?<\/script>/gi, "")
    .replace(/<\/?\w+[^>]*>/g, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (text.length > MAX_CHARS) {
      return new Response(JSON.stringify({ error: `Text too long. Maximum ${MAX_CHARS} characters.` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit by IP (anonymous tool)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode("tone-" + ip));
    const ipHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

    const windowStart = new Date(Date.now() - ANON_WINDOW_MINUTES * 60 * 1000).toISOString();

    const { data: entry } = await adminClient
      .from("anon_rate_limits")
      .select("request_count, window_start")
      .eq("ip_hash", ipHash)
      .single();

    if (entry && new Date(entry.window_start).toISOString() > windowStart) {
      if (entry.request_count >= ANON_LIMIT) {
        return new Response(
          JSON.stringify({
            error: "Rate limit reached",
            message: "You've used all free checks this hour. Sign up for unlimited access!",
            limit_reached: true,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      await adminClient
        .from("anon_rate_limits")
        .update({ request_count: entry.request_count + 1 })
        .eq("ip_hash", ipHash);
    } else {
      await adminClient
        .from("anon_rate_limits")
        .upsert({ ip_hash: ipHash, request_count: 1, window_start: new Date().toISOString() }, { onConflict: "ip_hash" });
    }

    // AI tone analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert email communication analyst. Analyze the tone of the given email text and provide actionable feedback.

You must respond using the "analyze_tone" tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze the tone of this email. Identify the dominant tone, confidence level, professionalism score, and provide specific suggestions for improvement.\n\n<user_input>${text.trim()}</user_input>`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_tone",
              description: "Return the tone analysis results",
              parameters: {
                type: "object",
                properties: {
                  dominant_tone: {
                    type: "string",
                    description: "The primary tone detected (e.g., Formal, Friendly, Aggressive, Passive, Confident, Uncertain, Diplomatic, Urgent)",
                  },
                  tone_breakdown: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tone: { type: "string", description: "Tone label" },
                        percentage: { type: "number", description: "Percentage of this tone in the text (0-100)" },
                      },
                      required: ["tone", "percentage"],
                    },
                    description: "Breakdown of detected tones with percentages",
                  },
                  professionalism_score: {
                    type: "number",
                    description: "Score from 1-10 for how professional the email sounds",
                  },
                  clarity_score: {
                    type: "number",
                    description: "Score from 1-10 for how clear and easy to understand the email is",
                  },
                  confidence_level: {
                    type: "string",
                    description: "How confident the writer sounds: Low, Medium, or High",
                  },
                  impression: {
                    type: "string",
                    description: "A one-sentence summary of how the recipient would likely perceive this email",
                  },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        issue: { type: "string", description: "What could be improved" },
                        example: { type: "string", description: "A specific rewrite suggestion" },
                      },
                      required: ["issue", "example"],
                    },
                    description: "2-4 actionable suggestions to improve the email's tone",
                  },
                },
                required: ["dominant_tone", "tone_breakdown", "professionalism_score", "clarity_score", "confidence_level", "impression", "suggestions"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_tone" } },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", errText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No analysis returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    // Sanitize string fields
    analysis.dominant_tone = sanitizeText(analysis.dominant_tone);
    analysis.confidence_level = sanitizeText(analysis.confidence_level);
    analysis.impression = sanitizeText(analysis.impression);
    if (analysis.suggestions) {
      analysis.suggestions = analysis.suggestions.map((s: any) => ({
        issue: sanitizeText(s.issue),
        example: sanitizeText(s.example),
      }));
    }
    if (analysis.tone_breakdown) {
      analysis.tone_breakdown = analysis.tone_breakdown.map((t: any) => ({
        tone: sanitizeText(t.tone),
        percentage: Number(t.percentage),
      }));
    }

    return new Response(JSON.stringify({ success: true, analysis }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in tone-checker:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Analysis failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
