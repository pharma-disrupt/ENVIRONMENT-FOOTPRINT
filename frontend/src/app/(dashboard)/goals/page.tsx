'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGoals } from '@/hooks/useGoals';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GoalCard } from '@/components/goals/GoalCard';
import { GoalForm } from '@/components/goals/GoalForm';
import { Modal } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';

const goalTypes = [
  { id: 'reduction', label: 'Reduction', icon: '📉', color: 'text-green-600' },
  { id: 'activity', label: 'Activity Limit', icon: '🎯', color: 'text-blue-600' },
  { id: 'habit', label: 'Habit Building', icon: '✅', color: 'text-purple-600' },
];

export default function GoalsPage() {
  const { goals, loading, error, createGoal } = useGoals();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const activeGoals = goals?.filter(g => g.status === 'active') || [];
  const completedGoals = goals?.filter(g => g.status === 'completed') || [];
  
  const filteredGoals = filter === 'all' 
    ? goals 
    : filter === 'active' 
      ? activeGoals 
      : completedGoals;

  const totalProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => sum + (g.current / g.target * 100), 0) / activeGoals.length
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <Button onClick={() => setShowCreateModal(true)}>+ New Goal</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Goals</h1>
          <p className="text-sm text-gray-600">Set and track your carbon reduction targets</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ New Goal</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📊</span>
            <Badge variant="secondary">{activeGoals.length} Active</Badge>
          </div>
          <p className="text-sm text-gray-600">Active Goals</p>
          <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">✅</span>
            <Badge variant="success">{completedGoals.length} Done</Badge>
          </div>
          <p className="text-sm text-gray-600">Completed Goals</p>
          <p className="text-2xl font-bold text-gray-900">{completedGoals.length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-sm text-gray-600">Average Progress</p>
          <div className="mt-2">
            <Progress value={totalProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{totalProgress.toFixed(0)}% complete</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals && filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <Link key={goal.id} href={`/goals/${goal.id}`}>
              <GoalCard goal={goal} />
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'completed' 
              ? "You haven't completed any goals yet. Keep going!" 
              : "Start your sustainability journey by setting your first goal."}
          </p>
          {filter !== 'completed' && (
            <Button onClick={() => setShowCreateModal(true)}>Create Your First Goal</Button>
          )}
        </Card>
      )}

      {/* Create Goal Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Goal"
      >
        <GoalForm
          onSubmit={async (data) => {
            await createGoal(data);
            setShowCreateModal(false);
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
