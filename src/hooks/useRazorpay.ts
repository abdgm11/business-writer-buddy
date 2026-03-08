import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SUPPORTED_CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
] as const;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);

  const checkout = async (currency: string, userEmail: string, userName: string) => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        return;
      }

      // Get the current session to ensure the auth token is sent
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        toast.error("Please sign in again to continue.");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-order", {
        body: { currency, plan: "pro" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Failed to create order");
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "ProseAI",
        description: "Pro Plan — Monthly",
        order_id: data.order_id,
        prefill: {
          email: userEmail,
          name: userName,
        },
        theme: { color: "#D4A847" },
        handler: async (response: any) => {
          const { error: verifyError } = await supabase.functions.invoke("verify-payment", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          });

          if (verifyError) {
            toast.error("Payment verification failed. Contact support.");
          } else {
            toast.success("Payment successful! Welcome to Pro 🎉");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (e) {
      console.error("Checkout error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, SUPPORTED_CURRENCIES };
}
