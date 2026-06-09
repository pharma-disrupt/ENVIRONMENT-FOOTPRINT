'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type TransportData = {
  commuteDistance: number;
  transportMode: string;
  flightsPerYear: number;
};

interface TransportFormProps {
  onNext: (data: Partial<TransportData>) => void;
  onBack?: () => void;
  initialData: TransportData;
}

export default function TransportForm({ onNext, onBack, initialData }: TransportFormProps) {
  const [formData, setFormData] = useState<TransportData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your daily commute distance (one way)?
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.commuteDistance}
              onChange={(e) => setFormData({ ...formData, commuteDistance: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500">km</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter 0 if you work from home or don't commute</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your primary mode of transport?
          </label>
          <select
            value={formData.transportMode}
            onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="car_petrol">Car (Petrol/Gasoline)</option>
            <option value="car_diesel">Car (Diesel)</option>
            <option value="car_hybrid">Car (Hybrid)</option>
            <option value="car_electric">Car (Electric)</option>
            <option value="bus">Bus</option>
            <option value="train">Train/Metro</option>
            <option value="bike">Bicycle</option>
            <option value="walk">Walk</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="mixed">Mixed/Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many flights do you take per year?
          </label>
          <select
            value={formData.flightsPerYear.toString()}
            onChange={(e) => setFormData({ ...formData, flightsPerYear: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="0">None</option>
            <option value="1">1-2 flights</option>
            <option value="3">3-5 flights</option>
            <option value="6">6-10 flights</option>
            <option value="15">11-20 flights</option>
            <option value="25">More than 20 flights</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Include both short-haul and long-haul flights</p>
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
