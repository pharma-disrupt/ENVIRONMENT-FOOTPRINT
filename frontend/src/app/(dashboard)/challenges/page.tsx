'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChallenges } from '@/hooks/useChallenges';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { Modal } from '@/components/ui/Modal';

const challengeCategories = [
  { id: 'all', label: 'All' },
  { id: 'transport', label: '🚗 Transport' },
  { id: 'energy', label: '⚡ Energy' },
  { id: 'food', label: '🍽️ Food' },
  { id: 'lifestyle', label: '🌱 Lifestyle' },
];

export default function ChallengesPage() {
  const { challenges, joinedChallenges, loading, error, joinChallenge, leaveChallenge } = useChallenges();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const filteredChallenges = selectedCategory === 'all'
    ? challenges
    : challenges?.filter(c => c.category === selectedCategory);

  const myChallenges = challenges?.filter(c => 
    joinedChallenges?.some(j => j.challengeId === c.id && j.status === 'active')
  ) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleJoin = async (challengeId: string) => {
    await joinChallenge(challengeId);
    setSelectedChallenge(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Challenges</h1>
        <p className="text-sm text-gray-600">Join challenges to reduce your footprint with others</p>
      </div>

      {/* My Challenges */}
      {myChallenges.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Active Challenges</h2>
            <Link href="/challenges/leaderboard">
              <Button variant="outline" size="sm">View Leaderboard</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myChallenges.map((challenge) => (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                <ChallengeCard challenge={challenge} isJoined />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {challengeCategories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
            size="sm"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* All Challenges Grid */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedCategory === 'all' ? 'All Challenges' : `${selectedCategory} Challenges`}
        </h2>
        
        {filteredChallenges && filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              const isJoined = joinedChallenges?.some(j => j.challengeId === challenge.id);
              
              return (
                <Card key={challenge.id} className="overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {challenge.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      </div>
                      <span className="text-2xl">{challenge.icon}</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span>👥</span>
                        <span>{challenge.participants} participants</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span>📅</span>
                        <span>{challenge.duration} days</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Reward</span>
                        <Badge variant="success">{challenge.reward} pts</Badge>
                      </div>
                    </div>

                    {isJoined ? (
                      <div className="space-y-2">
                        <Link href={`/challenges/${challenge.id}`}>
                          <Button className="w-full">View Progress</Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => leaveChallenge(challenge.id)}
                        >
                          Leave Challenge
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedChallenge(challenge.id)}
                      >
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No challenges found in this category</p>
          </Card>
        )}
      </section>

      {/* Join Confirmation Modal */}
      <Modal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        title="Join Challenge"
      >
        {(() => {
          const challenge = challenges?.find(c => c.id === selectedChallenge);
          if (!challenge) return null;
          
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{challenge.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                  <p className="text-sm text-gray-600">{challenge.duration} days • {challenge.reward} points</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700">{challenge.description}</p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">📋 What to expect:</p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Track relevant activities daily</li>
                  <li>Compete with other participants</li>
                  <li>Earn badges and rewards upon completion</li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedChallenge(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => handleJoin(challenge.id)} className="flex-1">
                  Join Now
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
