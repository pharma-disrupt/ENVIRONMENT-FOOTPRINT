'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function WeeklySnapshot() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [45, 52, 38, 65, 42, 55, 48]; // Example kg CO₂e
  const max = Math.max(...data);

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Snapshot
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your daily emissions this week
          </p>
        </div>
        <Link href="/footprint/trends">
          <Button variant="ghost" size="sm">
            View Trends
          </Button>
        </Link>
      </div>

      <div className="flex h-48 items-end justify-between gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t bg-green-500 transition-all hover:bg-green-600"
              style={{ height: `${(value / max) * 100}%` }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {days[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Total</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.reduce((a, b) => a + b, 0)} kg
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Daily Average</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(data.reduce((a, b) => a + b, 0) / 7).toFixed(1)} kg
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Best Day</p>
          <p className="text-lg font-bold text-green-600">
            {days[data.indexOf(Math.min(...data))]}
          </p>
        </div>
      </div>
    </Card>
  );
}
