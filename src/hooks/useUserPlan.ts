import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserPlan() {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("payments")
      .select("status, plan")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .eq("plan", "pro")
      .limit(1);

    setIsPro((data?.length ?? 0) > 0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return { isPro, loading, refetch: fetchPlan };
}
