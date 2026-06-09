'use client';

import { FootprintData } from '@/types/footprint';
import { Card } from '@/components/ui/Card';

interface ImpactEquivalentsProps {
  footprint: FootprintData;
}

export function ImpactEquivalents({ footprint }: ImpactEquivalentsProps) {
  const yearlyEmissions = footprint.total * 12; // kg CO₂e per year

  // Calculate equivalents based on yearly emissions
  const equivalents = [
    {
      label: 'Trees Needed to Offset',
      value: Math.ceil(yearlyEmissions / 25), // One tree absorbs ~25 kg CO₂e/year
      unit: 'trees',
      icon: '🌳',
      description: 'Number of trees needed for one year to absorb your emissions',
    },
    {
      label: 'Equivalent Car Miles',
      value: Math.round(yearlyEmissions / 0.4), // ~0.4 kg CO₂e per mile
      unit: 'miles',
      icon: '🚗',
      description: 'Distance driven in an average car',
    },
    {
      label: 'Smartphone Charges',
      value: Math.round(yearlyEmissions / 0.008), // ~0.008 kg CO₂e per charge
      unit: 'charges',
      icon: '📱',
      description: 'Number of smartphone full charges',
    },
    {
      label: 'Flights NYC-London',
      value: (yearlyEmissions / 900).toFixed(1), // ~900 kg CO₂e per transatlantic flight
      unit: 'flights',
      icon: '✈️',
      description: 'Round-trip flights from NYC to London',
    },
    {
      label: 'Homes Powered for a Year',
      value: (yearlyEmissions / 4500).toFixed(2), // ~4,500 kg CO₂e per home/year
      unit: 'homes',
      icon: '🏠',
      description: 'Average homes electricity use for one year',
    },
    {
      label: 'Plastic Bottles Recycled',
      value: Math.round(yearlyEmissions / 0.03), // ~0.03 kg CO₂e per bottle
      unit: 'bottles',
      icon: '♻️',
      description: 'Plastic bottles recycled instead of landfilled',
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Your Impact in Perspective
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Based on your yearly footprint of {yearlyEmissions.toFixed(0)} kg CO₂e
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equivalents.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}{' '}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {item.unit}
              </span>
            </p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
