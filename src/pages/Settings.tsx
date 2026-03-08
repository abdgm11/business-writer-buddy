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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [cancelling, setCancelling] = useState(false);
  const [yearly, setYearly] = useState(false);
  const { checkout, loading: paymentLoading, SUPPORTED_CURRENCIES } = useRazorpay();
  const { isPro, loading: planLoading, refetch: refetchPlan } = useUserPlan();

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
    const plan = yearly ? "pro_yearly" : "pro_monthly";
    checkout(selectedCurrency, user.email || "", displayName || user.email || "", refetchPlan, plan);
  };

  const handleCancel = async () => {
    if (!user) return;
    setCancelling(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("cancel-subscription", {
        headers: { Authorization: `Bearer ${sess?.session?.access_token}` },
      });
      if (error) {
        toast.error("Failed to cancel subscription. Please try again.");
      } else {
        toast.success("Subscription cancelled. You're now on the Free plan.");
        refetchPlan();
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setCancelling(false);
    }
  };

  const currentCurrencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency);

  const monthlyPrices: Record<string, string> = {
    INR: "₹299", USD: "$12", EUR: "€11", GBP: "£10",
    AUD: "A$18", CAD: "C$16", SGD: "S$16", AED: "AED 45", JPY: "¥1800",
  };
  const yearlyPrices: Record<string, string> = {
    INR: "₹2,499", USD: "$99", EUR: "€92", GBP: "£84",
    AUD: "A$151", CAD: "C$134", SGD: "S$134", AED: "AED 378", JPY: "¥15,100",
  };
  const displayPrice = yearly
    ? (yearlyPrices[selectedCurrency] || yearlyPrices.INR)
    : (monthlyPrices[selectedCurrency] || monthlyPrices.INR);
  const billingLabel = yearly ? "/year" : "/month";

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

          {planLoading ? (
            <p className="text-sm text-muted-foreground">Loading plan...</p>
          ) : isPro ? (
            <div className="rounded-lg border-2 border-gold p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Pro Plan</p>
                  <ul className="mt-2 space-y-1">
                    {["Unlimited rewrites", "All contexts", "Daily lessons", "Full history"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-gold" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">Active</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={cancelling} className="text-destructive hover:text-destructive">
                      {cancelling ? "Cancelling..." : "Cancel Subscription"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Pro subscription?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You'll be downgraded to the Free plan immediately and limited to 3 rewrites per day. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Pro</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <>
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
                  <div>
                    <p className="font-semibold text-foreground">
                      Pro Plan — {displayPrice}{billingLabel}
                    </p>
                    {yearly && (
                      <p className="text-xs text-gold font-medium mt-1">Save 30% with yearly billing</p>
                    )}
                    <ul className="mt-2 space-y-1">
                      {["Unlimited rewrites", "All contexts", "Daily lessons", "Full history"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-gold" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Billing toggle */}
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                    <button
                      onClick={() => setYearly(!yearly)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${yearly ? "bg-gold" : "bg-border"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-card shadow transition-transform ${yearly ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
                      Yearly <span className="text-xs text-gold font-semibold">-30%</span>
                    </span>
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
            </>
          )}

        {/* Payment History */}
        <PaymentHistory />
      </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
