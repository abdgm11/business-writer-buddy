import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  FileText,
  BookOpen,
  Target,
  Flame,
  Calendar,
  Sparkles,
} from "lucide-react";
import { WeeklySummary } from "@/hooks/useWeeklySummary";

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "same" }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const trendLabel = (trend: "up" | "down" | "same") =>
  trend === "up" ? "Up" : trend === "down" ? "Down" : "Same";

export const WeeklySummaryCard = ({ summary }: WeeklySummaryCardProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (!summary.hasData || dismissed) return null;

  const rewriteDiff = summary.thisWeekRewrites - summary.lastWeekRewrites;
  const wordDiff = summary.thisWeekWords - summary.lastWeekWords;
  const scoreDiff =
    summary.thisWeekAvgScore !== null && summary.lastWeekAvgScore !== null
      ? summary.thisWeekAvgScore - summary.lastWeekAvgScore
      : null;

  // Generate a motivational message
  let message = "";
  if (summary.thisWeekRewrites === 0 && summary.lastWeekRewrites > 0) {
    message = "You haven't written this week yet — jump back in! 🚀";
  } else if (summary.rewritesTrend === "up") {
    message = `Great momentum! ${rewriteDiff > 0 ? `+${rewriteDiff}` : ""} more rewrites than last week. Keep it up! 🔥`;
  } else if (summary.rewritesTrend === "down" && summary.thisWeekRewrites > 0) {
    message = "Slightly quieter week — every rewrite counts! 💪";
  } else if (summary.thisWeekRewrites > 0) {
    message = "Steady progress this week. Consistency is key! ✨";
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border bg-card p-5 shadow-elegant relative overflow-hidden"
      >
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-gold" />

        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-gold" />
          <h3 className="text-base font-semibold text-foreground font-sans">
            Your Week in Review
          </h3>
          <span className="text-xs text-muted-foreground ml-auto mr-6">Last 7 days</span>
        </div>

        {/* Motivational message */}
        {message && (
          <p className="text-sm text-muted-foreground mb-4">{message}</p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Rewrites */}
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <FileText className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs text-muted-foreground">Rewrites</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">{summary.thisWeekRewrites}</span>
              <div className="flex items-center gap-0.5">
                <TrendIcon trend={summary.rewritesTrend} />
                {rewriteDiff !== 0 && (
                  <span className={`text-xs font-medium ${rewriteDiff > 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {rewriteDiff > 0 ? `+${rewriteDiff}` : rewriteDiff}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Words */}
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs text-muted-foreground">Words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">{summary.thisWeekWords.toLocaleString()}</span>
              {wordDiff !== 0 && (
                <span className={`text-xs font-medium ${wordDiff > 0 ? "text-emerald-500" : "text-destructive"}`}>
                  {wordDiff > 0 ? `+${wordDiff.toLocaleString()}` : wordDiff.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Avg Score */}
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs text-muted-foreground">Avg Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                {summary.thisWeekAvgScore ?? "—"}
              </span>
              {scoreDiff !== null && scoreDiff !== 0 && (
                <div className="flex items-center gap-0.5">
                  <TrendIcon trend={summary.scoreTrend} />
                  <span className={`text-xs font-medium ${scoreDiff > 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Active Days / Streak */}
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-1.5 mb-1">
              {summary.streakActive ? (
                <Flame className="h-3.5 w-3.5 text-gold" />
              ) : (
                <Calendar className="h-3.5 w-3.5 text-gold" />
              )}
              <span className="text-xs text-muted-foreground">
                {summary.streakActive ? "Streak" : "Active Days"}
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {summary.streakActive
                ? `${summary.streak} days`
                : `${summary.activeDaysThisWeek}/7`}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
