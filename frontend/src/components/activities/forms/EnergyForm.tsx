'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { energySchema, type EnergyFormData } from '@/types/activity';
import { useActivities } from '@/hooks/useActivities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const energySources = [
  { id: 'electricity_grid', label: 'Electricity (Grid)', unit: 'kWh', factor: 0.4 },
  { id: 'electricity_green', label: 'Electricity (Green Tariff)', unit: 'kWh', factor: 0.05 },
  { id: 'natural_gas', label: 'Natural Gas', unit: 'm³', factor: 2.0 },
  { id: 'heating_oil', label: 'Heating Oil', unit: 'liters', factor: 2.7 },
  { id: 'lpg', label: 'LPG', unit: 'liters', factor: 1.5 },
  { id: 'coal', label: 'Coal', unit: 'kg', factor: 3.0 },
];

export function EnergyForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const { logActivity } = useActivities();
  const [estimatedCo2, setEstimatedCo2] = useState<number>(0);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<EnergyFormData>({
    resolver: zodResolver(energySchema),
    defaultValues: {
      consumption: 0,
      source: 'electricity_grid',
    },
  });

  const watchAll = watch();

  useEffect(() => {
    const source = energySources.find(s => s.id === watchAll.source);
    const consumption = Number(watchAll.consumption) || 0;
    
    if (source && consumption > 0) {
      let multiplier = 1;
      switch (period) {
        case 'daily': multiplier = 1; break;
        case 'weekly': multiplier = 7; break;
        case 'monthly': multiplier = 30; break;
        case 'yearly': multiplier = 365; break;
      }
      
      const total = consumption * source.factor * multiplier;
      setEstimatedCo2(parseFloat(total.toFixed(2)));
    } else {
      setEstimatedCo2(0);
    }
  }, [watchAll, period]);

  const onSubmit = async (data: EnergyFormData) => {
    try {
      await logActivity({
        type: 'energy',
        data: { ...data, period },
        co2e: estimatedCo2,
        date: new Date().toISOString(),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to log energy activity', error);
    }
  };

  const selectedSource = energySources.find(s => s.id === watchAll.source);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Log Energy Usage</h2>
        <Badge variant="secondary">Energy</Badge>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Energy Source</label>
          <select
            {...register('source')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {energySources.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Consumption ({selectedSource?.unit})
            </label>
            <Input 
              type="number" 
              step="0.1" 
              {...register('consumption', { valueAsNumber: true })} 
              placeholder="e.g., 350"
            />
            {errors.consumption && <p className="text-red-500 text-xs mt-1">{errors.consumption.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {selectedSource?.id.includes('electricity') && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium">💡 Tip</p>
            <p className="text-xs text-green-700 mt-1">
              Switching to a green energy tariff can reduce your electricity emissions by up to 90%.
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">Estimated Emissions ({period})</p>
          <p className="text-2xl font-bold text-blue-900">{estimatedCo2} kg CO₂e</p>
          <p className="text-xs text-blue-600">
            Based on {selectedSource?.label} at {selectedSource?.factor} kg CO₂e/{selectedSource?.unit}
          </p>
        </div>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting || estimatedCo2 === 0}>
          {isSubmitting ? 'Saving...' : 'Log Usage'}
        </Button>
      </div>
    </form>
  );
}
