'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalSchema, type GoalFormData } from '@/types/goal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<GoalFormData>;
}

const goalTypes = [
  { id: 'reduction', label: '📉 Reduction', desc: 'Reduce total footprint' },
  { id: 'activity', label: '🎯 Activity Limit', desc: 'Limit specific activities' },
  { id: 'habit', label: '✅ Habit Building', desc: 'Build sustainable habits' },
];

export function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: 'reduction',
      title: '',
      description: '',
      target: 0,
      timeframe: 'monthly',
      ...initialData,
    },
  });

  const selectedType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
        <div className="grid grid-cols-1 gap-2">
          {goalTypes.map((type) => (
            <label
              key={type.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedType === type.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={type.id}
                {...register('type')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{type.label}</p>
                <p className="text-xs text-gray-500">{type.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          placeholder="e.g., Reduce transport emissions by 20%"
          {...register('title')}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          rows={2}
          placeholder="Add more details about your goal..."
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Value</label>
          <Input
            type="number"
            step="0.1"
            placeholder="e.g., 100"
            {...register('target', { valueAsNumber: true })}
          />
          {errors.target && <p className="text-red-500 text-xs mt-1">{errors.target.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Timeframe</label>
          <select
            {...register('timeframe')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">💡 Tip</p>
        <p className="text-xs text-blue-700 mt-1">
          Start with achievable goals. A 10-20% reduction is realistic for most people in the first month.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
}
