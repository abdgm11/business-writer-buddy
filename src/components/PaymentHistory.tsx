import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  created_at: string;
}

const currencySymbols: Record<string, string> = {
  INR: "₹", USD: "$", EUR: "€", GBP: "£",
  AUD: "A$", CAD: "C$", SGD: "S$", AED: "AED ", JPY: "¥",
};

function formatAmount(amount: number, currency: string) {
  const symbol = currencySymbols[currency] || currency + " ";
  const divisor = currency === "JPY" ? 1 : 100;
  return `${symbol}${(amount / divisor).toFixed(currency === "JPY" ? 0 : 2)}`;
}

export const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setPayments((data as Payment[]) || []);
        setLoading(false);
      });
  }, [user]);

  const statusColor = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "created": return "secondary";
      default: return "destructive";
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-elegant">
      <h2 className="text-lg font-semibold text-foreground font-sans mb-4">Payment History</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground capitalize">{p.plan} Plan</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(p.created_at), "MMM d, yyyy · h:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {formatAmount(p.amount, p.currency)}
                </span>
                <Badge variant={statusColor(p.status) as any} className="capitalize text-xs">
                  {p.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
