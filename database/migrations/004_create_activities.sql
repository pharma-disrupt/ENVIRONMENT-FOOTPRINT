-- Migration 004: Create activities table
-- Stores user-logged carbon footprint activities

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES emission_categories(id) ON DELETE RESTRICT,
    emission_factor_id UUID REFERENCES emission_factors(id) ON DELETE SET NULL,
    
    -- Activity details
    activity_type VARCHAR(100) NOT NULL, -- e.g., 'car_trip', 'electricity_bill', 'meal'
    description TEXT,
    
    -- Quantity and units
    quantity NUMERIC(12, 4) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    
    -- Calculated emissions
    carbon_emissions NUMERIC(12, 4) NOT NULL, -- kg CO2e
    calculation_method VARCHAR(50) DEFAULT 'manual', -- 'manual', 'estimated', 'auto'
    
    -- Metadata
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    location VARCHAR(255),
    notes TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(50), -- 'web', 'mobile', 'api', 'import'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
