'use client';

import { FootprintData } from '@/types/footprint';
import { FootprintDonut } from '@/components/charts/FootprintDonut';
import { Card } from '@/components/ui/Card';

interface FootprintSummaryCardProps {
  footprint: FootprintData;
}

export function FootprintSummaryCard({ footprint }: FootprintSummaryCardProps) {
  const monthlyAverage = footprint.total;
  const yearlyProjection = monthlyAverage * 12;
  const nationalAverage = 400; // kg CO₂e per month (example)
  const percentOfNational = ((monthlyAverage / nationalAverage) * 100).toFixed(0);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Your Monthly Footprint
          </h2>
          <div className="mb-4">
            <p className="text-5xl font-bold text-green-600">
              {monthlyAverage.toFixed(0)}
              <span className="ml-2 text-xl font-normal text-gray-600 dark:text-gray-400">
                kg CO₂e
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Projected yearly: {yearlyProjection.toFixed(0)} kg CO₂e
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  vs National Average
                </span>
                <span
                  className={`font-semibold ${
                    monthlyAverage < nationalAverage
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {percentOfNational}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <div
                  className={`h-full ${
                    monthlyAverage < nationalAverage
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Number(percentOfNational), 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Best Category
                </p>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {Object.entries(footprint.categories).reduce((a, b) =>
                    a[1] < b[1] ? a : b
                  )[0]}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Focus Area
                </p>
                <p className="font-semibold text-amber-700 dark:text-amber-300">
                  {Object.entries(footprint.categories).reduce((a, b) =>
                    a[1] > b[1] ? a : b
                  )[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <FootprintDonut footprint={footprint} size={280} />
        </div>
      </div>
    </Card>
  );
}
