'use client';

import { useFootprint } from '@/hooks/useFootprint';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BreakdownPage() {
  const { footprint, loading } = useFootprint();

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
          Footprint by Category
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See where your emissions come from
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <CategoryBarChart footprint={footprint} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Object.entries(footprint?.categories || {}).map(([category, value]) => (
          <div
            key={category}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <h3 className="mb-2 capitalize text-lg font-semibold text-gray-900 dark:text-white">
              {category}
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {value.toFixed(1)} kg CO₂e
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {((value / (footprint?.total || 1)) * 100).toFixed(1)}% of total
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
