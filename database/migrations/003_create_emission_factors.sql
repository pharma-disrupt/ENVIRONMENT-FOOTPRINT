-- Migration 003: Create emission_factors table
-- Stores IPCC and other reference data for carbon calculations

CREATE TABLE IF NOT EXISTS emission_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE, -- 'transport', 'energy', 'food', 'flight', 'shopping'
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES emission_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'Petrol Car', 'Grid Electricity', 'Beef'
    description TEXT,
    factor_value NUMERIC(12, 6) NOT NULL, -- CO2e per unit
    unit VARCHAR(50) NOT NULL, -- 'km', 'kWh', 'kg', 'mile', 'gallon'
    source VARCHAR(255), -- e.g., 'IPCC 2021', 'EPA 2023'
    region VARCHAR(100), -- Optional regional specificity
    year INTEGER DEFAULT 2024,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_emission_factors_category ON emission_factors(category_id);
CREATE INDEX IF NOT EXISTS idx_emission_factors_name ON emission_factors(name);
CREATE INDEX IF NOT EXISTS idx_emission_factors_region ON emission_factors(region);
CREATE INDEX IF NOT EXISTS idx_emission_factors_active ON emission_factors(is_active);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_emission_factors_updated_at
    BEFORE UPDATE ON emission_factors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
