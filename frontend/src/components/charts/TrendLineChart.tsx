'use client';

import { FootprintHistory } from '@/types/footprint';

interface TrendLineChartProps {
  data: FootprintHistory[];
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  const width = 800;
  const height = 400;
  const padding = 60;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500">
        No trend data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.total));
  const minValue = Math.min(...data.map(d => d.total));
  const range = maxValue - minValue || 1;

  const xScale = (index: number) =>
    padding + (index / (data.length - 1)) * (width - 2 * padding);
  
  const yScale = (value: number) =>
    height - padding - ((value - minValue) / range) * (height - 2 * padding);

  const points = data
    .map((d, i) => `${xScale(i)},${yScale(d.total)}`)
    .join(' ');

  const areaPath = `
    ${points}
    L ${xScale(data.length - 1)},${height - padding}
    L ${xScale(0)},${height - padding}
    Z
  `;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto w-full max-w-3xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding - ratio * (height - 2 * padding);
          return (
            <g key={ratio}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeDasharray="4,4"
              />
              <text
                x={padding - 10}
                y={y + 4}
                className="fill-gray-500 text-xs"
                textAnchor="end"
              >
                {(minValue + ratio * range).toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={areaPath}
          className="fill-green-100 opacity-50 dark:fill-green-900"
        />

        {/* Line */}
        <polyline
          points={points}
          className="stroke-green-500 fill-none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={d.period}>
            <circle
              cx={xScale(i)}
              cy={yScale(d.total)}
              r={6}
              className="fill-white stroke-green-500 dark:fill-gray-800"
              strokeWidth={2}
            />
            <text
              x={xScale(i)}
              y={height - padding + 20}
              className="fill-gray-600 text-xs"
              textAnchor="middle"
              transform={`rotate(-45, ${xScale(i)}, ${height - padding + 20})`}
            >
              {formatDate(d.period)}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 10}
          className="fill-gray-700 text-sm font-medium"
          textAnchor="middle"
        >
          Period
        </text>
        <text
          x={20}
          y={height / 2}
          className="fill-gray-700 text-sm font-medium"
          textAnchor="middle"
          transform={`rotate(-90, 20, ${height / 2})`}
        >
          kg CO₂e
        </text>
      </svg>
    </div>
  );
}
