-- ===========================================
-- PAY-PER-MINUTE (PAYGO) SYSTEM SCHEMA
-- ===========================================
-- Extends subscription system with pay-as-you-go functionality
-- Rate: 0.017 Leones/minute ≈ 0.001 USD/minute

-- PayGO wallet for users (prepaid system)
CREATE TABLE IF NOT EXISTS paygo_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Currency balances
    leones_balance DECIMAL(15,6) DEFAULT 0.000000 CHECK (leones_balance >= 0),
    usd_balance DECIMAL(15,6) DEFAULT 0.000000 CHECK (usd_balance >= 0),
    
    -- Settings
    default_currency VARCHAR(3) DEFAULT 'SLL', -- SLL = Sierra Leone Leones
    auto_topup_enabled BOOLEAN DEFAULT false,
    auto_topup_amount DECIMAL(10,2) DEFAULT 10.00,
    auto_topup_threshold DECIMAL(10,2) DEFAULT 1.00,
    
    -- Limits
    daily_spending_limit DECIMAL(10,2) DEFAULT 100.00,
    monthly_spending_limit DECIMAL(10,2) DEFAULT 1000.00,
    
    -- Stats
    total_deposited_leones DECIMAL(15,6) DEFAULT 0.000000,
    total_deposited_usd DECIMAL(15,6) DEFAULT 0.000000,
    total_spent_leones DECIMAL(15,6) DEFAULT 0.000000,
    total_spent_usd DECIMAL(15,6) DEFAULT 0.000000,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_suspended BOOLEAN DEFAULT false,
    suspension_reason TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    last_used_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paygo_wallets_user ON paygo_wallets(user_id);
CREATE INDEX idx_paygo_wallets_active ON paygo_wallets(is_active);

-- PayGO transactions (deposits, charges, refunds)
CREATE TABLE IF NOT EXISTS paygo_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES paygo_wallets(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    
    -- Transaction details
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'deposit', 'charge', 'refund', 'adjustment', 'bonus', 
        'transfer_in', 'transfer_out', 'fee', 'cashback'
    )),
    
    -- Amounts
    leones_amount DECIMAL(15,6) DEFAULT 0.000000,
    usd_amount DECIMAL(15,6) DEFAULT 0.000000,
    exchange_rate DECIMAL(15,6) DEFAULT 17000.00, -- SLL to USD rate
    
    -- Balance before/after
    leones_balance_before DECIMAL(15,6) NOT NULL,
    leones_balance_after DECIMAL(15,6) NOT NULL,
    usd_balance_before DECIMAL(15,6) NOT NULL,
    usd_balance_after DECIMAL(15,6) NOT NULL,
    
    -- Reference to content/service
    service_type VARCHAR(50) CHECK (service_type IN ('video', 'audiobook', 'ebook', 'live_stream')),
    product_id VARCHAR(255),
    product_title VARCHAR(500),
    
    -- Usage details (for charges)
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    duration_minutes DECIMAL(10,6),
    
    -- Rate information
    rate_per_minute_leones DECIMAL(10,6) DEFAULT 0.017000,
    rate_per_minute_usd DECIMAL(10,6) DEFAULT 0.001000,
    
    -- Payment info (for deposits)
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Status
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    error_reason TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paygo_transactions_user ON paygo_transactions(user_id);
CREATE INDEX idx_paygo_transactions_wallet ON paygo_transactions(wallet_id);
CREATE INDEX idx_paygo_transactions_type ON paygo_transactions(transaction_type);
CREATE INDEX idx_paygo_transactions_time ON paygo_transactions(created_at);
CREATE INDEX idx_paygo_transactions_product ON paygo_transactions(product_id);

