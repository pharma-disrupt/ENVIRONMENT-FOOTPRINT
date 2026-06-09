'use client';

import { Activity } from '@/types/activity';
import { Badge } from '@/components/ui/Badge';

const categoryIcons: Record<string, string> = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
};

const categoryColors: Record<string, string> = {
  transport: 'bg-blue-100 text-blue-800',
  energy: 'bg-amber-100 text-amber-800',
  food: 'bg-green-100 text-green-800',
  shopping: 'bg-purple-100 text-purple-800',
};

interface ActivityFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: any) => void;
  dateRange: string;
  onDateRangeChange: (range: any) => void;
}

export function ActivityFilters({
  currentFilter,
  onFilterChange,
  dateRange,
  onDateRangeChange,
}: ActivityFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-wrap gap-2">
        {(['all', 'transport', 'energy', 'food', 'shopping'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              currentFilter === filter
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoryIcons[filter] || '📊'} {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Period:</span>
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
  );
}
