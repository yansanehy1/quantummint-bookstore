-- QuantumMint Database Schema
-- Pay-per-minute Learning Platform

-- ============================================================================
-- USERS TABLE EXTENSIONS
-- ============================================================================
-- Extends existing users table with wallet and auto-top up functionality

ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_top_up BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_top_up_amount DECIMAL(10,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_top_up_threshold DECIMAL(10,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) CHECK (user_type IN ('learner', 'educator', 'admin'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS earnings_rate DECIMAL(5,3) DEFAULT 0.085 COMMENT 'Earnings per minute for educators';

CREATE INDEX IF NOT EXISTS idx_users_wallet_balance ON users(wallet_balance);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- ============================================================================
-- WALLET TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('top_up', 'reading', 'refund', 'payout')),
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transaction_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_created_at ON wallet_transactions(created_at);
CREATE INDEX idx_wallet_reference_id ON wallet_transactions(reference_id);

-- ============================================================================
-- LEARNING CONTENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS learning_content (
    id SERIAL PRIMARY KEY,
    educator_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) DEFAULT 'article',
    reading_time_estimate INTEGER COMMENT 'Estimated minutes',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'under_review')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_educator_id ON learning_content(educator_id);
CREATE INDEX idx_content_status ON learning_content(status);
CREATE INDEX idx_content_published_at ON learning_content(published_at);

-- ============================================================================
-- READING SESSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    total_minutes INTEGER,
    charge DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'error')),
    device_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX idx_sessions_content_id ON reading_sessions(content_id);
CREATE INDEX idx_sessions_start_time ON reading_sessions(start_time);
CREATE INDEX idx_sessions_status ON reading_sessions(status);

-- ============================================================================
-- EDUCATOR EARNINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS educator_earnings (
    id SERIAL PRIMARY KEY,
    educator_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    session_id INTEGER,
    reading_minutes INTEGER NOT NULL,
    earnings_rate DECIMAL(5,3) NOT NULL COMMENT 'Per minute rate',
    gross_amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    payout_status VARCHAR(20) DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'on_hold')),
    payout_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_earnings_educator_id ON educator_earnings(educator_id);
CREATE INDEX idx_earnings_content_id ON educator_earnings(content_id);
CREATE INDEX idx_earnings_period ON educator_earnings(period_start, period_end);
CREATE INDEX idx_earnings_payout_status ON educator_earnings(payout_status);

-- ============================================================================
-- PAYOUTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS payouts (
    id SERIAL PRIMARY KEY,
    educator_id INTEGER NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_educator_id ON payouts(educator_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_requested_at ON payouts(requested_at);
CREATE INDEX idx_payouts_transaction_id ON payouts(transaction_id);

-- ============================================================================
-- EMAIL NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    template_used VARCHAR(100),
    metadata JSONB,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP,
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP,
    bounced BOOLEAN DEFAULT false,
    bounce_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON email_notifications(user_id);
CREATE INDEX idx_notifications_email_type ON email_notifications(email_type);
CREATE INDEX idx_notifications_sent_at ON email_notifications(sent_at);
CREATE INDEX idx_notifications_opened ON email_notifications(opened);

-- ============================================================================
-- READING STREAKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reading_streaks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_reading_date DATE,
    total_reading_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_streaks_user_id ON reading_streaks(user_id);
CREATE INDEX idx_streaks_current_streak ON reading_streaks(current_streak);

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Get user's wallet balance and reading time estimate
-- SELECT 
--     email,
--     wallet_balance,
--     FLOOR(wallet_balance / 0.10) as estimated_minutes
-- FROM users
-- WHERE id = ?;

-- Get educator's available earnings
-- SELECT 
--     educator_id,
--     SUM(net_amount) as available_balance
-- FROM educator_earnings
-- WHERE payout_status = 'pending'
-- GROUP BY educator_id;

-- Get today's reading activity for a user
-- SELECT 
--     COUNT(*) as sessions_today,
--     SUM(total_minutes) as total_minutes,
--     SUM(charge) as total_cost
-- FROM reading_sessions
-- WHERE user_id = ? 
--   AND DATE(start_time) = CURDATE()
--   AND status = 'completed';

-- Get low balance users (< $1.00)
-- SELECT id, email, wallet_balance
-- FROM users
-- WHERE wallet_balance < 1.00
--   AND user_type = 'learner';
