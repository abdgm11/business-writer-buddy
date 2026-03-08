import { AppLayout } from "@/components/AppLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useBadges } from "@/hooks/useBadges";
import { useWeeklySummary } from "@/hooks/useWeeklySummary";
import { useBadgeNotifications } from "@/hooks/useBadgeNotifications";
import { BadgesSection } from "@/components/BadgesSection";
import { WeeklySummaryCard } from "@/components/dashboard/WeeklySummaryCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import StreakCard from "@/components/dashboard/StreakCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart";
import ScoreTrendChart from "@/components/dashboard/ScoreTrendChart";
import ContextBreakdownChart from "@/components/dashboard/ContextBreakdownChart";
import ToneBreakdownChart from "@/components/dashboard/ToneBreakdownChart";
import RecentHistory from "@/components/dashboard/RecentHistory";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const {
    loading, error, retry, streak, streakGoal, stats,
    weeklyActivity, scoreTrend, contextBreakdown,
    toneBreakdown, recentRewrites, allRewrites, badgeInput,
  } = useDashboardData();

  const badges = useBadges(badgeInput);
  useBadgeNotifications(badges);
  const weeklySummary = useWeeklySummary(allRewrites, streak);

  if (loading) {
    return <AppLayout><DashboardSkeleton /></AppLayout>;
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
          <Button onClick={retry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your writing progress and improvement over time.</p>
        </div>

        <WeeklySummaryCard summary={weeklySummary} />
        <StreakCard streak={streak} streakGoal={streakGoal} />
        <StatsGrid stats={stats} />
        <BadgesSection badges={badges} variant="dashboard" />

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
