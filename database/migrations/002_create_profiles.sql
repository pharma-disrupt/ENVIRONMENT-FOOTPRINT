-- Migration 002: Create profiles table
-- Stores user profile information, preferences, and onboarding data

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    household_size INTEGER DEFAULT 1,
    housing_type VARCHAR(50), -- 'apartment', 'house', 'shared'
    employment_status VARCHAR(50),
    lifestyle_score INTEGER DEFAULT 0,
    carbon_baseline NUMERIC(10, 2), -- Initial carbon footprint in kg CO2e
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Index for country-based aggregations
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
