'use client';

import { FootprintData } from '@/types/footprint';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface FootprintMeterProps {
  footprint: FootprintData;
}

export function FootprintMeter({ footprint }: FootprintMeterProps) {
  const monthlyAverage = footprint.total;
  const nationalAverage = 400; // kg CO₂e per month
  const percentage = Math.min((monthlyAverage / nationalAverage) * 100, 100);
  
  const getStatus = () => {
    if (percentage < 50) return { label: 'Excellent', color: 'text-green-600' };
    if (percentage < 80) return { label: 'Good', color: 'text-blue-600' };
    if (percentage < 100) return { label: 'Average', color: 'text-amber-600' };
    return { label: 'Above Average', color: 'text-red-600' };
  };

  const status = getStatus();

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Footprint Meter
        </h2>
        <span className={`font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Your footprint: {monthlyAverage.toFixed(1)} kg CO₂e
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            National avg: {nationalAverage} kg CO₂e
          </span>
        </div>
        <Progress value={percentage} className="h-4" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
          <p className="text-xs text-green-600 dark:text-green-400">Low Impact</p>
          <p className="mt-1 text-lg font-bold text-green-700 dark:text-green-300">
            &lt;200 kg
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-xs text-blue-600 dark:text-blue-400">Moderate</p>
          <p className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-300">
            200-400 kg
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-900/20">
          <p className="text-xs text-amber-600 dark:text-amber-400">High Impact</p>
          <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-300">
            &gt;400 kg
          </p>
        </div>
      </div>
    </Card>
  );
}
