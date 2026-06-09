'use client';

import { FootprintData } from '@/types/footprint';
import { Card } from '@/components/ui/Card';
import { FootprintDonut } from '@/components/charts/FootprintDonut';

interface CategoryBreakdownProps {
  footprint: FootprintData;
}

export function CategoryBreakdown({ footprint }: CategoryBreakdownProps) {
  const categories = footprint.categories;
  const total = footprint.total;

  const getCategoryInfo = (category: string) => {
    const info: Record<string, { label: string; icon: string; tips: string[] }> = {
      transport: {
        label: 'Transportation',
        icon: '🚗',
        tips: ['Use public transit', 'Carpool when possible', 'Consider electric vehicles'],
      },
      energy: {
        label: 'Home Energy',
        icon: '⚡',
        tips: ['Switch to LED bulbs', 'Unplug devices when not in use', 'Consider solar panels'],
      },
      food: {
        label: 'Food & Diet',
        icon: '🍽️',
        tips: ['Eat more plant-based meals', 'Buy local produce', 'Reduce food waste'],
      },
      flight: {
        label: 'Air Travel',
        icon: '✈️',
        tips: ['Take trains for short trips', 'Offset flight emissions', 'Combine business trips'],
      },
      shopping: {
        label: 'Shopping & Goods',
        icon: '🛒',
        tips: ['Buy second-hand items', 'Choose durable products', 'Repair instead of replace'],
      },
    };
    return info[category] || { label: category, icon: '📦', tips: [] };
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Category Breakdown
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <FootprintDonut footprint={footprint} size={280} />

        <div className="space-y-4">
          {Object.entries(categories).map(([category, value]) => {
            const info = getCategoryInfo(category);
            const percentage = ((value / total) * 100).toFixed(1);

            return (
              <div
                key={category}
                className="rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {info.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {value.toFixed(1)} kg CO₂e ({percentage}%)
                      </p>
                    </div>
                  </div>
                </div>
                
                {info.tips.length > 0 && (
                  <div className="mt-3 rounded bg-gray-50 p-3 dark:bg-gray-700">
                    <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      Tips to reduce:
                    </p>
                    <ul className="space-y-1">
                      {info.tips.slice(0, 2).map((tip, index) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
