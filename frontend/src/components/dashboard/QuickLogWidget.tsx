'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CategoryPicker } from '@/components/activities/CategoryPicker';
import Link from 'next/link';

export function QuickLogWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'energy', label: 'Energy', icon: '⚡' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'shopping', label: 'Shopping', icon: '🛒' },
  ];

  return (
    <>
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Log
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your activities
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setIsModalOpen(true);
              }}
              className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span className="mb-2 text-2xl">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {category.label}
              </span>
            </button>
          ))}
        </div>

        <Link href="/activities/log" className="mt-4 block">
          <Button variant="outline" className="w-full">
            Full Activity Form
          </Button>
        </Link>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        title={`Log ${selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Activity'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Quick log form for {selectedCategory} would go here.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle quick log submission
                setIsModalOpen(false);
                setSelectedCategory(null);
              }}
            >
              Save Activity
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
