'use client';

import { Goal } from '@/types/goal';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

const goalIcons: Record<string, string> = {
  reduction: '📉',
  activity: '🎯',
  habit: '✅',
};

const goalColors: Record<string, string> = {
  reduction: 'bg-green-100 text-green-800',
  activity: 'bg-blue-100 text-blue-800',
  habit: 'bg-purple-100 text-purple-800',
};

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    switch (goal.status) {
      case 'completed':
        return <Badge variant="success">✓ Completed</Badge>;
      case 'failed':
        return <Badge variant="danger">✗ Failed</Badge>;
      default:
        const daysLeft = Math.ceil(
          (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return (
          <Badge variant="secondary">
            {daysLeft > 0 ? `${daysLeft} days left` : 'Due soon'}
          </Badge>
        );
    }
  };

  return (
    <div className="p-5 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{goalIcons[goal.type] || '🎯'}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-xs text-gray-500 capitalize">{goal.type} goal</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {goal.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{goal.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {goal.current.toFixed(1)} / {goal.target.toFixed(1)}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 text-right">{progress.toFixed(0)}% complete</p>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span>Ends {formatDate(goal.endDate)}</span>
        </div>
        {goal.reward && (
          <div className="flex items-center space-x-1 text-green-600">
            <span>🏆</span>
            <span>{goal.reward} pts</span>
          </div>
        )}
      </div>
    </div>
  );
}
