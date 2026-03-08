import { AppLayout } from "@/components/AppLayout";
import { Flame, FileText, BookOpen, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Words Polished", value: "2,847", icon: FileText, change: "+340 this week" },
  { label: "Lessons Completed", value: "24", icon: BookOpen, change: "+3 this week" },
  { label: "Skill Level", value: "Advanced", icon: TrendingUp, change: "Up from Intermediate" },
];

const recentHistory = [
  { date: "Today", context: "Email", preview: "Quarterly update to stakeholders...", score: 92 },
  { date: "Yesterday", context: "LinkedIn", preview: "Announcement about new product launch...", score: 88 },
  { date: "Mar 6", context: "Report", preview: "Monthly performance report for Q1...", score: 95 },
  { date: "Mar 5", context: "Slack", preview: "Team standup update message...", score: 78 },
  { date: "Mar 4", context: "Email", preview: "Follow-up with potential client...", score: 90 },
];

const streakDays = 12;
const streakGoal = 30;

const Dashboard = () => {
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
            {/* Streak Number */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-gold shadow-gold">
                <Flame className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <p className="text-5xl md:text-6xl font-bold text-primary-foreground font-display leading-none">
                  {streakDays}
                </p>
                <p className="text-sm text-primary-foreground/70 mt-1">day streak</p>
              </div>
            </div>

            {/* Progress + Message */}
            <div className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-gold" />
                <p className="text-sm font-medium text-primary-foreground">
                  {streakGoal - streakDays} days to your {streakGoal}-day goal!
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-primary-foreground/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(streakDays / streakGoal) * 100}%` }}
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
          <div className="divide-y">
            {recentHistory.map((h) => (
              <div key={h.preview} className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground mb-1">
                      {h.context}
                    </span>
                    <p className="text-sm text-foreground">{h.preview}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{h.score}</p>
                  <p className="text-xs text-muted-foreground">score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
