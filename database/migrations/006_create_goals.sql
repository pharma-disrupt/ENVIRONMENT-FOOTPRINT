-- Migration 006: Create goals table
-- Stores user carbon reduction goals and targets

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Goal details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL, -- 'reduction', 'absolute', 'category_limit'
    category_id UUID REFERENCES emission_categories(id) ON DELETE SET NULL,
    
    -- Target values
    target_value NUMERIC(12, 4) NOT NULL, -- Target emissions or reduction percentage
    baseline_value NUMERIC(12, 4), -- Starting point for comparison
    unit VARCHAR(50) NOT NULL, -- 'kg', 'percentage', 'tons'
    
    -- Timeframe
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(20), -- 'weekly', 'monthly', 'yearly'
    
    -- Progress tracking
    current_value NUMERIC(12, 4) DEFAULT 0,
    progress_percentage NUMERIC(5, 2) DEFAULT 0,
    
    -- Status
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'completed', 'paused', 'abandoned'
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Notifications
    notify_on_milestone BOOLEAN DEFAULT TRUE,
    notify_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_end_date ON goals(end_date);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
