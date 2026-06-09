'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

type HouseholdData = {
  householdSize: number;
  housingType: string;
  location: string;
};

interface HouseholdFormProps {
  onNext: (data: Partial<HouseholdData>) => void;
  onBack?: () => void;
  initialData: HouseholdData;
}

export default function HouseholdForm({ onNext, onBack, initialData }: HouseholdFormProps) {
  const [formData, setFormData] = useState<HouseholdData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many people live in your household?
          </label>
          <Input
            type="number"
            min="1"
            max="20"
            value={formData.householdSize}
            onChange={(e) => setFormData({ ...formData, householdSize: parseInt(e.target.value) || 1 })}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Include yourself and all residents</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of housing do you live in?
          </label>
          <select
            value={formData.housingType}
            onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="apartment">Apartment/Flat</option>
            <option value="house_small">Small House (< 100 m²)</option>
            <option value="house_medium">Medium House (100-200 m²)</option>
            <option value="house_large">Large House (> 200 m²)</option>
            <option value="shared">Shared Housing/Room</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where do you live? (Country/Region)
          </label>
          <Input
            type="text"
            placeholder="e.g., United States, California"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <p className="text-xs text-gray-500 mt-1">This helps us use accurate energy grid data</p>
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
