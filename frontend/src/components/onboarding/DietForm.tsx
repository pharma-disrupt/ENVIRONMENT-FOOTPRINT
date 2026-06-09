'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type DietData = {
  dietType: string;
  meatConsumption: string;
  dairyConsumption: string;
};

interface DietFormProps {
  onNext: (data: Partial<DietData>) => void;
  onBack?: () => void;
  initialData: DietData;
}

export default function DietForm({ onNext, onBack, initialData }: DietFormProps) {
  const [formData, setFormData] = useState<DietData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you describe your diet?
          </label>
          <select
            value={formData.dietType}
            onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="vegan">Vegan (No animal products)</option>
            <option value="vegetarian">Vegetarian (No meat, but dairy/eggs)</option>
            <option value="pescatarian">Pescatarian (Fish, but no meat)</option>
            <option value="mixed_low">Mixed - Low Meat (1-2 times/week)</option>
            <option value="mixed_moderate">Mixed - Moderate (3-5 times/week)</option>
            <option value="mixed_high">Mixed - High (Daily)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often do you consume meat?
          </label>
          <select
            value={formData.meatConsumption}
            onChange={(e) => setFormData({ ...formData, meatConsumption: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="none">Never</option>
            <option value="rarely">Rarely (1-2 times/month)</option>
            <option value="low">Low (1-2 times/week)</option>
            <option value="moderate">Moderate (3-5 times/week)</option>
            <option value="high">High (Daily)</option>
            <option value="very_high">Very High (Multiple times/day)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often do you consume dairy products?
          </label>
          <select
            value={formData.dairyConsumption}
            onChange={(e) => setFormData({ ...formData, dairyConsumption: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="none">Never</option>
            <option value="rarely">Rarely (1-2 times/month)</option>
            <option value="low">Low (1-2 times/week)</option>
            <option value="moderate">Moderate (3-5 times/week)</option>
            <option value="high">High (Daily)</option>
          </select>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Did you know?</strong> Food production accounts for about 26% of global greenhouse gas emissions. 
            Reducing meat and dairy consumption is one of the most effective ways to lower your carbon footprint.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          {onBack ? (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit">Next</Button>
        </div>
      </CardContent>
    </form>
  );
}
