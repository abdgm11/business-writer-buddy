import { AppLayout } from "@/components/AppLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import StreakCard from "@/components/dashboard/StreakCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart";
import ScoreTrendChart from "@/components/dashboard/ScoreTrendChart";
import ContextBreakdownChart from "@/components/dashboard/ContextBreakdownChart";
import ToneBreakdownChart from "@/components/dashboard/ToneBreakdownChart";
import RecentHistory from "@/components/dashboard/RecentHistory";

const Dashboard = () => {
  const {
    loading, streak, streakGoal, stats,
    weeklyActivity, scoreTrend, contextBreakdown,
    toneBreakdown, recentRewrites,
  } = useDashboardData();

  if (loading) {
    return <AppLayout><DashboardSkeleton /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your writing progress and improvement over time.</p>
        </div>

        <StreakCard streak={streak} streakGoal={streakGoal} />
        <StatsGrid stats={stats} />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <WeeklyActivityChart data={weeklyActivity} />
          <ScoreTrendChart data={scoreTrend} />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <ContextBreakdownChart data={contextBreakdown} />
          <ToneBreakdownChart data={toneBreakdown} />
        </div>

        <RecentHistory rewrites={recentRewrites} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
