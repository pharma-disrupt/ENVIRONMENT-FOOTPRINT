'use client';

import { Activity } from '@/types/activity';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface RecentActivitiesProps {
  activities: Activity[];
  loading: boolean;
}

export function RecentActivities({ activities, loading }: RecentActivitiesProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    );
  }

  const getIcon = (category: string) => {
    const icons: Record<string, string> = {
      transport: '🚗',
      energy: '⚡',
      food: '🍽️',
      flight: '✈️',
      shopping: '🛒',
    };
    return icons[category] || '📝';
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activities
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your latest carbon footprint entries
          </p>
        </div>
        <Link href="/activities">
          <Button variant="ghost" size="sm">
            View All →
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm dark:border-gray-700">
              <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">
                Category
              </th>
              <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">
                Description
              </th>
              <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">
                Date
              </th>
              <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">
                Emissions
              </th>
              <th className="pb-3 font-medium text-gray-600 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.slice(0, 5).map((activity) => (
              <tr
                key={activity.id}
                className="border-b last:border-0 dark:border-gray-700"
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getIcon(activity.category)}</span>
                    <span className="capitalize text-sm font-medium text-gray-900 dark:text-white">
                      {activity.category}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                  {activity.description || '-'}
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <span className="font-medium text-green-600">
                    {activity.emissions.toFixed(1)} kg
                  </span>
                </td>
                <td className="py-3">
                  <Link href={`/activities/${activity.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}

            {activities.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  No activities logged yet. Start tracking your footprint!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