-- PayGO real-time usage sessions
CREATE TABLE IF NOT EXISTS paygo_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES paygo_wallets(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    
    -- Session details
    session_token VARCHAR(100) UNIQUE NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('video', 'audiobook', 'ebook', 'live_stream')),
    
    -- Timing
    started_at TIMESTAMP NOT NULL,
    last_heartbeat TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    total_duration_seconds INTEGER DEFAULT 0,
    
    -- Rate and pricing
    rate_per_minute_leones DECIMAL(10,6) DEFAULT 0.017000,
    rate_per_minute_usd DECIMAL(10,6) DEFAULT 0.001000,
    
    -- Current charges
    accumulated_leones DECIMAL(15,6) DEFAULT 0.000000,
    accumulated_usd DECIMAL(15,6) DEFAULT 0.000000,
    
    -- Heartbeat intervals
    heartbeat_interval_seconds INTEGER DEFAULT 30,
    max_inactivity_seconds INTEGER DEFAULT 300, -- 5 minutes
    
    -- Quality settings
    max_quality VARCHAR(20) DEFAULT '480p',
    current_quality VARCHAR(20) DEFAULT '480p',
    
    -- Device info
    device_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'expired', 'cancelled')),
    ended_reason VARCHAR(100),
    
    -- Consumption tracking
    bytes_streamed BIGINT DEFAULT 0,
    segments_consumed INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paygo_sessions_user ON paygo_sessions(user_id);
CREATE INDEX idx_paygo_sessions_token ON paygo_sessions(session_token);
CREATE INDEX idx_paygo_sessions_status ON paygo_sessions(status);
CREATE INDEX idx_paygo_sessions_active ON paygo_sessions(status) WHERE status = 'active';
CREATE INDEX idx_paygo_sessions_time ON paygo_sessions(started_at);

-- PayGO rate cards (different rates for different content/types)
CREATE TABLE IF NOT EXISTS paygo_rate_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rate details
    rate_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Content type
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('video', 'audiobook', 'ebook', 'live_stream')),
    category VARCHAR(100),
    
    -- Pricing
    rate_per_minute_leones DECIMAL(10,6) NOT NULL,
    rate_per_minute_usd DECIMAL(10,6) NOT NULL,
    rate_per_hour_leones DECIMAL(10,2),
    rate_per_hour_usd DECIMAL(10,2),
    rate_per_day_leones DECIMAL(10,2),
    rate_per_day_usd DECIMAL(10,2),
    
    -- Minimum charges
    minimum_charge_minutes INTEGER DEFAULT 1,
    rounding_minutes INTEGER DEFAULT 1,
    
    -- Quality pricing
    quality_surcharges JSONB DEFAULT '{}',
    
    -- Validity
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paygo_rate_cards_active ON paygo_rate_cards(is_active);
CREATE INDEX idx_paygo_rate_cards_type ON paygo_rate_cards(product_type);
CREATE INDEX idx_paygo_rate_cards_default ON paygo_rate_cards(is_default) WHERE is_default = true;

-- Insert default PayGO rate cards
INSERT INTO paygo_rate_cards (
    rate_name, description, product_type, category,
    rate_per_minute_leones, rate_per_minute_usd,
    rate_per_hour_leones, rate_per_hour_usd,
    rate_per_day_leones, rate_per_day_usd,
    minimum_charge_minutes, rounding_minutes,
    valid_from, is_active, is_default
) VALUES 
('Standard Video Rate', 'Standard pay-per-minute rate for video content',
 'video', NULL, 
 0.017000, 0.001000,
 1.020000, 0.060000,
 24.480000, 1.440000,
 1, 1,
 NOW(), true, true),

('Premium Video Rate', 'Premium content at higher rate',
 'video', 'premium',
 0.025500, 0.001500,
 1.530000, 0.090000,
 36.720000, 2.160000,
 1, 1,
 NOW(), true, false),

('Audiobook Rate', 'Pay-per-minute for audiobooks',
 'audiobook', NULL,
 0.013600, 0.000800,
 0.816000, 0.048000,
 19.584000, 1.152000,
 1, 1,
 NOW(), true, true),

