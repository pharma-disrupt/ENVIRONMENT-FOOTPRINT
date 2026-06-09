-- Migration 007: Create challenges table
-- Stores community challenges and user participation

CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Challenge details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL, -- 'individual', 'community', 'category_specific'
    category_id UUID REFERENCES emission_categories(id) ON DELETE SET NULL,
    
    -- Rules and targets
    target_action VARCHAR(255), -- e.g., 'No car for 7 days', 'Vegetarian meals only'
    target_value NUMERIC(12, 4), -- Optional numeric target
    unit VARCHAR(50),
    
    -- Duration
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER GENERATED ALWAYS AS (end_date - start_date) STORED,
    
    -- Participation
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Rewards
    badge_id UUID, -- Optional badge reward
    points_reward INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User challenge participation table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Participation status
    status VARCHAR(30) DEFAULT 'joined', -- 'joined', 'active', 'completed', 'dropped'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Progress
    progress_value NUMERIC(12, 4) DEFAULT 0,
    progress_percentage NUMERIC(5, 2) DEFAULT 0,
    actions_completed INTEGER DEFAULT 0,
    
    -- Unique constraint
    UNIQUE(challenge_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_status ON challenge_participants(status);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
