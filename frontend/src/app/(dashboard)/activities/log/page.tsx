'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TransportForm } from '@/components/activities/forms/TransportForm';
import { EnergyForm } from '@/components/activities/forms/EnergyForm';
import { FoodForm } from '@/components/activities/forms/FoodForm';
import { ShoppingForm } from '@/components/activities/forms/ShoppingForm';

const categories = [
  { id: 'transport', label: 'Transport', icon: '🚗', color: 'bg-blue-500' },
  { id: 'energy', label: 'Energy', icon: '⚡', color: 'bg-amber-500' },
  { id: 'food', label: 'Food', icon: '🍽️', color: 'bg-green-500' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
];

export default function LogActivityPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSuccess = () => {
    router.push('/activities');
  };

  const handleCancel = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log Activity</h1>
        <p className="text-sm text-gray-600">Record a carbon-emitting activity to track your footprint</p>
      </div>

      {!selectedCategory ? (
        /* Category Selection */
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
              >
                <span className="text-4xl mb-3">{cat.icon}</span>
                <span className="font-medium text-gray-900 group-hover:text-indigo-700">{cat.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        /* Dynamic Form */
        <Card className="p-6">
          {selectedCategory === 'transport' && (
            <TransportForm onCancel={handleCancel} onSuccess={handleSuccess} />
          )}
          {selectedCategory === 'energy' && (
            <EnergyForm onCancel={handleCancel} onSuccess={handleSuccess} />
          )}
          {selectedCategory === 'food' && (
            <FoodForm onCancel={handleCancel} onSuccess={handleSuccess} />
          )}
          {selectedCategory === 'shopping' && (
            <ShoppingForm onCancel={handleCancel} onSuccess={handleSuccess} />
          )}
        </Card>
      )}

      {/* Help Text */}
      {!selectedCategory && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Accurate Tracking</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Log activities as soon as possible for better accuracy</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use average values if you don't know exact numbers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Regular logging helps identify patterns and reduction opportunities</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
