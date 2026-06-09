/**
 * Goals Schemas
 * Zod validation schemas for carbon reduction goals
 */

import { z } from 'zod';

export const goalCategorySchema = z.enum([
  'transport',
  'energy',
  'food',
  'shopping',
  'overall',
]);

export const goalTypeSchema = z.enum([
  'reduction', // Reduce emissions by X%
  'absolute', // Stay under X kg CO2e
  'behavioral', // Complete X actions
  'custom', // User-defined metric
]);

export const goalTimeframeSchema = z.enum([
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
]);

export const createGoalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  category: goalCategorySchema,
  type: goalTypeSchema,
  targetValue: z.number().positive('Target must be positive'),
  unit: z.string().default('kg CO2e'),
  timeframe: goalTimeframeSchema,
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
  baselineValue: z.number().optional(),
  reminderEnabled: z.boolean().default(true),
  reminderFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

export const updateGoalSchema = createGoalSchema.partial();

export const goalProgressSchema = z.object({
  currentValue: z.number().nonnegative('Current value cannot be negative'),
  note: z.string().max(500).optional(),
});

// Type exports
export type GoalCategory = z.infer<typeof goalCategorySchema>;
export type GoalType = z.infer<typeof goalTypeSchema>;
export type GoalTimeframe = z.infer<typeof goalTimeframeSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type GoalProgressInput = z.infer<typeof goalProgressSchema>;
