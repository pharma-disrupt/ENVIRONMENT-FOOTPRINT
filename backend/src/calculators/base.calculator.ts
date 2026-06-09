/**
 * Base Calculator Interface and Utilities
 * Provides common types and helper functions for carbon calculations
 */

export interface EmissionFactor {
  id: string;
  category: string;
  subcategory: string;
  factor: number; // CO2e per unit
  unit: string;
  source: string;
  year: number;
}

export interface CalculationResult {
  co2e: number; // kg CO2 equivalent
  category: string;
  subcategory: string;
  activity: string;
  breakdown?: {
    co2: number;
    ch4: number;
    n2o: number;
  };
}

export interface CalculatorOptions {
  location?: string;
  year?: number;
  includeBreakdown?: boolean;
}

/**
 * Base calculator class with common utilities
 */
export abstract class BaseCalculator {
  protected emissionFactors: Map<string, EmissionFactor>;

  constructor() {
    this.emissionFactors = new Map();
  }

  /**
   * Load emission factors from database or static data
   */
  async loadEmissionFactors(factors: EmissionFactor[]): Promise<void> {
    for (const factor of factors) {
      const key = `${factor.category}:${factor.subcategory}`;
      this.emissionFactors.set(key, factor);
    }
  }

  /**
   * Get emission factor by category and subcategory
   */
  protected getEmissionFactor(category: string, subcategory: string): EmissionFactor | null {
    const key = `${category}:${subcategory}`;
    return this.emissionFactors.get(key) || null;
  }

  /**
   * Calculate CO2e from activity data and emission factor
   */
  protected calculateCO2e(
    quantity: number,
    factor: number,
    options?: CalculationResult['breakdown']
  ): CalculationResult {
    const co2e = quantity * factor;

    return {
      co2e: Math.round(co2e * 1000) / 1000, // Round to 3 decimal places
      category: '',
      subcategory: '',
      activity: '',
      breakdown: options,
    };
  }

  /**
   * Validate numeric input
   */
  protected validateNumber(value: unknown, fieldName: string): number {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      throw new Error(`${fieldName} must be a non-negative number`);
    }
    return value;
  }

  /**
   * Abstract method to be implemented by specific calculators
   */
  abstract calculate(data: Record<string, unknown>, options?: CalculatorOptions): Promise<CalculationResult>;
}

/**
 * Helper function to convert between units
 */
export function convertUnit(value: number, from: string, to: string): number {
  const conversions: Record<string, Record<string, number>> = {
    km: { miles: 0.621371, m: 1000 },
    miles: { km: 1.60934, m: 1609.34 },
    kg: { lbs: 2.20462, g: 1000 },
    lbs: { kg: 0.453592, g: 453.592 },
    kWh: { MWh: 0.001, Wh: 1000 },
    L: { gallons: 0.264172, mL: 1000 },
    gallons: { L: 3.78541, mL: 3785.41 },
  };

  if (!conversions[from]?.[to]) {
    throw new Error(`Cannot convert from ${from} to ${to}`);
  }

  return value * conversions[from][to];
}

/**
 * GWP (Global Warming Potential) values from IPCC AR6
 */
export const GWP_VALUES = {
  CO2: 1,
  CH4: 27.9, // Methane over 100 years
  N2O: 273, // Nitrous oxide over 100 years
};
