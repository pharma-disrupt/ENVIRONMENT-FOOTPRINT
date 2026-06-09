'use client';

import { useFootprint } from '@/hooks/useFootprint';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TrendsPage() {
  const { history, loading } = useFootprint();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Footprint Over Time
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and identify trends
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <TrendLineChart data={history} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Average Monthly
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {(history.reduce((acc, curr) => acc + curr.total, 0) / history.length || 0).toFixed(1)} kg
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Best Month
          </h3>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {Math.min(...history.map(h => h.total)).toFixed(1)} kg
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Trend
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {history.length > 1 && history[history.length - 1].total < history[0].total
              ? '↓ Improving'
              : '→ Stable'}
          </p>
        </div>
      </div>
    </div>
  );
}
