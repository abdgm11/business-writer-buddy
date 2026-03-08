import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "./useUserPlan";

const FREE_DAILY_LIMIT = 3;

export function useRemainingRewrites() {
  const { user } = useAuth();
  const { isPro, loading: planLoading } = useUserPlan();
  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    if (!user || isPro) {
      setLoading(false);
      return;
    }
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("rewrites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    setUsed(count ?? 0);
    setLoading(false);
  }, [user, isPro]);

  useEffect(() => {
    if (!planLoading) fetchUsage();
  }, [planLoading, fetchUsage]);

  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return { remaining, used, limit: FREE_DAILY_LIMIT, isPro, loading: loading || planLoading, refetch: fetchUsage };
}
