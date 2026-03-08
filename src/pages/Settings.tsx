import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useUserPlan } from "@/hooks/useUserPlan";
import { PaymentHistory } from "@/components/PaymentHistory";

const Settings = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const { checkout, loading: paymentLoading, SUPPORTED_CURRENCIES } = useRazorpay();
  const { isPro, loading: planLoading } = useUserPlan();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save changes");
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  const handleUpgrade = () => {
    if (!user) return;
    checkout(selectedCurrency, user.email || "", displayName || user.email || "");
  };

  const currentCurrencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency);

  // Display price map
  const displayPrices: Record<string, string> = {
    INR: "₹999", USD: "$12", EUR: "€11", GBP: "£10",
    AUD: "A$18", CAD: "C$16", SGD: "S$16", AED: "AED 45", JPY: "¥1800",
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and subscription.</p>
        </div>

        {/* Profile */}
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <h2 className="text-lg font-semibold text-foreground font-sans mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Display Name</label>
              <input
                className="mt-1 w-full rounded-lg border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                className="mt-1 w-full rounded-lg border bg-background p-3 text-sm text-muted-foreground"
                value={user?.email || ""}
                disabled
              />
            </div>
            <Button variant="hero" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <h2 className="text-lg font-semibold text-foreground font-sans mb-4">Subscription</h2>
          <div className="rounded-lg bg-muted p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Free Plan</p>
                <p className="text-sm text-muted-foreground">3 rewrites per day</p>
              </div>
              <span className="rounded-full bg-muted-foreground/10 px-3 py-1 text-xs font-medium text-muted-foreground">Current</span>
            </div>
          </div>
          <div className="rounded-lg border-2 border-gold p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    Pro Plan — {displayPrices[selectedCurrency] || displayPrices.INR}/month
                  </p>
                  <ul className="mt-2 space-y-1">
                    {["Unlimited rewrites", "All contexts", "Daily lessons", "Full history"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-gold" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Currency selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground">Currency:</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} — {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="gold"
                size="sm"
                onClick={handleUpgrade}
                disabled={paymentLoading}
                className="w-fit"
              >
                {paymentLoading ? "Processing..." : "Upgrade Now"}
              </Button>
            </div>
        </div>

        {/* Payment History */}
        <PaymentHistory />
      </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
