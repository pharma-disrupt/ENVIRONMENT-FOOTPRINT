'use client';

import { Insight } from '@/types/challenge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface InsightsFeedProps {
  insights: Insight[];
  loading: boolean;
}

export function InsightsFeed({ insights, loading }: InsightsFeedProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tips & Insights
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalized recommendations
          </p>
        </div>
        <Link href="/insights">
          <span className="text-sm font-medium text-green-600 hover:text-green-700">
            View All →
          </span>
        </Link>
      </div>

      <div className="space-y-4">
        {insights.slice(0, 3).map((insight) => (
          <div
            key={insight.id}
            className="rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {insight.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {insight.description}
                </p>
                <span className="mt-2 inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {insight.category}
                </span>
              </div>
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Complete more activities to get personalized insights!
          </p>
        )}
      </div>
    </Card>
  );
}
