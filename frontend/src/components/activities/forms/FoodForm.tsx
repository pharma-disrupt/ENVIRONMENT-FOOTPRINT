'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { foodSchema, type FoodFormData } from '@/types/activity';
import { useActivities } from '@/hooks/useActivities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const dietTypes = [
  { id: 'omnivore', label: 'Omnivore (Average)', factor: 2.5 },
  { id: 'low_meat', label: 'Low Meat', factor: 1.8 },
  { id: 'vegetarian', label: 'Vegetarian', factor: 1.2 },
  { id: 'vegan', label: 'Vegan', factor: 0.9 },
];

const mealCategories = [
  { id: 'beef_lamb', label: 'Beef/Lamb', factor: 27.0, icon: '🥩' },
  { id: 'pork', label: 'Pork', factor: 12.0, icon: '🥓' },
  { id: 'chicken', label: 'Chicken', factor: 6.0, icon: '🍗' },
  { id: 'fish', label: 'Fish/Seafood', factor: 5.0, icon: '🐟' },
  { id: 'dairy', label: 'Dairy', factor: 3.0, icon: '🧀' },
  { id: 'eggs', label: 'Eggs', factor: 4.5, icon: '🥚' },
  { id: 'grains', label: 'Grains/Cereals', factor: 1.5, icon: '🌾' },
  { id: 'vegetables', label: 'Vegetables', factor: 0.5, icon: '🥬' },
  { id: 'fruits', label: 'Fruits', factor: 0.4, icon: '🍎' },
  { id: 'processed', label: 'Processed Foods', factor: 3.5, icon: '🍔' },
];

export function FoodForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const { logActivity } = useActivities();
  const [estimatedCo2, setEstimatedCo2] = useState<number>(0);
  const [calculationMode, setCalculationMode] = useState<'diet' | 'meals'>('diet');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue } = useForm<FoodFormData>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      dietType: 'omnivore',
      meals: [{ category: 'beef_lamb', quantity: 0, unit: 'kg' }],
      localOrganic: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: watch(),
    name: 'meals',
  });

  const watchAll = watch();

  useEffect(() => {
    let total = 0;

    if (calculationMode === 'diet') {
      const diet = dietTypes.find(d => d.id === watchAll.dietType);
      if (diet) {
        // Assume daily average
        total = diet.factor;
      }
    } else {
      watchAll.meals?.forEach((meal: any) => {
        const category = mealCategories.find(c => c.id === meal.category);
        if (category && meal.quantity > 0) {
          total += category.factor * meal.quantity;
        }
      });
    }

    // Apply modifiers
    if (watchAll.localOrganic) {
      total *= 0.85; // 15% reduction for local/organic
    }

    setEstimatedCo2(parseFloat(total.toFixed(2)));
  }, [watchAll, calculationMode]);

  const onSubmit = async (data: FoodFormData) => {
    try {
      await logActivity({
        type: 'food',
        data: { ...data, calculationMode },
        co2e: estimatedCo2,
        date: new Date().toISOString(),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to log food activity', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Log Food Consumption</h2>
        <Badge variant="secondary">Food</Badge>
      </div>

      <Card className="p-4">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={calculationMode === 'diet' ? 'primary' : 'outline'}
            onClick={() => setCalculationMode('diet')}
            className="flex-1"
          >
            📊 By Diet Type
          </Button>
          <Button
            type="button"
            variant={calculationMode === 'meals' ? 'primary' : 'outline'}
            onClick={() => setCalculationMode('meals')}
            className="flex-1"
          >
            🍽️ By Meals
          </Button>
        </div>
      </Card>

      {calculationMode === 'diet' ? (
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Diet Type</label>
            <select
              {...register('dietType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {dietTypes.map((d) => (
                <option key={d.id} value={d.id}>{d.label} ({d.factor} kg CO₂e/day)</option>
              ))}
            </select>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">🌱 Impact</p>
            <p className="text-xs text-amber-700 mt-1">
              Switching from omnivore to vegetarian can save ~1.3 kg CO₂e per day.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <select
                  {...register(`meals.${index}.category`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {mealCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Qty"
                  className="w-24"
                  {...register(`meals.${index}.quantity`, { valueAsNumber: true })}
                />
                <span className="py-2 text-sm text-gray-500">kg</span>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" onClick={() => remove(index)}>✕</Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => append({ category: 'vegetables', quantity: 0, unit: 'kg' })}>
            + Add Item
          </Button>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <input
              type="checkbox"
              id="localOrganic"
              {...register('localOrganic')}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="localOrganic" className="text-sm text-gray-700">
              Mostly local & organic produce (-15%)
            </label>
          </div>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">Estimated Daily Emissions</p>
        <p className="text-2xl font-bold text-blue-900">{estimatedCo2} kg CO₂e</p>
        {calculationMode === 'diet' && (
          <p className="text-xs text-blue-600">Based on {dietTypes.find(d => d.id === watchAll.dietType)?.label}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting || estimatedCo2 === 0}>
          {isSubmitting ? 'Saving...' : 'Log Consumption'}
        </Button>
      </div>
    </form>
  );
}
