/**
 * Challenge Schemas
 * Zod validation schemas for community challenges
 */

import { z } from 'zod';

export const challengeTypeSchema = z.enum([
  'individual', // Personal challenge
  'community', // Group challenge with leaderboard
  'global', // Platform-wide challenge
]);

export const challengeCategorySchema = z.enum([
  'transport',
  'energy',
  'food',
  'shopping',
  'mixed',
]);

export const challengeDifficultySchema = z.enum([
  'easy',
  'medium',
  'hard',
  'expert',
]);

export const challengeDurationSchema = z.enum([
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
]);

export const createChallengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  type: challengeTypeSchema,
  category: challengeCategorySchema,
  difficulty: challengeDifficultySchema,
  duration: challengeDurationSchema,
  startDate: z.string().date(),
  endDate: z.string().date(),
  targetMetric: z.enum(['reduction_percentage', 'absolute_reduction', 'actions_completed']),
  targetValue: z.number().positive('Target must be positive'),
  maxParticipants: z.number().positive().optional(),
  isPublic: z.boolean().default(true),
  rules: z.array(z.string()).optional(),
  rewards: z.array(z.string()).optional(),
});

export const updateChallengeSchema = createChallengeSchema.partial();

export const joinChallengeSchema = z.object({
  agreeToRules: z.boolean().refine(val => val === true, 'You must agree to the challenge rules'),
});

export const submitChallengeProofSchema = z.object({
  action: z.string().min(1, 'Action description is required'),
  evidence: z.string().url('Evidence must be a valid URL').optional(),
  notes: z.string().max(500).optional(),
});

export const challengeFiltersSchema = z.object({
  type: challengeTypeSchema.optional(),
  category: challengeCategorySchema.optional(),
  difficulty: challengeDifficultySchema.optional(),
  status: z.enum(['upcoming', 'active', 'completed']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  sortBy: z.enum(['startDate', 'endDate', 'participants', 'difficulty']).default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports
export type ChallengeType = z.infer<typeof challengeTypeSchema>;
export type ChallengeCategory = z.infer<typeof challengeCategorySchema>;
export type ChallengeDifficulty = z.infer<typeof challengeDifficultySchema>;
export type ChallengeDuration = z.infer<typeof challengeDurationSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export type JoinChallengeInput = z.infer<typeof joinChallengeSchema>;
export type SubmitChallengeProofInput = z.infer<typeof submitChallengeProofSchema>;
export type ChallengeFiltersInput = z.infer<typeof challengeFiltersSchema>;
