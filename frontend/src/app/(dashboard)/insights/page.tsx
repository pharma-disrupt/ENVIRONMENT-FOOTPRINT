'use client';

import { useInsights } from '@/hooks/useInsights';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InsightCard } from '@/components/insights/InsightCard';
import { TipsList } from '@/components/insights/TipsList';

const categoryFilters = [
  { id: 'all', label: 'All' },
  { id: 'transport', label: '🚗 Transport' },
  { id: 'energy', label: '⚡ Energy' },
  { id: 'food', label: '🍽️ Food' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'lifestyle', label: '🌱 Lifestyle' },
];

export default function InsightsPage() {
  const { insights, tips, loading, error, markAsRead, dismissInsight } = useInsights();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights & Tips</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const unreadInsights = insights?.filter(i => !i.read) || [];
  const readInsights = insights?.filter(i => i.read) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Insights & Recommendations</h1>
        <p className="text-sm text-gray-600">Personalized tips to reduce your carbon footprint</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">New Insights</p>
              <p className="text-3xl font-bold">{unreadInsights.length}</p>
            </div>
            <span className="text-4xl">💡</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tips Available</p>
              <p className="text-3xl font-bold text-gray-900">{tips?.length || 0}</p>
            </div>
            <span className="text-4xl">📚</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Potential Savings</p>
              <p className="text-3xl font-bold text-green-600">
                {unreadInsights.reduce((sum, i) => sum + (i.estimatedSavings || 0), 0).toFixed(1)} kg
              </p>
            </div>
            <span className="text-4xl">🌍</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Insights Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Insights */}
          {unreadInsights.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">New Recommendations</h2>
                <Badge variant="success">{unreadInsights.length} new</Badge>
              </div>
              <div className="space-y-4">
                {unreadInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onMarkAsRead={() => markAsRead(insight.id)}
                    onDismiss={() => dismissInsight(insight.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Insights */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">All Insights</h2>
              <div className="flex space-x-2">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat.id}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            {insights && insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onMarkAsRead={() => markAsRead(insight.id)}
                    onDismiss={() => dismissInsight(insight.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <span className="text-4xl mb-2 block">🎉</span>
                <p className="text-gray-600">No insights available. Keep logging activities!</p>
              </Card>
            )}
          </section>
        </div>

        {/* Sidebar - Quick Tips */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">⚡</span>
              <h2 className="font-semibold text-gray-900">Quick Tips</h2>
            </div>
            {tips && tips.length > 0 ? (
              <TipsList tips={tips.slice(0, 5)} />
            ) : (
              <p className="text-sm text-gray-500">Tips will appear here based on your activities</p>
            )}
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">🌟 Did You Know?</h3>
            <div className="space-y-3 text-sm text-green-800">
              <p className="flex items-start">
                <span className="mr-2">•</span>
                <span>Switching to LED bulbs can reduce lighting energy by 75%</span>
              </p>
              <p className="flex items-start">
                <span className="mr-2">•</span>
                <span>One meatless day per week saves ~100 kg CO₂e annually</span>
              </p>
              <p className="flex items-start">
                <span className="mr-2">•</span>
                <span>Proper tire inflation improves fuel efficiency by 3%</span>
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Your Impact Areas</h3>
            <div className="space-y-3">
              {[
                { category: 'Transport', percentage: 35, color: 'bg-blue-500' },
                { category: 'Energy', percentage: 25, color: 'bg-amber-500' },
                { category: 'Food', percentage: 28, color: 'bg-green-500' },
                { category: 'Shopping', percentage: 12, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
