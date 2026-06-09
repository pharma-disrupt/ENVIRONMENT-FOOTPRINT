'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useActivities } from '@/hooks/useActivities';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { ActivityList } from '@/components/activities/ActivityList';
import { FootprintDonut } from '@/components/charts/FootprintDonut';

const categoryStats = {
  transport: { label: 'Transport', icon: '🚗', color: '#3B82F6' },
  energy: { label: 'Energy', icon: '⚡', color: '#F59E0B' },
  food: { label: 'Food', icon: '🍽️', color: '#10B981' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
};

export default function ActivitiesPage() {
  const { activities, loading, error } = useActivities();
  const [filter, setFilter] = useState<'all' | 'transport' | 'energy' | 'food' | 'shopping'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate category breakdown
  const categoryData = Object.entries(categoryStats).map(([key, data]) => {
    const filtered = activities?.filter(a => a.type === key) || [];
    const total = filtered.reduce((sum, a) => sum + a.co2e, 0);
    return {
      name: data.label,
      value: total,
      color: data.color,
      icon: data.icon,
    };
  });

  const totalEmissions = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <Link href="/activities/log">
            <Button>Log Activity</Button>
          </Link>
        </div>
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <Link href="/activities/log">
            <Button>Log Activity</Button>
          </Link>
        </div>
        <Card className="p-8 text-center">
          <p className="text-red-600">Error loading activities: {error}</p>
        </Card>
      </div>
    );
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(a => a.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
          <p className="text-sm text-gray-600">Track and manage your carbon-emitting activities</p>
        </div>
        <Link href="/activities/log">
          <Button>+ Log New Activity</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Emissions</p>
              <p className="text-3xl font-bold text-gray-900">{totalEmissions.toFixed(1)}</p>
              <p className="text-xs text-gray-500">kg CO₂e this {dateRange}</p>
            </div>
            <div className="w-20 h-20">
              <FootprintDonut data={categoryData} size={80} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600 mb-4">By Category</p>
          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{cat.icon}</span>
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">{cat.value.toFixed(1)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {totalEmissions > 0 ? ((cat.value / totalEmissions) * 100).toFixed(0) : 0}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600 mb-4">Quick Stats</p>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{activities?.length || 0}</p>
              <p className="text-xs text-gray-500">Activities logged</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {(activities?.filter(a => a.co2e < 5).length || 0)}
              </p>
              <p className="text-xs text-gray-500">Low-impact activities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {(activities?.filter(a => a.co2e > 20).length || 0)}
              </p>
              <p className="text-xs text-gray-500">High-impact activities</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <ActivityFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Activity List */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Activities</h2>
        </div>
        {filteredActivities && filteredActivities.length > 0 ? (
          <ActivityList activities={filteredActivities} />
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No activities found</p>
            <Link href="/activities/log">
              <Button variant="outline">Log Your First Activity</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
