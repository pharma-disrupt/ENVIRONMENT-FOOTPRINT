/**
 * Energy Carbon Calculator
 * Calculates emissions from energy consumption:
 * - Electricity usage (grid-based, varies by region)
 * - Natural gas
 * - Heating oil
 * - LPG/Propane
 * - Renewable energy (solar, wind - zero/low emissions)
 */

import { BaseCalculator, CalculationResult, CalculatorOptions } from './base.calculator';

export interface EnergyData {
  type: 'electricity' | 'natural_gas' | 'heating_oil' | 'lpg' | 'renewable';
  consumption: number;
  unit: 'kWh' | 'MWh' | 'therms' | 'ccf' | 'liters' | 'gallons';
  location?: string; // For grid emission factors
  renewablePercentage?: number; // For mixed electricity sources
}

export class EnergyCalculator extends BaseCalculator {
  // Default grid emission factors (kg CO2e per kWh) by region
  private gridEmissionFactors: Record<string, number> = {
    US: 0.386,
    EU: 0.277,
    UK: 0.233,
    CA: 0.130,
    AU: 0.680,
    IN: 0.708,
    CN: 0.581,
    DE: 0.348,
    FR: 0.057, // High nuclear percentage
    NO: 0.029, // High hydro percentage
    GLOBAL: 0.475,
  };

  constructor() {
    super();
  }

  async calculate(data: EnergyData, options?: CalculatorOptions): Promise<CalculationResult> {
    const { type, consumption, unit, location = 'GLOBAL' } = data;

    // Validate consumption
    this.validateNumber(consumption, 'consumption');

    let co2e = 0;
    let subcategory = '';
    let activity = '';

    // Convert all units to base units for calculation
    const consumptionKWh = this.convertToKWh(consumption, unit, type);
    const consumptionMJ = this.convertToMJ(consumption, unit, type);

    switch (type) {
      case 'electricity':
        co2e = await this.calculateElectricityEmissions(consumptionKWh, location, data.renewablePercentage);
        subcategory = 'grid_electricity';
        activity = `Using ${consumption.toFixed(1)} ${unit} of electricity`;
        break;

      case 'natural_gas':
        co2e = await this.calculateNaturalGasEmissions(consumptionMJ);
        subcategory = 'natural_gas';
        activity = `Using ${consumption.toFixed(1)} ${unit} of natural gas`;
        break;

      case 'heating_oil':
        co2e = await this.calculateHeatingOilEmissions(consumption, unit);
        subcategory = 'heating_oil';
        activity = `Using ${consumption.toFixed(1)} ${unit} of heating oil`;
        break;

      case 'lpg':
        co2e = await this.calculateLPGEmissions(consumption, unit);
        subcategory = 'lpg';
        activity = `Using ${consumption.toFixed(1)} ${unit} of LPG/propane`;
        break;

      case 'renewable':
        co2e = await this.calculateRenewableEmissions(consumptionKWh);
        subcategory = 'renewable';
        activity = `Using ${consumption.toFixed(1)} ${unit} of renewable energy`;
        break;

      default:
        throw new Error(`Unknown energy type: ${type}`);
    }

    return {
      co2e: Math.round(co2e * 1000) / 1000,
      category: 'energy',
      subcategory,
      activity,
    };
  }

  private async calculateElectricityEmissions(
    consumptionKWh: number,
    location: string,
    renewablePercentage: number = 0
  ): Promise<number> {
    // Get grid emission factor for location
    const gridFactor = this.gridEmissionFactors[location] || this.gridEmissionFactors.GLOBAL;

    // Adjust for renewable percentage in the mix
    const effectiveFactor = gridFactor * (1 - (renewablePercentage || 0) / 100);

    return consumptionKWh * effectiveFactor;
  }

  private async calculateNaturalGasEmissions(consumptionMJ: number): Promise<number> {
    // Natural gas: ~0.056 kg CO2e per MJ (or ~56 kg CO2e per GJ)
    const factor = 0.056;
    return consumptionMJ * factor;
  }

  private async calculateHeatingOilEmissions(consumption: number, unit: string): Promise<number> {
    // Convert to liters if needed
    let liters = consumption;
    if (unit === 'gallons') {
      liters = consumption * 3.78541;
    }

    // Heating oil: ~2.68 kg CO2e per liter
    const factor = 2.68;
    return liters * factor;
  }

  private async calculateLPGEmissions(consumption: number, unit: string): Promise<number> {
    // Convert to kg if needed
    let kg = consumption;
    if (unit === 'liters') {
      // LPG density: ~0.51 kg/L
      kg = consumption * 0.51;
    } else if (unit === 'gallons') {
      kg = consumption * 3.78541 * 0.51;
    }

    // LPG: ~3.0 kg CO2e per kg
    const factor = 3.0;
    return kg * factor;
  }

  private async calculateRenewableEmissions(consumptionKWh: number): Promise<number> {
    // Renewable energy has minimal lifecycle emissions
    // Solar: ~0.041 kg CO2e/kWh, Wind: ~0.011 kg CO2e/kWh
    // Using average for simplicity
    const factor = 0.026;
    return consumptionKWh * factor;
  }

  private convertToKWh(consumption: number, unit: string, type: string): number {
    const conversions: Record<string, number> = {
      kWh: 1,
      MWh: 1000,
      therms: 29.3071, // 1 therm = 29.3071 kWh
      ccf: 29.3071, // 1 ccf natural gas ≈ 1 therm
      liters: 0, // Not applicable for electricity
      gallons: 0,
    };

    return consumption * (conversions[unit] || 1);
  }

  private convertToMJ(consumption: number, unit: string, type: string): number {
    const conversions: Record<string, number> = {
      kWh: 3.6, // 1 kWh = 3.6 MJ
      MWh: 3600,
      therms: 105.506, // 1 therm = 105.506 MJ
      ccf: 105.506,
      liters: 0,
      gallons: 0,
    };

    return consumption * (conversions[unit] || 1);
  }

  /**
   * Set custom grid emission factors for specific locations
   */
  setGridEmissionFactors(factors: Record<string, number>): void {
    this.gridEmissionFactors = { ...this.gridEmissionFactors, ...factors };
  }

  /**
   * Get grid emission factor for a specific location
   */
  getGridEmissionFactor(location: string): number {
    return this.gridEmissionFactors[location] || this.gridEmissionFactors.GLOBAL;
  }
}

export const energyCalculator = new EnergyCalculator();
