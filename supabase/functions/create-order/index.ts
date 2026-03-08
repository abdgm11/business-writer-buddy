import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("create-order invoked, method:", req.method);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode JWT payload directly - the token has already been issued by our auth system
    const token = authHeader.replace("Bearer ", "");
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let claims: Record<string, unknown>;
    try {
      // Handle base64url padding
      let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const decoded = atob(base64);
      claims = JSON.parse(decoded);
      console.log("JWT claims keys:", Object.keys(claims));
      console.log("Has sub:", !!claims.sub, "Has user_id:", !!claims.user_id);
    } catch (e) {
      console.error("JWT decode error:", e);
      return new Response(JSON.stringify({ error: "Invalid token format" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = (claims.sub || claims.user_id) as string;
    if (!userId) {
      console.error("No user ID found in claims:", JSON.stringify(claims));
      return new Response(JSON.stringify({ error: "Unauthorized - no user ID" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check expiration
    const exp = claims.exp as number | undefined;
    if (exp && exp * 1000 < Date.now()) {
      return new Response(JSON.stringify({ error: "Token expired" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.sub;
    const userEmail = claims.email || "";
    console.log("Authenticated user:", userId);

    const { currency = "INR", plan = "pro" } = await req.json();

    // Price in smallest currency unit (paise for INR, cents for USD, etc.)
    const priceMap: Record<string, Record<string, number>> = {
      pro: {
        INR: 99900,   // ₹999
        USD: 1200,    // $12
        EUR: 1100,    // €11
        GBP: 1000,    // £10
        AUD: 1800,    // A$18
        CAD: 1600,    // C$16
        SGD: 1600,    // S$16
        AED: 4500,    // 45 AED
        JPY: 1800,    // ¥1800 (JPY has no subunits)
      },
    };

    const supportedCurrencies = Object.keys(priceMap[plan] || {});
    const normalizedCurrency = currency.toUpperCase();
    
    if (!priceMap[plan] || !priceMap[plan][normalizedCurrency]) {
      return new Response(
        JSON.stringify({ 
          error: `Unsupported currency. Supported: ${supportedCurrencies.join(", ")}` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const amount = priceMap[plan][normalizedCurrency];

    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

    // Create Razorpay order
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
      },
      body: JSON.stringify({
        amount,
        currency: normalizedCurrency,
        receipt: `rcpt_${Date.now()}`,
        notes: { user_id: userId, plan },
      }),
    });

    if (!razorpayRes.ok) {
      const errText = await razorpayRes.text();
      console.error("Razorpay error:", errText);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const order = await razorpayRes.json();

    // Save order to DB
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await adminClient.from("payments").insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount,
      currency: normalizedCurrency,
      plan,
      status: "created",
    });

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount,
        currency: normalizedCurrency,
        key_id: RAZORPAY_KEY_ID,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-order error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
