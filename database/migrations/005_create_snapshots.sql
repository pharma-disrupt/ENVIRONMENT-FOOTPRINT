-- Migration 005: Create snapshots table
-- Stores daily/weekly/monthly footprint aggregations for trends and analytics

CREATE TABLE IF NOT EXISTS snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Time period
    snapshot_date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Aggregated emissions
    total_emissions NUMERIC(12, 4) NOT NULL, -- kg CO2e
    transport_emissions NUMERIC(12, 4) DEFAULT 0,
    energy_emissions NUMERIC(12, 4) DEFAULT 0,
    food_emissions NUMERIC(12, 4) DEFAULT 0,
    flight_emissions NUMERIC(12, 4) DEFAULT 0,
    shopping_emissions NUMERIC(12, 4) DEFAULT 0,
    other_emissions NUMERIC(12, 4) DEFAULT 0,
    
    -- Activity counts
    activity_count INTEGER DEFAULT 0,
    
    -- Comparisons
    vs_previous_period NUMERIC(8, 4), -- Percentage change
    vs_user_average NUMERIC(8, 4), -- Percentage change
    vs_national_average NUMERIC(8, 4), -- Percentage change
    
    -- Streak info
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint to prevent duplicate snapshots
CREATE UNIQUE INDEX IF NOT EXISTS idx_snapshots_user_period 
    ON snapshots(user_id, snapshot_date, period_type);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_snapshots_user_date ON snapshots(user_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_period_type ON snapshots(period_type);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_snapshots_updated_at
    BEFORE UPDATE ON snapshots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
