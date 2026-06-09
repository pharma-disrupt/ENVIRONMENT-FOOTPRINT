'use client';

import { useEffect, useState } from 'react';
import { FootprintSummaryCard } from '@/components/dashboard/FootprintSummaryCard';
import { WeeklySnapshot } from '@/components/dashboard/WeeklySnapshot';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { InsightsFeed } from '@/components/dashboard/InsightsFeed';
import { ActiveChallenges } from '@/components/dashboard/ActiveChallenges';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { useFootprint } from '@/hooks/useFootprint';
import { useActivities } from '@/hooks/useActivities';
import { useInsights } from '@/hooks/useInsights';
import { useChallenges } from '@/hooks/useChallenges';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { footprint, loading: footprintLoading } = useFootprint();
  const { activities, loading: activitiesLoading } = useActivities();
  const { insights, loading: insightsLoading } = useInsights();
  const { challenges, loading: challengesLoading } = useChallenges();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || footprintLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s your carbon footprint overview
        </p>
      </div>

      {/* Main Footprint Summary */}
      <FootprintSummaryCard footprint={footprint} />

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklySnapshot />
        </div>
        <div>
          <QuickLogWidget />
        </div>
      </div>

      {/* Insights and Challenges */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InsightsFeed insights={insights} loading={insightsLoading} />
        <ActiveChallenges challenges={challenges} loading={challengesLoading} />
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={activities} loading={activitiesLoading} />
    </div>
  );
}
