'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FootprintDonut, TrendLineChart } from '@/components/charts';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

// Mock data - will be replaced with actual API response
const mockResults = {
  totalFootprint: 12.5, // tonnes CO2e per year
  nationalAverage: 15.2,
  breakdown: {
    transport: 4.2,
    energy: 3.8,
    food: 3.0,
    shopping: 1.5,
  },
  category: 'Moderate',
  recommendations: [
    { id: 1, title: 'Reduce meat consumption', impact: 'Save 0.8 tonnes/year' },
    { id: 2, title: 'Switch to renewable energy', impact: 'Save 1.2 tonnes/year' },
    { id: 3, title: 'Use public transport twice a week', impact: 'Save 0.5 tonnes/year' },
  ],
};

export default function OnboardingResultsPage() {
  const router = useRouter();
  const [loading] = useState(false);

  const percentageBelowAverage = Math.round(
    ((mockResults.nationalAverage - mockResults.totalFootprint) / mockResults.nationalAverage) * 100
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Low': return 'text-emerald-600 bg-emerald-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
          <p className="mt-4 text-gray-600">Calculating your footprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Carbon Footprint</h1>
          <p className="text-gray-600 mt-2">Based on your lifestyle assessment</p>
        </div>

        {/* Main Result Card */}
        <Card className="shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Metrics */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide">Annual Footprint</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {mockResults.totalFootprint.toFixed(1)}
                    </span>
                    <span className="text-xl text-gray-600">tonnes CO₂e</span>
                  </div>
                </div>

                <Badge className={getCategoryColor(mockResults.category)}>
                  {mockResults.category} Impact
                </Badge>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-emerald-800 font-medium">
                    {percentageBelowAverage > 0 
                      ? `You're ${percentageBelowAverage}% below the national average!` 
                      : `You're ${Math.abs(percentageBelowAverage)}% above the national average`}
                  </p>
                  <p className="text-emerald-600 text-sm mt-1">
                    National average: {mockResults.nationalAverage} tonnes CO₂e/year
                  </p>
                </div>
              </div>

              {/* Right: Chart */}
              <div className="flex justify-center">
                <FootprintDonut data={mockResults.breakdown} size={250} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(mockResults.breakdown).map(([category, value]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{category}</p>
                  <p className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">tonnes</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Wins to Reduce Your Footprint</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockResults.recommendations.map((rec) => (
                <li key={rec.id} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <span className="text-emerald-600 text-xl">✅</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="text-sm text-emerald-700">{rec.impact}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/goals">Set Reduction Goals</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/activities/log">Log Your First Activity</Link>
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 pt-4">
          Remember: Small changes add up! Start with one or two recommendations and build from there.
        </p>
      </div>
    </div>
  );
}
