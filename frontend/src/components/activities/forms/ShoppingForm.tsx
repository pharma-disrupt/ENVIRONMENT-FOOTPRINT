'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shoppingSchema, type ShoppingFormData } from '@/types/activity';
import { useActivities } from '@/hooks/useActivities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const shoppingCategories = [
  { id: 'clothing', label: 'Clothing & Footwear', factor: 15.0, icon: '👕' },
  { id: 'electronics', label: 'Electronics', factor: 50.0, icon: '💻' },
  { id: 'furniture', label: 'Furniture', factor: 30.0, icon: '🪑' },
  { id: 'household', label: 'Household Items', factor: 8.0, icon: '🏠' },
  { id: 'personal', label: 'Personal Care', factor: 5.0, icon: '🧴' },
  { id: 'books_media', label: 'Books & Media', factor: 2.0, icon: '📚' },
  { id: 'sports', label: 'Sports & Leisure', factor: 10.0, icon: '⚽' },
  { id: 'other', label: 'Other', factor: 5.0, icon: '🛍️' },
];

export function ShoppingForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const { logActivity } = useActivities();
  const [estimatedCo2, setEstimatedCo2] = useState<number>(0);

  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm<ShoppingFormData>({
    resolver: zodResolver(shoppingSchema),
    defaultValues: {
      items: [{ category: 'other', amount: 0, secondhand: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchAll = watch();

  useEffect(() => {
    let total = 0;

    watchAll.items?.forEach((item: any) => {
      const category = shoppingCategories.find(c => c.id === item.category);
      if (category && item.amount > 0) {
        let itemEmissions = category.factor * (item.amount / 100); // Amount in currency units
        if (item.secondhand) {
          itemEmissions *= 0.3; // 70% reduction for secondhand
        }
        total += itemEmissions;
      }
    });

    setEstimatedCo2(parseFloat(total.toFixed(2)));
  }, [watchAll]);

  const onSubmit = async (data: ShoppingFormData) => {
    try {
      await logActivity({
        type: 'shopping',
        data,
        co2e: estimatedCo2,
        date: new Date().toISOString(),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to log shopping activity', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Log Shopping</h2>
        <Badge variant="secondary">Shopping</Badge>
      </div>

      <Card className="p-6 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-800 font-medium">ℹ️ How it works</p>
          <p className="text-xs text-blue-700 mt-1">
            Enter the amount spent in your local currency. Emissions are estimated based on average 
            carbon intensity per dollar/euro spent in each category.
          </p>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-5">
                <select
                  {...register(`items.${index}.category`)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {shoppingCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  {...register(`items.${index}.amount`, { valueAsNumber: true })}
                />
              </div>
              <div className="col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id={`items.${index}.secondhand`}
                  {...register(`items.${index}.secondhand`)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  title="Secondhand item"
                />
                <label htmlFor={`items.${index}.secondhand`} className="sr-only">Secondhand</label>
              </div>
              <div className="col-span-1">
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" onClick={() => remove(index)}>✕</Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => append({ category: 'other', amount: 0, secondhand: false })}
          >
            + Add Item
          </Button>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="secondhand-info"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              disabled
            />
            <label htmlFor="secondhand-info">✓ = Secondhand (-70%)</label>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Estimated:</span>
            <span className="text-2xl font-bold text-blue-900">{estimatedCo2} kg CO₂e</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on spending across {fields.length} item{fields.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-medium">♻️ Sustainable Shopping Tips</p>
          <ul className="text-xs text-green-700 mt-1 space-y-1 list-disc list-inside">
            <li>Buying secondhand can reduce emissions by up to 70%</li>
            <li>Choose quality items that last longer</li>
            <li>Support brands with carbon-neutral shipping</li>
          </ul>
        </div>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting || estimatedCo2 === 0}>
          {isSubmitting ? 'Saving...' : 'Log Shopping'}
        </Button>
      </div>
    </form>
  );
}
