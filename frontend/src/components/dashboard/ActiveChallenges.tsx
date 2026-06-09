'use client';

import { Challenge } from '@/types/challenge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface ActiveChallengesProps {
  challenges: Challenge[];
  loading: boolean;
}

export function ActiveChallenges({ challenges, loading }: ActiveChallengesProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Challenges
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Join community efforts
          </p>
        </div>
        <Link href="/challenges">
          <span className="text-sm font-medium text-green-600 hover:text-green-700">
            View All →
          </span>
        </Link>
      </div>

      <div className="space-y-4">
        {activeChallenges.slice(0, 3).map((challenge) => (
          <div
            key={challenge.id}
            className="rounded-lg border p-4 dark:border-gray-700"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {challenge.description}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  challenge.difficulty === 'easy'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : challenge.difficulty === 'medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {challenge.difficulty}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {challenge.progress}% complete
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {challenge.endDate ? `Ends ${new Date(challenge.endDate).toLocaleDateString()}` : ''}
              </span>
            </div>

            <Progress value={challenge.progress} className="mb-3" />

            <Link href={`/challenges/${challenge.id}`} className="block">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        ))}

        {activeChallenges.length === 0 && (
          <div className="py-8 text-center">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              No active challenges. Join one to start making an impact!
            </p>
            <Link href="/challenges">
              <Button>Browse Challenges</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
