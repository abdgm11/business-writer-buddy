import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Flame, FileText, BookOpen, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RewriteRow {
  id: string;
  original_text: string;
  context: string;
  score: number | null;
  word_count: number;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [rewrites, setRewrites] = useState<RewriteRow[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: rewriteData } = await supabase
        .from("rewrites")
        .select("id, original_text, context, score, word_count, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("streak_count, last_practice_at")
        .eq("user_id", user.id)
        .single();

      if (rewriteData) {
        setRewrites(rewriteData);
        setTotalWords(rewriteData.reduce((sum, r) => sum + r.word_count, 0));
      }

      if (profileData) {
        // Calculate streak based on last_practice_at
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

  const streakGoal = 30;

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
    { label: "Words Polished", value: totalWords.toLocaleString(), icon: FileText, change: `${rewrites.length} rewrites total` },
    { label: "Rewrites This Week", value: rewrites.filter(r => {
      const d = new Date(r.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d > weekAgo;
    }).length.toString(), icon: BookOpen, change: "Last 7 days" },
    { label: "Avg Score", value: rewrites.length > 0 ? Math.round(rewrites.filter(r => r.score).reduce((s, r) => s + (r.score || 0), 0) / Math.max(1, rewrites.filter(r => r.score).length)).toString() : "—", icon: TrendingUp, change: rewrites.length > 0 ? "Based on your rewrites" : "Start writing!" },
  ];

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
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5 shadow-elegant">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <s.icon className="h-4 w-4 text-gold" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground font-display">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.change}</p>
            </div>
          ))}
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
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground mb-1">
                        {h.context}
                      </span>
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
