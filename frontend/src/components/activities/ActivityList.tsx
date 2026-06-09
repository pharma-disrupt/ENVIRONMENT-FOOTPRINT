'use client';

import Link from 'next/link';
import { Activity } from '@/types/activity';
import { Badge } from '@/components/ui/Badge';

const categoryIcons: Record<string, string> = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
};

const categoryColors: Record<string, string> = {
  transport: 'bg-blue-100 text-blue-800 border-blue-200',
  energy: 'bg-amber-100 text-amber-800 border-amber-200',
  food: 'bg-green-100 text-green-800 border-green-200',
  shopping: 'bg-purple-100 text-purple-800 border-purple-200',
};

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getImpactLevel = (co2e: number) => {
    if (co2e < 5) return { label: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (co2e < 20) return { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No activities to display</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {activities.map((activity) => {
        const impact = getImpactLevel(activity.co2e);
        
        return (
          <Link
            key={activity.id}
            href={`/activities/${activity.id}`}
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${categoryColors[activity.type]}`}>
                  {categoryIcons[activity.type] || '📊'}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 capitalize">{activity.type}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(activity.date)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {activity.type === 'transport' && `${(activity.data as any)?.distance || 0} km`}
                    {activity.type === 'energy' && `${(activity.data as any)?.consumption || 0} ${(activity.data as any)?.unit || 'units'}`}
                    {activity.type === 'food' && 'Diet log'}
                    {activity.type === 'shopping' && `${(activity.data as any)?.items?.length || 0} items`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{activity.co2e.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">kg CO₂e</p>
                </div>
                
                <div className={`px-2 py-1 rounded text-xs font-medium ${impact.bg} ${impact.color}`}>
                  {impact.label}
                </div>

                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
