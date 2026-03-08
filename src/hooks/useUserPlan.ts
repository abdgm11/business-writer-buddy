import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserPlan() {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      const { data } = await supabase
        .from("payments")
        .select("status, plan")
        .eq("user_id", user.id)
        .eq("status", "paid")
        .eq("plan", "pro")
        .limit(1);

      setIsPro((data?.length ?? 0) > 0);
      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  return { isPro, loading };
}