('Ebook Rate', 'Pay-per-minute for ebook reading',
 'ebook', NULL,
 0.008500, 0.000500,
 0.510000, 0.030000,
 12.240000, 0.720000,
 1, 1,
 NOW(), true, true),

('Live Stream Rate', 'Premium rate for live streams',
 'live_stream', NULL,
 0.034000, 0.002000,
 2.040000, 0.120000,
 48.960000, 2.880000,
 1, 1,
 NOW(), true, true)
ON CONFLICT DO NOTHING;

-- Utility function to calculate charge for duration
CREATE OR REPLACE FUNCTION calculate_paygo_charge(
    p_duration_seconds INTEGER,
    p_rate_per_minute_leones DECIMAL(10,6),
    p_rate_per_minute_usd DECIMAL(10,6),
    p_minimum_minutes INTEGER DEFAULT 1
) RETURNS TABLE (
    leones_charge DECIMAL(15,6),
    usd_charge DECIMAL(15,6),
    charged_minutes DECIMAL(12,6)
) AS $$
DECLARE
    v_minutes DECIMAL(12,6);
    v_charged_minutes DECIMAL(12,6);
BEGIN
    -- Convert seconds to minutes
    v_minutes := p_duration_seconds / 60.0;
    
    -- Apply minimum charge
    IF v_minutes < p_minimum_minutes THEN
        v_charged_minutes := p_minimum_minutes;
    ELSE
        v_charged_minutes := CEIL(v_minutes);
    END IF;
    
    -- Calculate charges
    leones_charge := ROUND(v_charged_minutes * p_rate_per_minute_leones, 6);
    usd_charge := ROUND(v_charged_minutes * p_rate_per_minute_usd, 6);
    charged_minutes := v_charged_minutes;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has sufficient balance
CREATE OR REPLACE FUNCTION check_paygo_balance(
    p_user_id VARCHAR(255),
    p_required_leones DECIMAL(15,6) DEFAULT 0,
    p_required_usd DECIMAL(15,6) DEFAULT 0
) RETURNS TABLE (
    has_sufficient_balance BOOLEAN,
    current_leones_balance DECIMAL(15,6),
    current_usd_balance DECIMAL(15,6),
    required_leones DECIMAL(15,6),
    required_usd DECIMAL(15,6),
    can_proceed BOOLEAN
) AS $$
DECLARE
    v_wallet paygo_wallets%ROWTYPE;
    v_has_balance BOOLEAN;
    v_can_proceed BOOLEAN;
BEGIN
    SELECT * INTO v_wallet
    FROM paygo_wallets
    WHERE user_id = p_user_id
    AND is_active = true
    AND is_suspended = false;
    
    IF NOT FOUND THEN
        has_sufficient_balance := false;
        current_leones_balance := 0;
        current_usd_balance := 0;
        required_leones := p_required_leones;
        required_usd := p_required_usd;
        can_proceed := false;
        RETURN NEXT;
        RETURN;
    END IF;
    
    -- Check both currency balances
    v_has_balance := (
        v_wallet.leones_balance >= p_required_leones OR 
        v_wallet.usd_balance >= p_required_usd
    );
    
    v_can_proceed := v_has_balance;
    
    has_sufficient_balance := v_has_balance;
    current_leones_balance := v_wallet.leones_balance;
    current_usd_balance := v_wallet.usd_balance;
    required_leones := p_required_leones;
    required_usd := p_required_usd;
    can_proceed := v_can_proceed;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_paygo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_paygo_wallets_updated_at
BEFORE UPDATE ON paygo_wallets
FOR EACH ROW
EXECUTE FUNCTION update_paygo_updated_at();

CREATE TRIGGER trg_paygo_sessions_updated_at
BEFORE UPDATE ON paygo_sessions
FOR EACH ROW
EXECUTE FUNCTION update_paygo_updated_at();

CREATE TRIGGER trg_paygo_rate_cards_updated_at
BEFORE UPDATE ON paygo_rate_cards
FOR EACH ROW
EXECUTE FUNCTION update_paygo_updated_at();
