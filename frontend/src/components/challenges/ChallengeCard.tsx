'use client';

import { Challenge } from '@/types/challenge';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

interface ChallengeCardProps {
  challenge: Challenge;
  isJoined?: boolean;
}

export function ChallengeCard({ challenge, isJoined }: ChallengeCardProps) {
  const progress = isJoined && challenge.progress ? Math.min(challenge.progress, 100) : 0;

  return (
    <div className="p-5 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{challenge.icon || '🏆'}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
            <Badge variant="secondary" className="mt-1 capitalize">
              {challenge.category}
            </Badge>
          </div>
        </div>
        {isJoined && (
          <Badge variant={progress >= 100 ? 'success' : 'secondary'}>
            {progress >= 100 ? '✓ Complete' : `${progress.toFixed(0)}%`}
          </Badge>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <span>👥</span>
          <span>{challenge.participants} joined</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span>{challenge.duration} days</span>
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <span>🏆</span>
          <span>{challenge.reward} pts</span>
        </div>
      </div>

      {isJoined && challenge.progress !== undefined && (
        <div className="space-y-2 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Your Progress</span>
            <span className="font-medium">{challenge.progress.toFixed(0)}%</span>
          </div>
          <Progress value={challenge.progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
