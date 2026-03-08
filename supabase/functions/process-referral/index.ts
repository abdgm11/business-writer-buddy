import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REFERRER_REWARD = 5;
const REFERRED_REWARD = 3;
const MAX_BONUS_REWRITES = 50; // cap for referrer

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth client to identify the referred user
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { referral_code } = await req.json();
    if (!referral_code || typeof referral_code !== "string" || referral_code.length < 6) {
      return new Response(JSON.stringify({ error: "Invalid referral code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find referrer by code
    const { data: referrer } = await supabaseAdmin
      .from("profiles")
      .select("user_id, bonus_rewrites")
      .eq("referral_code", referral_code)
      .maybeSingle();

    if (!referrer) {
      return new Response(JSON.stringify({ error: "Referral code not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Can't refer yourself
    if (referrer.user_id === user.id) {
      return new Response(JSON.stringify({ error: "Cannot refer yourself" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this user was already referred
    const { data: existing } = await supabaseAdmin
      .from("referrals")
      .select("id")
      .eq("referred_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Already used a referral" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert referral record
    await supabaseAdmin.from("referrals").insert({
      referrer_id: referrer.user_id,
      referred_id: user.id,
      status: "completed",
      referrer_reward: REFERRER_REWARD,
      referred_reward: REFERRED_REWARD,
      completed_at: new Date().toISOString(),
    });

    // Credit referred user
    await supabaseAdmin
      .from("profiles")
      .update({
        bonus_rewrites: REFERRED_REWARD,
      })
      .eq("user_id", user.id);

    // Credit referrer (with cap)
    const newBonus = Math.min(
      referrer.bonus_rewrites + REFERRER_REWARD,
      MAX_BONUS_REWRITES
    );
    await supabaseAdmin
      .from("profiles")
      .update({ bonus_rewrites: newBonus })
      .eq("user_id", referrer.user_id);

    return new Response(
      JSON.stringify({
        success: true,
        bonus_rewrites: REFERRED_REWARD,
        message: `You earned ${REFERRED_REWARD} bonus rewrites!`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("process-referral error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
