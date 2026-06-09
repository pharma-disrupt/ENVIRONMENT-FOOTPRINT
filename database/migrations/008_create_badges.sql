-- Migration 008: Create badges table
-- Stores achievement badges and user badge awards

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Badge details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(100),
    
    -- Badge type and category
    badge_type VARCHAR(50) NOT NULL, -- 'streak', 'reduction', 'activity', 'challenge', 'milestone'
    category_id UUID REFERENCES emission_categories(id) ON DELETE SET NULL,
    
    -- Requirements
    requirement_type VARCHAR(50), -- 'count', 'percentage', 'absolute', 'days'
    requirement_value NUMERIC(12, 4) NOT NULL,
    unit VARCHAR(50),
    
    -- Visual
    icon_url VARCHAR(255),
    color VARCHAR(20), -- Hex color for UI
    display_order INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_secret BOOLEAN DEFAULT FALSE, -- Hidden until earned
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User badge awards table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    
    -- Award details
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reason TEXT, -- Why the badge was awarded
    
    -- Context
    context_type VARCHAR(50), -- 'activity', 'challenge', 'streak', 'goal'
    context_id UUID, -- Reference to the related entity
    
    -- Unique constraint
    UNIQUE(user_id, badge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_badges_active ON badges(is_active);
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_awarded_at ON user_badges(awarded_at DESC);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_badges_updated_at
    BEFORE UPDATE ON badges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
