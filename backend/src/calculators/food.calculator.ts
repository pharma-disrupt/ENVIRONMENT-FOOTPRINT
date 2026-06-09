/**
 * Food Carbon Calculator
 * Calculates emissions from food consumption:
 * - Meat and dairy products
 * - Plant-based foods
 * - Food waste
 * - Transportation (food miles)
 * - Organic vs conventional farming
 */

import { BaseCalculator, CalculationResult, CalculatorOptions } from './base.calculator';

export interface FoodData {
  category: 'meat' | 'dairy' | 'seafood' | 'grains' | 'vegetables' | 'fruits' | 'beverages' | 'processed';
  item?: string;
  quantity: number;
  unit: 'kg' | 'g' | 'lbs' | 'servings';
  productionMethod?: 'conventional' | 'organic' | 'regenerative' | 'local';
  transportation?: 'local' | 'domestic' | 'international_air' | 'international_sea';
  packaging?: 'none' | 'minimal' | 'recyclable' | 'plastic' | 'mixed';
}

export class FoodCalculator extends BaseCalculator {
  // Emission factors (kg CO2e per kg of product)
  private emissionFactors: Record<string, Record<string, number>> = {
    meat: {
      beef: 27.0, // Beef (beef herd)
      lamb: 24.0, // Lamb & mutton
      pork: 6.0, // Pork
      chicken: 5.4, // Chicken (poultry)
      turkey: 10.9, // Turkey
    },
    dairy: {
      cheese: 13.5, // Cheese
      butter: 23.8, // Butter
      milk: 1.2, // Milk (whole)
      yogurt: 2.2, // Yogurt
      ice_cream: 5.5, // Ice cream
    },
    seafood: {
      farmed_fish: 5.8, // Farmed fish average
      wild_fish: 3.2, // Wild caught fish
      shrimp_farmed: 10.5, // Farmed shrimp
      shrimp_wild: 5.6, // Wild shrimp
      mollusks: 0.9, // Mollusks (mussels, oysters)
    },
    grains: {
      rice: 2.7, // Rice (paddy)
      wheat: 1.1, // Wheat
      oats: 0.9, // Oats
      corn: 0.9, // Maize
      barley: 0.9, // Barley
      pasta: 1.4, // Pasta
      bread: 1.4, // Bread
    },
    vegetables: {
      potatoes: 0.3, // Potatoes
      tomatoes: 1.4, // Tomatoes (open field)
      lettuce: 0.6, // Lettuce
      carrots: 0.4, // Carrots
      broccoli: 0.5, // Broccoli
      beans: 0.6, // Beans
      peas: 0.5, // Peas
    },
    fruits: {
      apples: 0.4, // Apples
      bananas: 0.5, // Bananas
      citrus: 0.5, // Citrus fruits
      berries: 1.5, // Berries
      tropical: 1.2, // Tropical fruits
    },
    beverages: {
      coffee: 15.0, // Coffee (roasted)
      tea: 4.0, // Tea
      juice: 1.0, // Fruit juice
      beer: 1.9, // Beer
      wine: 2.1, // Wine
      soft_drinks: 0.4, // Soft drinks
    },
    processed: {
      snacks: 2.5, // Snacks (chips, etc.)
      confectionery: 3.5, // Chocolate, sweets
      ready_meals: 3.0, // Ready meals
      frozen_food: 3.5, // Frozen foods
    },
  };

  constructor() {
    super();
  }

  async calculate(data: FoodData, options?: CalculatorOptions): Promise<CalculationResult> {
    const { category, quantity, unit = 'kg' } = data;

    // Validate quantity
    this.validateNumber(quantity, 'quantity');

    // Convert to kg
    const quantityKg = this.convertToKg(quantity, unit);

    let co2e = 0;
    let subcategory = '';
    let activity = '';

    // Get base emission factor
    const baseFactor = await this.getBaseEmissionFactor(category, data.item);

    // Apply modifiers for production method, transportation, and packaging
    const productionModifier = this.getProductionModifier(data.productionMethod);
    const transportModifier = this.getTransportModifier(data.transportation, category);
    const packagingModifier = this.getPackagingModifier(data.packaging);

    // Calculate total emissions
    co2e = quantityKg * baseFactor * productionModifier * transportModifier * packagingModifier;

    subcategory = data.item || category;
    activity = `Consuming ${quantity.toFixed(1)} ${unit} of ${data.item || category}`;

    return {
      co2e: Math.round(co2e * 1000) / 1000,
      category: 'food',
      subcategory,
      activity,
    };
  }

