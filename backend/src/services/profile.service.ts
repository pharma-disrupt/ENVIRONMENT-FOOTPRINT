import { db } from '../config/database.js';
import { logger } from '../middleware/logger.js';

interface Profile {
  id: string;
  userId: string;
  name?: string;
  householdSize?: number;
  country?: string;
  city?: string;
  lifestyleScore?: number;
  carbonBaseline?: number;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateProfileData {
  name?: string;
  householdSize?: number;
  country?: string;
  city?: string;
  lifestyleScore?: number;
  notificationsEnabled?: boolean;
}

interface OnboardingData {
  householdSize: number;
  country: string;
  city?: string;
  housingType: string;
  vehicleOwnership: string;
  dietType: string;
  flightFrequency: string;
}

export class ProfileService {
  async getProfile(userId: string): Promise<Profile | null> {
    const result = await db.query<Profile>(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<Profile> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 2;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.householdSize !== undefined) {
      updates.push(`household_size = $${paramIndex++}`);
      values.push(data.householdSize);
    }
    if (data.country !== undefined) {
      updates.push(`country = $${paramIndex++}`);
      values.push(data.country);
    }
    if (data.city !== undefined) {
      updates.push(`city = $${paramIndex++}`);
      values.push(data.city);
    }
    if (data.lifestyleScore !== undefined) {
      updates.push(`lifestyle_score = $${paramIndex++}`);
      values.push(data.lifestyleScore);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push(`updated_at = NOW()`);
    values.unshift(userId);

    const query = `
      UPDATE profiles
      SET ${updates.join(', ')}
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await db.query<Profile>(query, values);
    
    logger.info({ userId }, 'Profile updated');
    
    return result.rows[0];
  }

  async getOnboardingStatus(userId: string): Promise<{ completed: boolean }> {
    const profile = await this.getProfile(userId);
    return { completed: profile?.onboardingCompleted || false };
  }

  async completeOnboarding(userId: string, data: OnboardingData): Promise<Profile> {
    const lifestyleScore = this.calculateLifestyleScore(data);
    const carbonBaseline = this.estimateCarbonBaseline(data);

    const result = await db.query<Profile>(
      `INSERT INTO profiles (user_id, household_size, country, city, lifestyle_score, carbon_baseline, onboarding_completed)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       ON CONFLICT (user_id) DO UPDATE SET
         household_size = EXCLUDED.household_size,
         country = EXCLUDED.country,
         city = EXCLUDED.city,
         lifestyle_score = EXCLUDED.lifestyle_score,
         carbon_baseline = EXCLUDED.carbon_baseline,
         onboarding_completed = true,
         updated_at = NOW()
       RETURNING *`,
      [
        userId,
        data.householdSize,
        data.country,
        data.city || null,
        lifestyleScore,
        carbonBaseline,
      ]
    );

    logger.info({ userId, lifestyleScore, carbonBaseline }, 'Onboarding completed');

    return result.rows[0];
  }

  async getCarbonBaseline(userId: string): Promise<{ baseline: number; category: string }> {
    const profile = await this.getProfile(userId);
    
    if (!profile || !profile.carbonBaseline) {
      throw new Error('Carbon baseline not calculated yet. Please complete onboarding.');
    }

    const category = this.getFootprintCategory(profile.carbonBaseline);

    return {
      baseline: profile.carbonBaseline,
      category,
    };
  }

  async deleteAccount(userId: string): Promise<void> {
    await db.transaction(async (client) => {
      // Delete related data first due to foreign keys
      await client.query('DELETE FROM activities WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM goals WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM challenge_participants WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM badges WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM footprints WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM profiles WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM users WHERE id = $1', [userId]);
    });

    logger.warn({ userId }, 'Account deleted');
  }

  private calculateLifestyleScore(data: OnboardingData): number {
    let score = 50; // Base score

    // Diet impact
    const dietScores: Record<string, number> = {
      vegan: -15,
      vegetarian: -10,
      pescatarian: -5,
      omnivore: 0,
      high_meat: 15,
    };
    score += dietScores[data.dietType] || 0;

    // Vehicle ownership
    const vehicleScores: Record<string, number> = {
      none: -10,
      bicycle: -15,
      electric: -5,
      hybrid: 0,
      gasoline: 10,
      suv: 15,
    };
    score += vehicleScores[data.vehicleOwnership] || 0;

    // Flight frequency
    const flightScores: Record<string, number> = {
      never: -10,
      rarely: -5,
      occasionally: 0,
      frequently: 10,
      very_frequently: 20,
    };
    score += flightScores[data.flightFrequency] || 0;

    // Household size (per capita efficiency)
    if (data.householdSize >= 4) score -= 5;
    else if (data.householdSize === 1) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private estimateCarbonBaseline(data: OnboardingData): number {
    // Rough estimate in kg CO2e per year
    let baseline = 4000; // Base per person

    // Diet impact (annual kg CO2e)
    const dietEmissions: Record<string, number> = {
      vegan: 600,
      vegetarian: 1000,
      pescatarian: 1500,
      omnivore: 2500,
      high_meat: 3500,
    };
    baseline += dietEmissions[data.dietType] || 2500;

    // Transport impact
    const transportEmissions: Record<string, number> = {
      none: 0,
      bicycle: 0,
      electric: 500,
      hybrid: 1500,
      gasoline: 3000,
      suv: 4500,
    };
    baseline += transportEmissions[data.vehicleOwnership] || 3000;

    // Flight impact (annual kg CO2e)
    const flightEmissions: Record<string, number> = {
      never: 0,
      rarely: 500,
      occasionally: 2000,
      frequently: 5000,
      very_frequently: 10000,
    };
    baseline += flightEmissions[data.flightFrequency] || 2000;

    // Divide by household size for per-person estimate
    baseline = baseline / data.householdSize;

    return Math.round(baseline);
  }

  private getFootprintCategory(baseline: number): string {
    if (baseline < 2000) return 'Very Low';
    if (baseline < 4000) return 'Low';
    if (baseline < 8000) return 'Average';
    if (baseline < 15000) return 'High';
    return 'Very High';
  }
}
