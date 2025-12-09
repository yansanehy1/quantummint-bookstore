-- QuantumMint Database Schema for Audiobook & Video Platform
-- Migration 002: Email System Integration Tables

-- ===========================================================================
-- USERS TABLE EXTENSIONS
-- ===========================================================================
-- Extend existing users table with wallet and preferences

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS auto_top_up_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_top_up_amount DECIMAL(10,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS auto_top_up_threshold DECIMAL(10,2) DEFAULT 1.00,
ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'learner' CHECK (user_type IN ('learner', 'creator', 'admin')),
ADD COLUMN IF NOT EXISTS total_listening_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_video_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS creator_tier VARCHAR(20) DEFAULT 'tier1' CHECK (creator_tier IN ('tier1', 'tier2', 'tier3')),
ADD COLUMN IF NOT EXISTS earnings_rate DECIMAL(5,3) DEFAULT 0.085 COMMENT 'Earnings per minute for creators';

CREATE INDEX IF NOT EXISTS idx_users_wallet_balance ON users(wallet_balance);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_creator_tier ON users(creator_tier);

-- ===========================================================================
-- WALLET TRANSACTIONS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
        'top_up', 'auto_top_up', 'listening_charge', 'video_charge', 
        'refund', 'creator_payout', 'bonus_credit', 'adjustment'
    )),
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    content_type VARCHAR(20) CHECK (content_type IN ('audio', 'video', 'live', 'premium_video')),
    content_id VARCHAR(100),
    reference_id VARCHAR(100),
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transaction_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_reference_id ON wallet_transactions(reference_id);
CREATE INDEX idx_wallet_content_type ON wallet_transactions(content_type);

-- ===========================================================================
-- CONTENT TABLE (for audiobooks and videos)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(30) NOT NULL CHECK (content_type IN (
        'audio', 'video', 'premium_video', 'live', 'interactive_video'
    )),
    category VARCHAR(100),
    tags TEXT[],
    duration_minutes INTEGER,
    price_tier VARCHAR(20) DEFAULT 'standard' CHECK (price_tier IN ('standard', 'premium', 'enterprise')),
    rate_per_minute DECIMAL(5,3),
    
    -- Audio-specific fields
    author VARCHAR(200),
    narrator VARCHAR(200),
    series_id INTEGER,
    series_position INTEGER,
    
    -- Video-specific fields
    resolution VARCHAR(20),
    video_format VARCHAR(10),
    has_subtitles BOOLEAN DEFAULT false,
    has_captions BOOLEAN DEFAULT false,
    has_transcript BOOLEAN DEFAULT false,
    thumbnail_url VARCHAR(500),
    preview_clip_url VARCHAR(500),
    requires_certificate BOOLEAN DEFAULT false,
    certificate_template VARCHAR(50),
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'published', 'archived', 'under_review')),
    published_at TIMESTAMP,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_minutes_consumed INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_creator_id ON content(creator_id);
CREATE INDEX idx_content_type ON content(content_type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_published_at ON content(published_at DESC);
CREATE INDEX idx_content_category ON content(category);

-- ===========================================================================
-- LISTENING/VIEWING SESSIONS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS content_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('audio', 'video', 'live')),
    
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    total_minutes INTEGER,
    total_seconds INTEGER,
    charge DECIMAL(10,2),
    
    -- Progress tracking
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    playback_position INTEGER DEFAULT 0, -- seconds
    current_chapter INTEGER,
    total_chapters INTEGER,
    
    -- Video-specific metrics
    average_quality VARCHAR(20),
    quality_changes JSONB,
    buffering_events INTEGER DEFAULT 0,
    interactive_elements_completed INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned', 'error')),
    device_info JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON content_sessions(user_id);
CREATE INDEX idx_sessions_content_id ON content_sessions(content_id);
CREATE INDEX idx_sessions_start_time ON content_sessions(start_time DESC);
CREATE INDEX idx_sessions_status ON content_sessions(status);
CREATE INDEX idx_sessions_type ON content_sessions(session_type);

