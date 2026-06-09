'use client';

import { Insight } from '@/types/insight';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const categoryIcons: Record<string, string> = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
  lifestyle: '🌱',
};

interface InsightCardProps {
  insight: Insight;
  onMarkAsRead?: () => void;
  onDismiss?: () => void;
}

export function InsightCard({ insight, onMarkAsRead, onDismiss }: InsightCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-5 border rounded-lg transition-shadow ${
      insight.read ? 'bg-gray-50' : 'bg-white shadow-sm border-l-4 border-l-indigo-500'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{categoryIcons[insight.category] || '💡'}</span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
              {!insight.read && (
                <Badge variant="success" className="text-xs">New</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(insight.createdAt)} • {insight.category}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
          {insight.priority}
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">{insight.description}</p>

      {insight.actionableTip && (
        <div className="bg-green-50 p-3 rounded-lg mb-4 border border-green-200">
          <p className="text-sm text-green-800 font-medium">💡 Action Tip</p>
          <p className="text-xs text-green-700 mt-1">{insight.actionableTip}</p>
        </div>
      )}

      {insight.estimatedSavings !== undefined && insight.estimatedSavings > 0 && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Potential savings:</span>
          <Badge variant="success">{insight.estimatedSavings.toFixed(1)} kg CO₂e</Badge>
        </div>
      )}

      {!insight.read && (
        <div className="flex justify-end space-x-2 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAsRead}
          >
            Mark as Read
          </Button>
        </div>
      )}
    </div>
  );
}
