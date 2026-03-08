import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RewriteRow } from "@/components/dashboard/types";
import { FileText, TrendingUp, Target, Calendar } from "lucide-react";

const STREAK_GOAL = 30;

export function useDashboardData() {
  const { user } = useAuth();
  const [allRewrites, setAllRewrites] = useState<RewriteRow[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: allData } = await supabase
        .from("rewrites")
        .select("id, original_text, context, tone, score, word_count, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: profileData } = await supabase
        .from("profiles")
        .select("streak_count, last_practice_at")
        .eq("user_id", user.id)
        .single();

      if (allData) {
        setAllRewrites(allData);
        setTotalWords(allData.reduce((sum, r) => sum + r.word_count, 0));
      }

      if (profileData?.last_practice_at) {
        const hoursSince = (Date.now() - new Date(profileData.last_practice_at).getTime()) / (1000 * 60 * 60);
        setStreak(hoursSince < 24 ? Math.max(profileData.streak_count, 1) : 0);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const weeklyActivity = useMemo(() => {
    const days: { day: string; rewrites: number; words: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];
      const dayRewrites = allRewrites.filter((r) => r.created_at.split("T")[0] === dateStr);
      days.push({ day: dayStr, rewrites: dayRewrites.length, words: dayRewrites.reduce((s, r) => s + r.word_count, 0) });
    }
    return days;
  }, [allRewrites]);

  const scoreTrend = useMemo(() =>
    allRewrites
      .filter((r) => r.score !== null)
      .slice(0, 20)
      .reverse()
      .map((r, i) => ({
        index: i + 1,
        score: r.score,
        date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      })),
    [allRewrites]
  );

  const contextBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    allRewrites.forEach((r) => { counts[r.context] = (counts[r.context] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [allRewrites]);

  const toneBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    allRewrites.forEach((r) => { counts[r.tone] = (counts[r.tone] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [allRewrites]);

  const rewritesThisWeek = allRewrites.filter((r) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(r.created_at) > weekAgo;
  }).length;

  const scored = allRewrites.filter((r) => r.score);
  const avgScore = scored.length > 0 ? Math.round(scored.reduce((s, r) => s + (r.score || 0), 0) / scored.length) : null;
  const bestScore = scored.length > 0 ? Math.max(...scored.map((r) => r.score || 0)) : null;

  const stats = [
    { label: "Total Words Polished", value: totalWords.toLocaleString(), icon: FileText, change: `${allRewrites.length} rewrites total` },
    { label: "This Week", value: rewritesThisWeek.toString(), icon: Calendar, change: "Last 7 days" },
    { label: "Avg Score", value: avgScore ? avgScore.toString() : "—", icon: TrendingUp, change: avgScore ? "Across all rewrites" : "Start writing!" },
    { label: "Best Score", value: bestScore ? bestScore.toString() : "—", icon: Target, change: bestScore ? "Your personal best!" : "No scores yet" },
  ];

  return {
    loading,
    streak,
    streakGoal: STREAK_GOAL,
    stats,
    weeklyActivity,
    scoreTrend,
    contextBreakdown,
    toneBreakdown,
    recentRewrites: allRewrites.slice(0, 10),
  };
}
