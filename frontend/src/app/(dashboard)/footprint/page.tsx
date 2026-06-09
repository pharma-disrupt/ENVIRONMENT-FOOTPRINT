'use client';

import { useFootprint } from '@/hooks/useFootprint';
import { FootprintMeter } from '@/components/footprint/FootprintMeter';
import { CategoryBreakdown } from '@/components/footprint/CategoryBreakdown';
import { ComparisonBanner } from '@/components/footprint/ComparisonBanner';
import { ImpactEquivalents } from '@/components/footprint/ImpactEquivalents';
import { Skeleton } from '@/components/ui/Skeleton';

export default function FootprintPage() {
  const { footprint, loading } = useFootprint();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Carbon Footprint
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and understand your emissions
        </p>
      </div>

      {/* Main Meter */}
      <FootprintMeter footprint={footprint} />

      {/* Comparison with National Average */}
      <ComparisonBanner footprint={footprint} />

      {/* Category Breakdown */}
      <CategoryBreakdown footprint={footprint} />

      {/* Impact Equivalents */}
      <ImpactEquivalents footprint={footprint} />
    </div>
  );
}
