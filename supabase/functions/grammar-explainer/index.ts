import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_CHARS = 1000;
const ANON_WINDOW_MINUTES = 60;
const ANON_LIMIT = 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence } = await req.json();

    if (!sentence || typeof sentence !== "string" || sentence.trim().length === 0) {
      return new Response(JSON.stringify({ error: "A sentence is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (sentence.length > MAX_CHARS) {
      return new Response(JSON.stringify({ error: `Text too long. Maximum ${MAX_CHARS} characters.` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit by IP
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode("grammar-" + ip));
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
            message: "You've used all free explanations this hour. Sign up for unlimited access!",
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert English grammar teacher. Analyze the given sentence and provide a detailed grammar breakdown. Identify every grammar concept used, highlight any errors with corrections, and explain the rules clearly. Be educational and encouraging. You must respond using the "explain_grammar" tool.`;

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
          {
            role: "user",
            content: `Analyze this sentence for grammar rules, structure, and any errors:\n\n"${sentence.trim()}"`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "explain_grammar",
              description: "Return the grammar analysis results",
              parameters: {
                type: "object",
                properties: {
                  overall_assessment: {
                    type: "string",
                    description: "A brief 1-2 sentence assessment of the sentence quality",
                  },
                  grammar_score: {
                    type: "number",
                    description: "Grammar correctness score from 1-10",
                  },
                  corrected_sentence: {
                    type: "string",
                    description: "The corrected version of the sentence, or the original if already correct",
                  },
                  concepts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Grammar concept name (e.g., Subject-Verb Agreement, Tense Usage)" },
                        explanation: { type: "string", description: "Clear explanation of how this concept appears in the sentence" },
                        example_in_sentence: { type: "string", description: "The specific part of the sentence demonstrating this concept" },
                        status: { type: "string", enum: ["correct", "error", "improvement"], description: "Whether this concept is used correctly, has an error, or could be improved" },
                      },
                      required: ["name", "explanation", "example_in_sentence", "status"],
                    },
                    description: "Grammar concepts identified in the sentence",
                  },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        original: { type: "string", description: "The problematic text" },
                        correction: { type: "string", description: "The corrected text" },
                        rule: { type: "string", description: "The grammar rule that applies" },
                        explanation: { type: "string", description: "Why this is wrong and how to remember the correct form" },
                      },
                      required: ["original", "correction", "rule", "explanation"],
                    },
                    description: "Specific errors found (empty array if none)",
                  },
                  tips: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 actionable tips to improve writing based on this sentence",
                  },
                },
                required: ["overall_assessment", "grammar_score", "corrected_sentence", "concepts", "errors", "tips"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "explain_grammar" } },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service payment required. Please check your workspace credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No analysis returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, analysis }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in grammar-explainer:", error);
    return new Response(JSON.stringify({ error: "Analysis failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
