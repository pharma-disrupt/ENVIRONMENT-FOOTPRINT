/**
 * Profile Schemas
 * Zod validation schemas for user profile operations
 */

import { z } from 'zod';

export const householdSizeSchema = z.enum(['1', '2', '3', '4', '5+']);

export const housingTypeSchema = z.enum([
  'house_detached',
  'house_semi_detached',
  'house_terrace',
  'apartment_flat',
  'studio',
  'other',
]);

export const energyProviderSchema = z.enum([
  'grid_standard',
  'green_energy',
  'solar',
  'wind',
  'mixed',
]);

export const lifestyleSchema = z.object({
  householdSize: householdSizeSchema,
  housingType: housingTypeSchema.optional(),
  location: z.object({
    country: z.string().min(2, 'Country is required'),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  energyProvider: energyProviderSchema.optional(),
  monthlyEnergyBill: z.number().positive('Must be a positive number').optional(),
  vehicleOwnership: z.boolean().optional(),
  vehicleType: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'none']).optional(),
  publicTransportUsage: z.enum(['daily', 'weekly', 'monthly', 'rarely', 'never']).optional(),
  flightFrequency: z.enum(['never', 'once_year', 'few_times_year', 'monthly', 'weekly']).optional(),
  dietType: z.enum(['vegan', 'vegetarian', 'pescatarian', 'omnivore', 'meat_heavy']).optional(),
  recyclingHabits: z.enum(['always', 'often', 'sometimes', 'never']).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  avatar: z.string().url('Invalid URL format').optional(),
  timezone: z.string().optional(),
  language: z.string().length(2, 'Language must be ISO 639-1 code').optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    goalReminders: z.boolean().optional(),
    challengeUpdates: z.boolean().optional(),
  }).optional(),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).optional(),
    showFootprint: z.boolean().optional(),
    showAchievements: z.boolean().optional(),
  }).optional(),
});

export const onboardingSchema = lifestyleSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
});

// Type exports
export type HouseholdSize = z.infer<typeof householdSizeSchema>;
export type HousingType = z.infer<typeof housingTypeSchema>;
export type EnergyProvider = z.infer<typeof energyProviderSchema>;
export type LifestyleInput = z.infer<typeof lifestyleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
