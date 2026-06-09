'use client';

import { FootprintData } from '@/types/footprint';

interface CategoryBarChartProps {
  footprint: FootprintData;
}

export function CategoryBarChart({ footprint }: CategoryBarChartProps) {
  const categories = footprint.categories;
  const total = footprint.total;
  const maxCategoryValue = Math.max(...Object.values(categories), 1);

  const colors: Record<string, string> = {
    transport: 'bg-blue-500',
    energy: 'bg-amber-500',
    food: 'bg-emerald-500',
    flight: 'bg-violet-500',
    shopping: 'bg-pink-500',
  };

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, value]) => {
        const percentage = (value / maxCategoryValue) * 100;
        const percentOfTotal = (value / total) * 100;

        return (
          <div key={category}>
            <div className="mb-2 flex items-center justify-between">
              <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                {category}
              </span>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {value.toFixed(1)} kg
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({percentOfTotal.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full ${colors[category] || 'bg-gray-500'} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-8 border-t pt-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Total Footprint
          </span>
          <span className="text-2xl font-bold text-green-600">
            {total.toFixed(1)} kg CO₂e
          </span>
        </div>
      </div>
    </div>
  );
}