-- ===========================================================================
-- CREATOR EARNINGS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS creator_earnings (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    session_id INTEGER,
    
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    content_type VARCHAR(20) NOT NULL,
    total_minutes INTEGER NOT NULL,
    unique_listeners INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    
    earnings_rate DECIMAL(5,3) NOT NULL COMMENT 'Per minute rate',
    gross_amount DECIMAL(10,2) NOT NULL,
    platform_fee_percentage DECIMAL(5,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    transaction_fee DECIMAL(10,2) DEFAULT 0.25,
    net_amount DECIMAL(10,2) NOT NULL,
    
    payout_status VARCHAR(20) DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'on_hold')),
    payout_id INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_earnings_creator_id ON creator_earnings(creator_id);
CREATE INDEX idx_earnings_content_id ON creator_earnings(content_id);
CREATE INDEX idx_earnings_period ON creator_earnings(period_start, period_end);
CREATE INDEX idx_earnings_payout_status ON creator_earnings(payout_status);
CREATE INDEX idx_earnings_created_at ON creator_earnings(created_at DESC);

-- ===========================================================================
-- PAYOUTS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS payouts (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    transaction_fee DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB,
    transaction_id VARCHAR(100),
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_arrival DATE,
    completed_at TIMESTAMP,
    
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_creator_id ON payouts(creator_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_requested_at ON payouts(requested_at DESC);
CREATE INDEX idx_payouts_transaction_id ON payouts(transaction_id);

-- ===========================================================================
-- EMAIL NOTIFICATIONS TRACKING
-- ===========================================================================
CREATE TABLE IF NOT EXISTS email_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    template_used VARCHAR(100),
    
    metadata JSONB,
    
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMP,
    
    opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP,
    
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP,
    
    bounced BOOLEAN DEFAULT false,
    bounce_reason TEXT,
    bounce_type VARCHAR(50),
    
    unsubscribed BOOLEAN DEFAULT false,
    unsubscribed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON email_notifications(user_id);
CREATE INDEX idx_notifications_email_type ON email_notifications(email_type);
CREATE INDEX idx_notifications_sent_at ON email_notifications(sent_at DESC);
CREATE INDEX idx_notifications_recipient ON email_notifications(recipient_email);
CREATE INDEX idx_notifications_opened ON email_notifications(opened);

-- ===========================================================================
-- CERTIFICATES
-- ===========================================================================
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    
    certificate_id VARCHAR(100) UNIQUE NOT NULL,
    certificate_type VARCHAR(50) DEFAULT 'basic',
    
    completion_date TIMESTAMP NOT NULL,
    completion_percentage DECIMAL(5,2),
    quiz_score DECIMAL(5,2),
    interactive_score INTEGER,
    
    certificate_url VARCHAR(500),
    verification_url VARCHAR(500),
    
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    verified BOOLEAN DEFAULT true,
    revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP,
    revoke_reason TEXT,
    
    shared_linkedin BOOLEAN DEFAULT false,
    shared_twitter BOOLEAN DEFAULT false,
    shared_facebook BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_content_id ON certificates(content_id);
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX idx_certificates_issued_at ON certificates(issued_at DESC);
CREATE UNIQUE INDEX idx_certificates_unique_user_content ON certificates(user_id, content_id) WHERE revoked = false;

-- ===========================================================================
-- EMAIL PREFERENCES
-- ===========================================================================
CREATE TABLE IF NOT EXISTS email_preferences (
    user_id INTEGER PRIMARY KEY,
    
    receive_wallet_notifications BOOLEAN DEFAULT true,
    receive_session_summaries BOOLEAN DEFAULT true,
    receive_balance_alerts BOOLEAN DEFAULT true,
    receive_recommendations BOOLEAN DEFAULT true,
    receive_creator_updates BOOLEAN DEFAULT true,
    receive_platform_news BOOLEAN DEFAULT true,
    receive_marketing BOOLEAN DEFAULT true,
    
    summary_frequency VARCHAR(20) DEFAULT 'daily' CHECK (summary_frequency IN ('realtime', 'daily', 'weekly', 'never')),
    
    last_email_sent TIMESTAMP,
    email_count_today INTEGER DEFAULT 0,
    email_count_this_week INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================================
-- LIVE STREAMS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS live_streams (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    stream_id VARCHAR(100) UNIQUE NOT NULL,
    
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    scheduled_time TIMESTAMP NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    duration_minutes INTEGER,
    
    price_per_minute DECIMAL(5,3) NOT NULL,
    preview_minutes INTEGER DEFAULT 5,
    max_attendees INTEGER DEFAULT 1000,
    
    stream_key VARCHAR(200),
    rtmp_url VARCHAR(500),
    playback_url VARCHAR(500),
    
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    
    total_viewers INTEGER DEFAULT 0,
    peak_viewers INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    
    recording_url VARCHAR(500),
    chat_enabled BOOLEAN DEFAULT true,
    interactive_features JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_live_streams_creator_id ON live_streams(creator_id);
CREATE INDEX idx_live_streams_stream_id ON live_streams(stream_id);
CREATE INDEX idx_live_streams_scheduled_time ON live_streams(scheduled_time);
CREATE INDEX idx_live_streams_status ON live_streams(status);

-- ===========================================================================
-- LIVE STREAM REGISTRATIONS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS live_stream_registrations (
    id SERIAL PRIMARY KEY,
    stream_id VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL,
    
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT false,
    watch_minutes INTEGER DEFAULT 0,
    amount_charged DECIMAL(10,2) DEFAULT 0.00,
    
    UNIQUE(stream_id, user_id)
);

CREATE INDEX idx_stream_registrations_stream_id ON live_stream_registrations(stream_id);
CREATE INDEX idx_stream_registrations_user_id ON live_stream_registrations(user_id);

-- ===========================================================================
-- ANALYTICS HELPER VIEWS
-- ===========================================================================

-- Daily revenue summary
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
    DATE(created_at) as date,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_revenue,
    SUM(CASE WHEN transaction_type = 'top_up' THEN amount ELSE 0 END) as topup_revenue,
    SUM(CASE WHEN transaction_type IN ('listening_charge', 'video_charge') THEN amount ELSE 0 END) as consumption_revenue,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as transaction_count
FROM wallet_transactions
WHERE status = 'completed'
GROUP BY DATE(created_at);

-- Creator earnings summary
CREATE OR REPLACE VIEW creator_earnings_summary AS
SELECT 
    creator_id,
    DATE(period_start) as period,
    SUM(total_minutes) as total_minutes,
    SUM(gross_amount) as gross_earnings,
    SUM(net_amount) as net_earnings,
    COUNT(DISTINCT content_id) as content_count,
    SUM(unique_listeners) as total_listeners
FROM creator_earnings
GROUP BY creator_id, DATE(period_start);

-- User engagement metrics
CREATE OR REPLACE VIEW user_engagement AS
SELECT 
    user_id,
    COUNT(*) as total_sessions,
    SUM(total_minutes) as total_minutes,
    AVG(completion_percentage) as avg_completion,
    COUNT(DISTINCT content_id) as unique_content,
    MAX(start_time) as last_session
FROM content_sessions
WHERE status = 'completed'
GROUP BY user_id;

-- ===========================================================================
-- SAMPLE QUERIES FOR EMAIL SYSTEM
-- ===========================================================================

-- Get users with low balance (for alert emails)
-- SELECT id, email, wallet_balance, 
--        FLOOR(wallet_balance / 0.15) as estimated_minutes
-- FROM users
-- WHERE wallet_balance < 1.00 AND user_type = 'learner';

-- Get creators ready for payout
-- SELECT creator_id, SUM(net_amount) as available_balance
-- FROM creator_earnings
-- WHERE payout_status = 'pending'
-- GROUP BY creator_id
-- HAVING SUM(net_amount) >= 25.00;

-- Get today's content sessions for daily summary
-- SELECT user_id, COUNT(*) as sessions_today,
--        SUM(total_minutes) as total_minutes,
--        SUM(charge) as total_cost
-- FROM content_sessions
-- WHERE DATE(start_time) = CURRENT_DATE
--   AND status = 'completed'
-- GROUP BY user_id;

-- Get certificate-eligible sessions
-- SELECT user_id, content_id, completion_percentage
-- FROM content_sessions
-- WHERE completion_percentage >= 90
--   AND user_id NOT IN (SELECT user_id FROM certificates WHERE content_id = content_sessions.content_id);
