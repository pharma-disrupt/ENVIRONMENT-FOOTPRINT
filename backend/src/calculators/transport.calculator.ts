/**
 * Transport Carbon Calculator
 * Calculates emissions from various transportation modes:
 * - Personal vehicles (petrol, diesel, electric, hybrid)
 * - Public transport (bus, train, metro)
 * - Air travel (domestic, international, class)
 * - Cycling and walking (zero emissions)
 */

import { BaseCalculator, CalculationResult, CalculatorOptions, EmissionFactor } from './base.calculator';

export interface TransportData {
  mode: 'car' | 'bus' | 'train' | 'metro' | 'flight' | 'motorcycle' | 'bicycle' | 'walk';
  distance: number;
  unit?: 'km' | 'miles';
  vehicleType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'small' | 'medium' | 'large';
  fuelEfficiency?: number; // L/100km or MPG
  passengers?: number;
  flightClass?: 'economy' | 'premium' | 'business' | 'first';
  flightType?: 'domestic' | 'international_short' | 'international_long';
}

export class TransportCalculator extends BaseCalculator {
  constructor() {
    super();
  }

  async calculate(data: TransportData, options?: CalculatorOptions): Promise<CalculationResult> {
    const { mode, distance, unit = 'km' } = data;

    // Validate distance
    const distanceKm = unit === 'miles' ? distance * 1.60934 : distance;
    this.validateNumber(distanceKm, 'distance');

    let co2e = 0;
    let subcategory = '';
    let activity = '';

    switch (mode) {
      case 'car':
        co2e = await this.calculateCarEmissions(data, distanceKm);
        subcategory = data.vehicleType || 'petrol';
        activity = `Driving ${distanceKm.toFixed(1)} km by ${data.vehicleType || 'petrol'} car`;
        break;

      case 'bus':
        co2e = await this.calculateBusEmissions(distanceKm);
        subcategory = 'bus';
        activity = `Traveling ${distanceKm.toFixed(1)} km by bus`;
        break;

      case 'train':
        co2e = await this.calculateTrainEmissions(distanceKm, data.flightType);
        subcategory = data.flightType === 'high_speed' ? 'high_speed_rail' : 'rail';
        activity = `Traveling ${distanceKm.toFixed(1)} km by train`;
        break;

      case 'metro':
        co2e = await this.calculateMetroEmissions(distanceKm);
        subcategory = 'metro';
        activity = `Traveling ${distanceKm.toFixed(1)} km by metro/subway`;
        break;

      case 'flight':
        co2e = await this.calculateFlightEmissions(data, distanceKm);
        subcategory = data.flightType || 'domestic';
        activity = `Flying ${distanceKm.toFixed(1)} km (${data.flightClass || 'economy'} class)`;
        break;

      case 'motorcycle':
        co2e = await this.calculateMotorcycleEmissions(distanceKm);
        subcategory = 'motorcycle';
        activity = `Riding ${distanceKm.toFixed(1)} km by motorcycle`;
        break;

      case 'bicycle':
      case 'walk':
        co2e = 0;
        subcategory = mode;
        activity = `${distanceKm.toFixed(1)} km by ${mode}`;
        break;

      default:
        throw new Error(`Unknown transport mode: ${mode}`);
    }

    return {
      co2e: Math.round(co2e * 1000) / 1000,
      category: 'transport',
      subcategory,
      activity,
    };
  }

  private async calculateCarEmissions(data: TransportData, distanceKm: number): Promise<number> {
    const { vehicleType = 'petrol', fuelEfficiency, passengers = 1 } = data;

    // Default emission factors (kg CO2e per km)
    const defaultFactors: Record<string, number> = {
      petrol: 0.192,
      diesel: 0.171,
      electric: 0.053, // Depends on grid electricity mix
      hybrid: 0.109,
      small: 0.148,
      medium: 0.192,
      large: 0.282,
    };

    let factor = defaultFactors[vehicleType] || defaultFactors.petrol;

    // Adjust for fuel efficiency if provided (L/100km)
    if (fuelEfficiency && vehicleType !== 'electric') {
      // Petrol: ~2.31 kg CO2/L, Diesel: ~2.68 kg CO2/L
      const co2PerLiter = vehicleType === 'diesel' ? 2.68 : 2.31;
      factor = (fuelEfficiency / 100) * co2PerLiter;
    }

    // Divide by number of passengers for carpooling
    const adjustedFactor = factor / Math.min(passengers, 4); // Cap at 4 passengers

    return distanceKm * adjustedFactor;
  }

  private async calculateBusEmissions(distanceKm: number): Promise<number> {
    // Average bus emission: ~0.089 kg CO2e per passenger-km
    const factor = 0.089;
    return distanceKm * factor;
  }

  private async calculateTrainEmissions(distanceKm: number, type?: string): Promise<number> {
    // Train emissions vary by type and electrification
    const factors: Record<string, number> = {
      high_speed: 0.041,
      rail: 0.041,
      diesel: 0.084,
      electric: 0.028,
    };

    const factor = factors[type || 'rail'] || factors.rail;
    return distanceKm * factor;
  }

  private async calculateMetroEmissions(distanceKm: number): Promise<number> {
    // Metro/subway average: ~0.037 kg CO2e per passenger-km
    const factor = 0.037;
    return distanceKm * factor;
  }

  private async calculateFlightEmissions(data: TransportData, distanceKm: number): Promise<number> {
    const { flightClass = 'economy', flightType = 'domestic' } = data;

    // Base emission factors (kg CO2e per passenger-km)
    const baseFactors: Record<string, number> = {
      domestic: 0.255,
      international_short: 0.195,
      international_long: 0.150,
    };

    // Class multipliers (more space = higher emissions per passenger)
    const classMultipliers: Record<string, number> = {
      economy: 1.0,
      premium: 1.6,
      business: 2.9,
      first: 4.0,
    };

    const baseFactor = baseFactors[flightType] || baseFactors.domestic;
    const classMultiplier = classMultipliers[flightClass] || 1.0;

    // Add radiative forcing factor for high-altitude emissions (x1.9)
    const radiativeForcing = 1.9;

    return distanceKm * baseFactor * classMultiplier * radiativeForcing;
  }

  private async calculateMotorcycleEmissions(distanceKm: number): Promise<number> {
    // Average motorcycle: ~0.113 kg CO2e per km
    const factor = 0.113;
    return distanceKm * factor;
  }
}

export const transportCalculator = new TransportCalculator();
