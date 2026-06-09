/**
 * Activity Schemas
 * Zod validation schemas for carbon activity logging
 */

import { z } from 'zod';

// Transport activity schemas
const transportModeSchema = z.enum([
  'car',
  'bus',
  'train',
  'metro',
  'flight',
  'motorcycle',
  'bicycle',
  'walk',
]);

const vehicleTypeSchema = z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'small', 'medium', 'large']);

const flightClassSchema = z.enum(['economy', 'premium', 'business', 'first']);

const flightTypeSchema = z.enum(['domestic', 'international_short', 'international_long']);

export const transportActivitySchema = z.object({
  mode: transportModeSchema,
  distance: z.number().positive('Distance must be positive'),
  unit: z.enum(['km', 'miles']).default('km'),
  vehicleType: vehicleTypeSchema.optional(),
  fuelEfficiency: z.number().positive().optional(),
  passengers: z.number().min(1).max(8).optional(),
  flightClass: flightClassSchema.optional(),
  flightType: flightTypeSchema.optional(),
});

// Energy activity schemas
const energyTypeSchema = z.enum(['electricity', 'natural_gas', 'heating_oil', 'lpg', 'renewable']);

const energyUnitSchema = z.enum(['kWh', 'MWh', 'therms', 'ccf', 'liters', 'gallons']);

export const energyActivitySchema = z.object({
  type: energyTypeSchema,
  consumption: z.number().positive('Consumption must be positive'),
  unit: energyUnitSchema,
  location: z.string().length(2, 'Location must be ISO country code').optional(),
  renewablePercentage: z.number().min(0).max(100).optional(),
});

// Food activity schemas
const foodCategorySchema = z.enum([
  'meat',
  'dairy',
  'seafood',
  'grains',
  'vegetables',
  'fruits',
  'beverages',
  'processed',
]);

const foodUnitSchema = z.enum(['kg', 'g', 'lbs', 'servings']);

const productionMethodSchema = z.enum(['conventional', 'organic', 'regenerative', 'local']);

const transportationSchema = z.enum(['local', 'domestic', 'international_air', 'international_sea']);

const packagingSchema = z.enum(['none', 'minimal', 'recyclable', 'plastic', 'mixed']);

export const foodActivitySchema = z.object({
  category: foodCategorySchema,
  item: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: foodUnitSchema,
  productionMethod: productionMethodSchema.optional(),
  transportation: transportationSchema.optional(),
  packaging: packagingSchema.optional(),
});

// Shopping activity schemas
const shoppingCategorySchema = z.enum([
  'clothing',
  'electronics',
  'furniture',
  'books',
  'personal_care',
  'household',
  'other',
]);

export const shoppingActivitySchema = z.object({
  category: shoppingCategorySchema,
  amount: z.number().positive('Amount spent must be positive'),
  currency: z.string().length(3, 'Currency must be ISO code').default('USD'),
  itemCount: z.number().positive().optional(),
  secondhand: z.boolean().optional().default(false),
  sustainable: z.boolean().optional().default(false),
});

// Generic activity schema
export const createActivitySchema = z.object({
  category: z.enum(['transport', 'energy', 'food', 'shopping']),
  date: z.string().datetime().optional().describe('ISO 8601 datetime'),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
}).and(
  z.union([
    z.object({
      category: z.literal('transport'),
      data: transportActivitySchema,
    }),
    z.object({
      category: z.literal('energy'),
      data: energyActivitySchema,
    }),
    z.object({
      category: z.literal('food'),
      data: foodActivitySchema,
    }),
    z.object({
      category: z.literal('shopping'),
      data: shoppingActivitySchema,
    }),
  ])
);

export const updateActivitySchema = createActivitySchema.partial();

export const activityFiltersSchema = z.object({
  category: z.enum(['transport', 'energy', 'food', 'shopping']).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  minEmissions: z.number().optional(),
  maxEmissions: z.number().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['date', 'emissions', 'category']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type TransportActivityInput = z.infer<typeof transportActivitySchema>;
export type EnergyActivityInput = z.infer<typeof energyActivitySchema>;
export type FoodActivityInput = z.infer<typeof foodActivitySchema>;
export type ShoppingActivityInput = z.infer<typeof shoppingActivitySchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type ActivityFiltersInput = z.infer<typeof activityFiltersSchema>;
