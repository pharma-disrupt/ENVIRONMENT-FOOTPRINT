'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

type EnergyData = {
  electricityUsage: number;
  heatingType: string;
  renewableEnergy: boolean;
};

interface EnergyFormProps {
  onNext: (data: Partial<EnergyData>) => void;
  onBack?: () => void;
  initialData: EnergyData;
  onSubmit?: (data: Partial<EnergyData>) => void;
  isLoading?: boolean;
}

export default function EnergyForm({ 
  onNext, 
  onBack, 
  initialData, 
  onSubmit,
  isLoading = false 
}: EnergyFormProps) {
  const [formData, setFormData] = useState<EnergyData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your monthly electricity usage?
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="10"
              value={formData.electricityUsage}
              onChange={(e) => setFormData({ ...formData, electricityUsage: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500">kWh</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Check your electricity bill for average monthly usage
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of heating do you use?
          </label>
          <select
            value={formData.heatingType}
            onChange={(e) => setFormData({ ...formData, heatingType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="electric">Electric</option>
            <option value="natural_gas">Natural Gas</option>
            <option value="heating_oil">Heating Oil</option>
            <option value="lpg">LPG/Propane</option>
            <option value="wood">Wood/Biomass</option>
            <option value="heat_pump">Heat Pump</option>
            <option value="district">District Heating</option>
            <option value="none">No Heating System</option>
          </select>
        </div>

        <div>
          <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.renewableEnergy}
              onChange={(e) => setFormData({ ...formData, renewableEnergy: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="block text-sm font-medium text-gray-900">
                I use renewable energy
              </span>
              <span className="block text-xs text-gray-500">
                Solar panels, wind power, green energy tariff, etc.
              </span>
            </div>
          </label>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg">
          <p className="text-sm text-emerald-800">
            <strong>Tip:</strong> Switching to renewable energy can reduce your home's carbon footprint by up to 50%.
            Many energy providers now offer green energy tariffs at competitive prices.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          {onBack ? (
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit" disabled={isLoading} loading={isLoading}>
            {onSubmit ? 'Calculate My Footprint' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </form>
  );
}