  private async getBaseEmissionFactor(category: string, item?: string): Promise<number> {
    if (!item) {
      // Return average for category
      const categoryFactors = this.emissionFactors[category] || {};
      const values = Object.values(categoryFactors);
      if (values.length === 0) {
        return 2.0; // Default fallback
      }
      return values.reduce((a, b) => a + b, 0) / values.length;
    }

    const categoryFactors = this.emissionFactors[category] || {};
    return categoryFactors[item] || 2.0; // Default fallback
  }

  private getProductionModifier(method?: string): number {
    const modifiers: Record<string, number> = {
      conventional: 1.0,
      organic: 0.85, // ~15% reduction
      regenerative: 0.70, // ~30% reduction
      local: 0.90, // ~10% reduction (assumes less transport too)
    };

    return modifiers[method || 'conventional'] || 1.0;
  }

  private getTransportModifier(transport?: string, category?: string): number {
    const modifiers: Record<string, number> = {
      local: 0.80, // < 100km
      domestic: 1.0, // Within country
      international_sea: 1.15, // Sea freight (+15%)
      international_air: 2.50, // Air freight (+150%)
    };

    // Some categories are more sensitive to transport (e.g., fresh produce)
    const sensitiveCategories = ['vegetables', 'fruits', 'seafood'];
    if (sensitiveCategories.includes(category || '')) {
      const baseModifier = modifiers[transport || 'domestic'] || 1.0;
      return baseModifier * 1.2; // 20% higher impact for sensitive items
    }

    return modifiers[transport || 'domestic'] || 1.0;
  }

  private getPackagingModifier(packaging?: string): number {
    const modifiers: Record<string, number> = {
      none: 0.90,
      minimal: 0.95,
      recyclable: 1.0,
      plastic: 1.15, // +15% for plastic production/disposal
      mixed: 1.10,
    };

    return modifiers[packaging || 'recyclable'] || 1.0;
  }

  private convertToKg(quantity: number, unit: string): number {
    const conversions: Record<string, number> = {
      kg: 1,
      g: 0.001,
      lbs: 0.453592,
      servings: 0.25, // Average serving size (~250g)
    };

    return quantity * (conversions[unit] || 1);
  }

  /**
   * Calculate emissions for a meal with multiple ingredients
   */
  async calculateMeal(ingredients: Array<{
    category: FoodData['category'];
    item?: string;
    quantity: number;
    unit: FoodData['unit'];
  }>, options?: CalculatorOptions): Promise<CalculationResult> {
    let totalCo2e = 0;
    const breakdown: Record<string, number> = {};

    for (const ingredient of ingredients) {
      const result = await this.calculate(ingredient, options);
      totalCo2e += result.co2e;
      breakdown[ingredient.item || ingredient.category] = result.co2e;
    }

    return {
      co2e: Math.round(totalCo2e * 1000) / 1000,
      category: 'food',
      subcategory: 'meal',
      activity: `Meal with ${ingredients.length} ingredients`,
      breakdown: undefined, // Could be extended to include full GHG breakdown
    };
  }

  /**
   * Calculate food waste emissions
   */
  async calculateFoodWaste(quantity: number, unit: string, foodType?: string): Promise<number> {
    const quantityKg = this.convertToKg(quantity, unit);

    // Average food waste emission: ~2.5 kg CO2e per kg (includes production + decomposition)
    // Varies by food type
    const wasteFactors: Record<string, number> = {
      meat: 15.0,
      dairy: 5.0,
      vegetables: 0.5,
      fruits: 0.5,
      grains: 1.5,
      mixed: 2.5,
    };

    const factor = foodType ? wasteFactors[foodType] || wasteFactors.mixed : wasteFactors.mixed;
    return quantityKg * factor;
  }
}

export const foodCalculator = new FoodCalculator();
