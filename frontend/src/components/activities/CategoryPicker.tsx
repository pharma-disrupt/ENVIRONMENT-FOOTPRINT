'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const categories = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'flight', label: 'Flight', icon: '✈️' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
];

interface CategoryPickerProps {
  onSelect: (category: string) => void;
}

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (categoryId: string) => {
    setSelected(categoryId);
    onSelect(categoryId);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleSelect(category.id)}
          className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-all ${
            selected === category.id
              ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <span className="mb-2 text-3xl">{category.icon}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {category.label}
          </span>
        </button>
      ))}
    </div>
  );
}
