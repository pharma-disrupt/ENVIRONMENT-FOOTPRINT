'use client';

import { FootprintData } from '@/types/footprint';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ComparisonBannerProps {
  footprint: FootprintData;
}

export function ComparisonBanner({ footprint }: ComparisonBannerProps) {
  const monthlyAverage = footprint.total;
  const nationalAverage = 400; // kg CO₂e per month (example)
  const difference = monthlyAverage - nationalAverage;
  const percentDifference = ((difference / nationalAverage) * 100).toFixed(1);
  
  const isBetter = difference < 0;
  const absDifference = Math.abs(difference);

  return (
    <Card className={`p-6 ${isBetter ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800">
            {isBetter ? (
              <span className="text-3xl">🌟</span>
            ) : (
              <span className="text-3xl">💡</span>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isBetter ? "You're Below Average!" : "Room for Improvement"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {isBetter
                ? `Your footprint is ${absDifference.toFixed(1)} kg (${percentDifference}%) lower than the national average.`
                : `Your footprint is ${absDifference.toFixed(1)} kg (${percentDifference}%) higher than the national average.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Badge variant={isBetter ? 'success' : 'warning'}>
            {isBetter ? 'Great Job!' : 'Keep Trying'}
          </Badge>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">National Average</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {nationalAverage} kg/month
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
