import { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Flame, FileText, BookOpen, TrendingUp, Zap, Target, Calendar, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area,
} from "recharts";

interface RewriteRow {
  id: string;
  original_text: string;
  context: string;
  tone: string;
  score: number | null;
  word_count: number;
  created_at: string;
}

const CHART_COLORS = [
  "hsl(var(--gold))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--muted-foreground))",
  "#6366f1",
  "#ec4899",
];

const Dashboard = () => {
  const { user } = useAuth();
  const [rewrites, setRewrites] = useState<RewriteRow[]>([]);
  const [allRewrites, setAllRewrites] = useState<RewriteRow[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch all rewrites for analytics
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
        setRewrites(allData.slice(0, 10));
        setTotalWords(allData.reduce((sum, r) => sum + r.word_count, 0));
      }

      if (profileData) {
        if (profileData.last_practice_at) {
          const lastPractice = new Date(profileData.last_practice_at);
          const now = new Date();
          const hoursSince = (now.getTime() - lastPractice.getTime()) / (1000 * 60 * 60);
          setStreak(hoursSince < 24 ? Math.max(profileData.streak_count, 1) : 0);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Weekly activity data (last 7 days)
  const weeklyActivity = useMemo(() => {
    const days: { day: string; rewrites: number; words: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];
      const dayRewrites = allRewrites.filter(
        (r) => r.created_at.split("T")[0] === dateStr
      );
      days.push({
        day: dayStr,
        rewrites: dayRewrites.length,
        words: dayRewrites.reduce((s, r) => s + r.word_count, 0),
      });
    }
    return days;
  }, [allRewrites]);

  // Score trend (last 20 rewrites with scores, chronological)
  const scoreTrend = useMemo(() => {
    return allRewrites
      .filter((r) => r.score !== null)
      .slice(0, 20)
      .reverse()
      .map((r, i) => ({
        index: i + 1,
        score: r.score,
        date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));
  }, [allRewrites]);

  // Context breakdown
  const contextBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    allRewrites.forEach((r) => {
      counts[r.context] = (counts[r.context] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allRewrites]);

  // Tone breakdown
  const toneBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    allRewrites.forEach((r) => {
      counts[r.tone] = (counts[r.tone] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allRewrites]);

  const streakGoal = 30;

  const rewritesThisWeek = allRewrites.filter((r) => {
    const d = new Date(r.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d > weekAgo;
  }).length;

  const avgScore = allRewrites.filter((r) => r.score).length > 0
    ? Math.round(
        allRewrites.filter((r) => r.score).reduce((s, r) => s + (r.score || 0), 0) /
        allRewrites.filter((r) => r.score).length
      )
    : null;

  const bestScore = allRewrites.filter((r) => r.score).length > 0
    ? Math.max(...allRewrites.filter((r) => r.score).map((r) => r.score || 0))
    : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return "Today";
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const stats = [
    { label: "Total Words Polished", value: totalWords.toLocaleString(), icon: FileText, change: `${allRewrites.length} rewrites total` },
    { label: "This Week", value: rewritesThisWeek.toString(), icon: Calendar, change: "Last 7 days" },
    { label: "Avg Score", value: avgScore ? avgScore.toString() : "—", icon: TrendingUp, change: avgScore ? "Across all rewrites" : "Start writing!" },
    { label: "Best Score", value: bestScore ? bestScore.toString() : "—", icon: Target, change: bestScore ? "Your personal best!" : "No scores yet" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
          <p className="text-xs font-medium text-foreground">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-xs text-muted-foreground">
              {entry.name}: <span className="font-semibold text-foreground">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your writing progress and improvement over time.</p>
        </div>

        {/* Streak Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="relative overflow-hidden rounded-2xl gradient-navy p-6 md:p-8 shadow-elegant"
        >
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <Flame className="w-full h-full text-gold" />
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-gold shadow-gold">
                <Flame className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <p className="text-5xl md:text-6xl font-bold text-primary-foreground font-display leading-none">
                  {streak}
                </p>
                <p className="text-sm text-primary-foreground/70 mt-1">day streak</p>
              </div>
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-gold" />
                <p className="text-sm font-medium text-primary-foreground">
                  {streak > 0 ? `${streakGoal - streak} days to your ${streakGoal}-day goal!` : "Start your streak by polishing some text!"}
                </p>
              </div>
              <div className="w-full h-3 rounded-full bg-primary-foreground/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(streak / streakGoal) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
                  className="h-full rounded-full gradient-gold"
                />
              </div>
              <p className="text-xs text-primary-foreground/50 mt-2">
                Practice daily to keep your streak. Resets after 24 hours of inactivity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{s.label}</p>
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  <s.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground font-display">{s.value}</p>
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{s.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <BarChart3 className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-semibold text-foreground">Weekly Activity</h3>
            </div>
            {weeklyActivity.some((d) => d.rewrites > 0) ? (
              <ResponsiveContainer width="100%" height={160} className="sm:!h-[200px]">
                <BarChart data={weeklyActivity} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} width={28} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rewrites" name="Rewrites" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[160px] sm:h-[200px] text-sm text-muted-foreground">
                No activity this week yet
              </div>
            )}
          </motion.div>

          {/* Score Trend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <TrendingUp className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-semibold text-foreground">Score Trend</h3>
            </div>
            {scoreTrend.length > 1 ? (
              <ResponsiveContainer width="100%" height={160} className="sm:!h-[200px]">
                <AreaChart data={scoreTrend} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--gold))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--gold))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={28} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Score"
                    stroke="hsl(var(--gold))"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[160px] sm:h-[200px] text-sm text-muted-foreground">
                Need at least 2 scored rewrites
              </div>
            )}
          </motion.div>
        </div>

        {/* Breakdowns Row */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Context Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-xl border bg-card p-3 sm:p-5 shadow-elegant"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Writing Context Breakdown</h3>
            {contextBreakdown.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <ResponsiveContainer width={120} height={120} className="sm:!w-[140px] sm:!h-[140px] shrink-0">
                  <PieChart>
                    <Pie
                      data={contextBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {contextBreakdown.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {contextBreakdown.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-muted-foreground capitalize">{item.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </motion.div>

          {/* Tone Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-xl border bg-card p-5 shadow-elegant"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Tone Usage</h3>
            {toneBreakdown.length > 0 ? (
              <div className="space-y-3">
                {toneBreakdown.map((item, i) => {
                  const max = toneBreakdown[0].value;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground capitalize">{item.name}</span>
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / max) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </motion.div>
        </div>

        {/* Recent History */}
        <div className="rounded-xl border bg-card shadow-elegant">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold text-foreground font-sans">Recent Writing History</h2>
          </div>
          {rewrites.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No rewrites yet. Head to the Coach page to get started!</p>
            </div>
          ) : (
            <div className="divide-y">
              {rewrites.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground">{formatDate(h.created_at)}</p>
                    </div>
                    <div>
                      <div className="flex gap-1.5 mb-1">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {h.context}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                          {h.tone}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{h.original_text.substring(0, 80)}...</p>
                    </div>
                  </div>
                  {h.score && (
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{h.score}</p>
                      <p className="text-xs text-muted-foreground">score</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
