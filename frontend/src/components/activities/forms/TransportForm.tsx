'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transportSchema, type TransportFormData } from '@/types/activity';
import { useActivities } from '@/hooks/useActivities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CategoryPicker } from '../CategoryPicker';
import { Badge } from '@/components/ui/Badge';

const vehicleTypes = [
  { id: 'car_petrol', label: 'Car (Petrol)', factor: 0.17 },
  { id: 'car_diesel', label: 'Car (Diesel)', factor: 0.16 },
  { id: 'car_electric', label: 'Car (Electric)', factor: 0.05 },
  { id: 'bus', label: 'Bus', factor: 0.08 },
  { id: 'train', label: 'Train', factor: 0.04 },
  { id: 'motorcycle', label: 'Motorcycle', factor: 0.11 },
  { id: 'flight_short', label: 'Flight (Short-haul)', factor: 0.25 },
  { id: 'flight_long', label: 'Flight (Long-haul)', factor: 0.19 },
];

export function TransportForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const { logActivity } = useActivities();
  const [estimatedCo2, setEstimatedCo2] = useState<number>(0);
  const [step, setStep] = useState<'category' | 'details'>('category');
  const [selectedCategory, setSelectedCategory] = useState<'car' | 'public' | 'flight' | 'motorcycle'>('car');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      distance: 0,
      passengers: 1,
      vehicleType: 'car_petrol',
    },
  });

  const watchAll = watch();

  // Real-time CO2 estimation
  useState(() => {
    const vehicle = vehicleTypes.find(v => v.id === watchAll.vehicleType);
    const distance = Number(watchAll.distance) || 0;
    const passengers = Number(watchAll.passengers) || 1;
    
    if (vehicle && distance > 0) {
      const total = (distance * vehicle.factor) / passengers;
      setEstimatedCo2(parseFloat(total.toFixed(2)));
    } else {
      setEstimatedCo2(0);
    }
  });

  const onSubmit = async (data: TransportFormData) => {
    try {
      await logActivity({
        type: 'transport',
        data,
        co2e: estimatedCo2,
        date: new Date().toISOString(),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to log transport activity', error);
    }
  };

  if (step === 'category') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Select Transport Mode</h2>
        <CategoryPicker
          selected={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat as any);
            setStep('details');
          }}
          categories={[
            { id: 'car', label: 'Car', icon: '🚗' },
            { id: 'public', label: 'Public Transit', icon: '🚌' },
            { id: 'flight', label: 'Flight', icon: '✈️' },
            { id: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
          ]}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => setStep('category')}>← Back</Button>
        <Badge variant="secondary">Transport</Badge>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            {...register('vehicleType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {vehicleTypes.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance (km)</label>
            <Input type="number" step="0.1" {...register('distance', { valueAsNumber: true })} />
            {errors.distance && <p className="text-red-500 text-xs mt-1">{errors.distance.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Passengers</label>
            <Input type="number" min="1" {...register('passengers', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">Estimated Emissions</p>
          <p className="text-2xl font-bold text-blue-900">{estimatedCo2} kg CO₂e</p>
          <p className="text-xs text-blue-600">Based on {watchAll.vehicleType && vehicleTypes.find(v => v.id === watchAll.vehicleType)?.label}</p>
        </div>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting || estimatedCo2 === 0}>
          {isSubmitting ? 'Saving...' : 'Log Activity'}
        </Button>
      </div>
    </form>
  );
}
