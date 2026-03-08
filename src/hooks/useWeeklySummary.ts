import { useMemo } from "react";

export interface WeeklySummary {
  thisWeekRewrites: number;
  lastWeekRewrites: number;
  thisWeekWords: number;
  lastWeekWords: number;
  thisWeekAvgScore: number | null;
  lastWeekAvgScore: number | null;
  thisWeekBestScore: number | null;
  streakActive: boolean;
  streak: number;
  activeDaysThisWeek: number;
  rewritesTrend: "up" | "down" | "same";
  scoreTrend: "up" | "down" | "same";
  hasData: boolean;
}

interface RewriteRow {
  score: number | null;
  word_count: number;
  created_at: string;
}

export function useWeeklySummary(
  allRewrites: RewriteRow[],
  streak: number
): WeeklySummary {
  return useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeek = allRewrites.filter(
      (r) => new Date(r.created_at) > weekAgo
    );
    const lastWeek = allRewrites.filter(
      (r) => {
        const d = new Date(r.created_at);
        return d > twoWeeksAgo && d <= weekAgo;
      }
    );

    const thisWeekRewrites = thisWeek.length;
    const lastWeekRewrites = lastWeek.length;
    const thisWeekWords = thisWeek.reduce((s, r) => s + r.word_count, 0);
    const lastWeekWords = lastWeek.reduce((s, r) => s + r.word_count, 0);

    const thisScored = thisWeek.filter((r) => r.score !== null);
    const lastScored = lastWeek.filter((r) => r.score !== null);

    const thisWeekAvgScore =
      thisScored.length > 0
        ? Math.round(thisScored.reduce((s, r) => s + (r.score ?? 0), 0) / thisScored.length)
        : null;
    const lastWeekAvgScore =
      lastScored.length > 0
        ? Math.round(lastScored.reduce((s, r) => s + (r.score ?? 0), 0) / lastScored.length)
        : null;

    const thisWeekBestScore =
      thisScored.length > 0
        ? Math.max(...thisScored.map((r) => r.score ?? 0))
        : null;

    const activeDaysThisWeek = new Set(
      thisWeek.map((r) => r.created_at.split("T")[0])
    ).size;

    const rewritesTrend: "up" | "down" | "same" =
      thisWeekRewrites > lastWeekRewrites
        ? "up"
        : thisWeekRewrites < lastWeekRewrites
        ? "down"
        : "same";

    const scoreTrend: "up" | "down" | "same" =
      thisWeekAvgScore !== null && lastWeekAvgScore !== null
        ? thisWeekAvgScore > lastWeekAvgScore
          ? "up"
          : thisWeekAvgScore < lastWeekAvgScore
          ? "down"
          : "same"
        : "same";

    return {
      thisWeekRewrites,
      lastWeekRewrites,
      thisWeekWords,
      lastWeekWords,
      thisWeekAvgScore,
      lastWeekAvgScore,
      thisWeekBestScore,
      streakActive: streak > 0,
      streak,
      activeDaysThisWeek,
      rewritesTrend,
      scoreTrend,
      hasData: thisWeekRewrites > 0 || lastWeekRewrites > 0,
    };
  }, [allRewrites, streak]);
}
