'use client';

import { FootprintData } from '@/types/footprint';

interface FootprintDonutProps {
  footprint: FootprintData;
  size?: number;
}

export function FootprintDonut({ footprint, size = 300 }: FootprintDonutProps) {
  const categories = footprint.categories;
  const total = footprint.total;
  
  const colors: Record<string, string> = {
    transport: '#3B82F6',
    energy: '#F59E0B',
    food: '#10B981',
    flight: '#8B5CF6',
    shopping: '#EC4899',
  };

  let cumulativePercent = 0;
  const slices = Object.entries(categories).map(([category, value]) => {
    const percent = (value / total) * 100;
    const startAngle = cumulativePercent * 3.6;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 3.6;
    
    return {
      category,
      value,
      percent,
      color: colors[category] || '#6B7280',
      startAngle,
      endAngle,
    };
  });

  const describeArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'L', size / 2, size / 2,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, index) => (
          <path
            key={slice.category}
            d={describeArc(slice.startAngle, slice.endAngle, size / 2 - 10)}
            fill={slice.color}
            className="transition-opacity hover:opacity-80"
          />
        ))}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          className="fill-white dark:fill-gray-800"
        />
      </svg>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {total.toFixed(1)} kg CO₂e
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {slices.map((slice) => (
          <div key={slice.category} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
              {slice.category}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {slice.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
