import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "./useUserPlan";

const FREE_DAILY_LIMIT = 3;

export function useRemainingRewrites() {
  const { user } = useAuth();
  const { isPro, loading: planLoading } = useUserPlan();
  const [used, setUsed] = useState(0);
  const [bonusRewrites, setBonusRewrites] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    if (!user || isPro) {
      setLoading(false);
      return;
    }
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const [usageRes, profileRes] = await Promise.all([
      supabase
        .from("rewrites")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("profiles")
        .select("bonus_rewrites")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    setUsed(usageRes.count ?? 0);
    setBonusRewrites(profileRes.data?.bonus_rewrites ?? 0);
    setLoading(false);
  }, [user, isPro]);

  useEffect(() => {
    if (!planLoading) fetchUsage();
  }, [planLoading, fetchUsage]);

  const effectiveLimit = FREE_DAILY_LIMIT + bonusRewrites;
  const remaining = Math.max(0, effectiveLimit - used);

  return {
    remaining,
    used,
    limit: effectiveLimit,
    baseLimit: FREE_DAILY_LIMIT,
    bonusRewrites,
    isPro,
    loading: loading || planLoading,
    refetch: fetchUsage,
  };
}
