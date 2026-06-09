'use client';

import { Activity } from '@/types/activity';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

const categoryIcons: Record<string, string> = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
};

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getImpactColor = (co2e: number) => {
    if (co2e < 5) return 'text-green-600';
    if (co2e < 20) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Link href={`/activities/${activity.id}`} className="block">
      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{categoryIcons[activity.type] || '📊'}</span>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">{activity.type}</h3>
              <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
            </div>
          </div>
          <Badge variant="secondary">{activity.co2e.toFixed(1)} kg</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${getImpactColor(activity.co2e)}`}>
            {activity.co2e < 5 ? '🟢 Low impact' : activity.co2e < 20 ? '🟡 Medium' : '🔴 High'}
          </p>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
