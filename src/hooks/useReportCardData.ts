import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface ReportStats {
  totalRewrites: number;
  wordsPolished: number;
  streak: number;
  avgScore: number | null;
  bestScore: number | null;
  topContext: string | null;
  topTone: string | null;
  daysPracticed: number;
  firstDate: string | null;
  lastDate: string | null;
  contextBreakdown: { name: string; count: number }[];
  scoreImprovement: number | null; // difference between first 5 avg and last 5 avg
}

export function useReportCardData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);

      const [rewritesRes, profileRes] = await Promise.all([
        supabase
          .from("rewrites")
          .select("context, tone, score, word_count, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("profiles")
          .select("streak_count, last_practice_at")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      const rewrites = rewritesRes.data ?? [];

      if (rewrites.length === 0) {
        setStats(null);
        setLoading(false);
        return;
      }

      const totalRewrites = rewrites.length;
      const wordsPolished = rewrites.reduce((s, r) => s + r.word_count, 0);

      // Streak
      let streak = 0;
      if (profileRes.data?.last_practice_at) {
        const hoursSince = (Date.now() - new Date(profileRes.data.last_practice_at).getTime()) / (1000 * 60 * 60);
        streak = hoursSince < 48 ? Math.max(profileRes.data.streak_count, 1) : 0;
      }

      // Scores
      const scored = rewrites.filter((r) => r.score !== null && r.score !== undefined);
      const avgScore = scored.length > 0 ? Math.round(scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length) : null;
      const bestScore = scored.length > 0 ? Math.max(...scored.map((r) => r.score ?? 0)) : null;

      // Score improvement (first 5 vs last 5)
      let scoreImprovement: number | null = null;
      if (scored.length >= 6) {
        const first5Avg = scored.slice(0, 5).reduce((s, r) => s + (r.score ?? 0), 0) / 5;
        const last5Avg = scored.slice(-5).reduce((s, r) => s + (r.score ?? 0), 0) / 5;
        scoreImprovement = Math.round(last5Avg - first5Avg);
      }

      // Context & tone breakdown
      const contextCounts: Record<string, number> = {};
      const toneCounts: Record<string, number> = {};
      rewrites.forEach((r) => {
        contextCounts[r.context] = (contextCounts[r.context] || 0) + 1;
        toneCounts[r.tone] = (toneCounts[r.tone] || 0) + 1;
      });

      const contextBreakdown = Object.entries(contextCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      const topContext = contextBreakdown[0]?.name ?? null;
      const topTone = Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      // Days practiced
      const uniqueDays = new Set(rewrites.map((r) => r.created_at.split("T")[0]));
      const daysPracticed = uniqueDays.size;

      const firstDate = rewrites[0]?.created_at ?? null;
      const lastDate = rewrites[rewrites.length - 1]?.created_at ?? null;

      setStats({
        totalRewrites,
        wordsPolished,
        streak,
        avgScore,
        bestScore,
        topContext,
        topTone,
        daysPracticed,
        firstDate,
        lastDate,
        contextBreakdown,
        scoreImprovement,
      });
      setLoading(false);
    };

    fetch();
  }, [user]);

  return { loading, stats };
}
