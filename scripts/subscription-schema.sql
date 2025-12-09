-- =====================================================
-- QUANTUMMINT BOOKSTORE - SUBSCRIPTION SCHEMA
-- =====================================================
-- PostgreSQL database schema for subscription management
-- Supports time-based access, recurring billing, analytics

-- Create database (run separately if needed)
-- CREATE DATABASE siera_subscriptions;

-- Connect to database
\c siera_subscriptions;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLE 1: SUBSCRIPTION PLANS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Time-based access configuration
    access_period_unit VARCHAR(10) NOT NULL CHECK (access_period_unit IN ('hour', 'day', 'week', 'month', 'year')),
    access_period_value INTEGER NOT NULL DEFAULT 1,
    access_duration_seconds INTEGER NOT NULL, -- Auto-calculated by trigger
    
    -- Pricing
    price_amount DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(3) DEFAULT 'USD',
    billing_interval VARCHAR(20) DEFAULT 'one_time' CHECK (billing_interval IN ('one_time', 'recurring')),
    recurring_interval VARCHAR(20) CHECK (recurring_interval IN ('hourly', 'daily', 'weekly', 'monthly', 'yearly')),
    
    -- Access limits
    max_concurrent_streams INTEGER DEFAULT 1,
    max_quality VARCHAR(20) DEFAULT '1080p',
    max_downloads INTEGER DEFAULT 0,
    max_offline_devices INTEGER DEFAULT 0,
    
    -- Content access permissions
    allowed_product_types TEXT[] DEFAULT ARRAY['video', 'audiobook', 'ebook'],
    allowed_categories TEXT[],
    excluded_categories TEXT[],
    max_products_per_month INTEGER DEFAULT 100,
    
    -- Plan status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Trial configuration
    trial_period_days INTEGER DEFAULT 0,
    trial_price_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Metadata
    sort_order INTEGER DEFAULT 0,
    icon_url TEXT,
    features JSONB DEFAULT '[]',
    restrictions JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_plans_sku ON subscription_plans(sku);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX idx_subscription_plans_featured ON subscription_plans(is_featured);

-- =====================================================
-- TABLE 2: USER SUBSCRIPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL, -- References users.id from auth-service
    plan_id UUID REFERENCES subscription_plans(id),
    
    -- Subscription status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended', 'pending', 'trial', 'paused')),
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP,
    
    -- Time usage tracking
    total_seconds_consumed INTEGER DEFAULT 0,
    seconds_consumed_this_period INTEGER DEFAULT 0,
    last_access_time TIMESTAMP,
    
    -- Payment details
    payment_method_id VARCHAR(100),
    payment_provider VARCHAR(50) DEFAULT 'stripe',
    subscription_provider_id VARCHAR(100), -- External subscription ID (Stripe, PayPal)
    
    -- Billing cycle
    billing_cycle_anchor TIMESTAMP,
    current_billing_period_start TIMESTAMP,
    current_billing_period_end TIMESTAMP,
    
    -- Trial information
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    is_in_trial BOOLEAN DEFAULT false,
    
    -- Auto-renewal
    auto_renew BOOLEAN DEFAULT true,
    renewal_attempts INTEGER DEFAULT 0,
    next_payment_attempt TIMESTAMP,
    
    -- Usage limits tracking
    products_accessed_this_month INTEGER DEFAULT 0,
    streams_this_month INTEGER DEFAULT 0,
    downloads_this_month INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_period_end ON user_subscriptions(current_period_end);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);

-- =====================================================
-- TABLE 3: SUBSCRIPTION USAGE TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    
    -- Usage type
    usage_type VARCHAR(50) NOT NULL CHECK (usage_type IN ('stream', 'download', 'view', 'access', 'offline')),
    
    -- Resource accessed
    product_id VARCHAR(100),
    product_type VARCHAR(20),
    category VARCHAR(100),
    
    -- Usage details
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    quality VARCHAR(20),
    device_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- Bandwidth/cost tracking
    data_transferred_bytes BIGINT DEFAULT 0,
    estimated_cost DECIMAL(10,6) DEFAULT 0,
    
    -- Status
    completed BOOLEAN DEFAULT true,
    error_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX idx_subscription_usage_user_id ON subscription_usage(user_id);
CREATE INDEX idx_subscription_usage_start_time ON subscription_usage(start_time);
CREATE INDEX idx_subscription_usage_type ON subscription_usage(usage_type);
CREATE INDEX idx_subscription_usage_product_id ON subscription_usage(product_id);

-- =====================================================
-- TABLE 4: SUBSCRIPTION INVOICES
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES user_subscriptions(id),
    user_id VARCHAR(100) NOT NULL,
    
    -- Invoice details
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    
    -- Amounts
    subtotal_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    tax_rate DECIMAL(5,4) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Payment status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    paid_at TIMESTAMP,
    payment_method VARCHAR(50),
    payment_id VARCHAR(100),
    payment_provider VARCHAR(50),
    
    -- Billing info
    billing_address JSONB,
    tax_id VARCHAR(100),
    
    -- PDF/receipt data
    invoice_pdf_url TEXT,
    hosted_invoice_url TEXT,
    receipt_number VARCHAR(100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_invoices_user_id ON subscription_invoices(user_id);
CREATE INDEX idx_subscription_invoices_subscription_id ON subscription_invoices(subscription_id);
CREATE INDEX idx_subscription_invoices_status ON subscription_invoices(status);
CREATE INDEX idx_subscription_invoices_invoice_number ON subscription_invoices(invoice_number);
CREATE INDEX idx_subscription_invoices_period_start ON subscription_invoices(period_start);

-- =====================================================
-- TABLE 5: SUBSCRIPTION COUPONS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Discount configuration
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_trial')),
    discount_value DECIMAL(10,2) NOT NULL,
    discount_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Validity period
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP,
    max_redemptions INTEGER,
    times_redeemed INTEGER DEFAULT 0,
    
    -- Restrictions
    applies_to_plan_ids UUID[],
    min_subscription_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    once_per_customer BOOLEAN DEFAULT false,
    new_customers_only BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_coupons_code ON subscription_coupons(code);
CREATE INDEX idx_subscription_coupons_active ON subscription_coupons(is_active);
CREATE INDEX idx_subscription_coupons_valid_from ON subscription_coupons(valid_from);
CREATE INDEX idx_subscription_coupons_valid_until ON subscription_coupons(valid_until);

-- =====================================================
-- TABLE 6: SUBSCRIPTION WEBHOOK EVENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    
    -- Event source
    provider VARCHAR(50) NOT NULL,
    provider_event_id VARCHAR(100),
    payload JSONB NOT NULL,
    
    -- Processing status
    processed BOOLEAN DEFAULT false,
    processing_error TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_provider ON subscription_events(provider);
CREATE INDEX idx_subscription_events_processed ON subscription_events(processed);
CREATE INDEX idx_subscription_events_created_at ON subscription_events(created_at);

-- =====================================================
-- TABLE 7: SUBSCRIPTION ACCESS LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES user_subscriptions(id),
    user_id VARCHAR(100) NOT NULL,
    
    -- Access attempt details
    accessed_at TIMESTAMP NOT NULL,
    access_type VARCHAR(50) NOT NULL CHECK (access_type IN ('granted', 'denied', 'expired', 'limit_exceeded')),
    
    -- Resource details
    product_id VARCHAR(100),
    product_type VARCHAR(20),
    requested_quality VARCHAR(20),
    
    -- Access context
    reason VARCHAR(200),
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(100),
    
    -- Limit information
    concurrent_streams INTEGER,
    remaining_seconds INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_access_logs_user_id ON subscription_access_logs(user_id);
CREATE INDEX idx_subscription_access_logs_accessed_at ON subscription_access_logs(accessed_at);
CREATE INDEX idx_subscription_access_logs_access_type ON subscription_access_logs(access_type);
CREATE INDEX idx_subscription_access_logs_subscription_id ON subscription_access_logs(subscription_id);

-- =====================================================
-- TABLE 8: SUBSCRIPTION ANALYTICS (PRE-AGGREGATED)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id),
    
    -- Subscription metrics
    active_subscriptions INTEGER DEFAULT 0,
    new_subscriptions INTEGER DEFAULT 0,
    cancelled_subscriptions INTEGER DEFAULT 0,
    churned_subscriptions INTEGER DEFAULT 0,
    trial_conversions INTEGER DEFAULT 0,
    
    -- Revenue metrics
    mrr_amount DECIMAL(15,2) DEFAULT 0.00,  -- Monthly Recurring Revenue
    arr_amount DECIMAL(15,2) DEFAULT 0.00,  -- Annual Recurring Revenue
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    
    -- Usage metrics
    total_streaming_hours DECIMAL(10,2) DEFAULT 0,
    average_streaming_hours DECIMAL(10,2) DEFAULT 0,
    peak_concurrent_users INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    
    -- Customer metrics
    customer_acquisition_cost DECIMAL(10,2) DEFAULT 0.00,
    lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    churn_rate DECIMAL(5,4) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(date, plan_id)
);

CREATE INDEX idx_subscription_analytics_date ON subscription_analytics(date);
CREATE INDEX idx_subscription_analytics_plan_id ON subscription_analytics(plan_id);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to auto-calculate access_duration_seconds
CREATE OR REPLACE FUNCTION update_access_duration()
RETURNS TRIGGER AS $$
BEGIN
    CASE NEW.access_period_unit
        WHEN 'hour' THEN
            NEW.access_duration_seconds := NEW.access_period_value * 3600;
        WHEN 'day' THEN
            NEW.access_duration_seconds := NEW.access_period_value * 86400;
        WHEN 'week' THEN
            NEW.access_duration_seconds := NEW.access_period_value * 604800;
        WHEN 'month' THEN
            NEW.access_duration_seconds := NEW.access_period_value * 2592000; -- 30 days
        WHEN 'year' THEN
            NEW.access_duration_seconds := NEW.access_period_value * 31536000; -- 365 days
    END CASE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_access_duration
BEFORE INSERT OR UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION update_access_duration();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_subscription_plans_updated_at
BEFORE UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_subscriptions_updated_at
BEFORE UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_subscription_invoices_updated_at
BEFORE UPDATE ON subscription_invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_subscription_coupons_updated_at
BEFORE UPDATE ON subscription_coupons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: SUBSCRIPTION PLANS
-- =====================================================

-- Clear existing plans (development only)
-- DELETE FROM subscription_plans;

-- Hourly Plans
INSERT INTO subscription_plans (
    sku, name, description, 
    access_period_unit, access_period_value,
    price_amount, price_currency, billing_interval,
    max_concurrent_streams, max_quality, max_downloads,
    allowed_product_types, features, is_active, sort_order
) VALUES 
('SUB-HOUR-1', '1-Hour Access', 'Perfect for quick learning sessions',
 'hour', 1,
 1.99, 'USD', 'one_time',
 1, '720p', 0,
 ARRAY['video', 'audiobook', 'ebook'],
 '["Standard quality streaming", "Basic support", "Single device"]'::jsonb,
 true, 1),

('SUB-HOUR-4', '4-Hour Intensive', 'Half-day intensive learning',
 'hour', 4,
 4.99, 'USD', 'one_time',
 1, '1080p', 2,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "Email support", "2 downloads", "Offline access"]'::jsonb,
 true, 2),

('SUB-HOUR-8', '8-Hour Marathon', 'Full day of unlimited learning',
 'hour', 8,
 8.99, 'USD', 'one_time',
 2, '1080p', 5,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "Priority support", "5 downloads", "Offline access"]'::jsonb,
 true, 3);

-- Daily Plans
INSERT INTO subscription_plans (
    sku, name, description,
    access_period_unit, access_period_value,
    price_amount, price_currency, billing_interval,
    max_concurrent_streams, max_quality, max_downloads,
    allowed_product_types, features, is_active, sort_order
) VALUES
('SUB-DAY-1', '1-Day Access', '24-hour full access',
 'day', 1,
 7.99, 'USD', 'one_time',
 2, '1080p', 5,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "5 downloads", "Email support", "2 concurrent streams"]'::jsonb,
 true, 4),

('SUB-DAY-3', '3-Day Weekend', 'Weekend learning marathon',
 'day', 3,
 14.99, 'USD', 'one_time',
 2, '1080p', 10,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "10 downloads", "Priority support", "Offline access"]'::jsonb,
 true, 5),

('SUB-DAY-7', '1-Week Trial', 'Full week trial',
 'day', 7,
 19.99, 'USD', 'one_time',
 3, '4K', 20,
 ARRAY['video', 'audiobook', 'ebook', 'scientific'],
 '["4K streaming", "20 downloads", "Priority support", "All content types"]'::jsonb,
 true, 6);

-- Weekly Plans
INSERT INTO subscription_plans (
    sku, name, description,
    access_period_unit, access_period_value,
    price_amount, price_currency, billing_interval,
    max_concurrent_streams, max_quality, max_downloads,
    allowed_product_types, features, is_active, sort_order
) VALUES
('SUB-WEEK-1', '1-Week Access', 'Full week of unlimited learning',
 'week', 1,
 19.99, 'USD', 'one_time',
 2, '1080p', 20,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "20 downloads", "Priority support", "Early access"]'::jsonb,
 true, 7),

('SUB-WEEK-2', '2-Week Access', 'Bi-weekly intensive learning',
 'week', 2,
 29.99, 'USD', 'one_time',
 3, '4K', 30,
 ARRAY['video', 'audiobook', 'ebook', 'scientific'],
 '["4K streaming", "30 downloads", "Priority support", "Scientific content"]'::jsonb,
 true, 8);

-- Monthly Plans (Recurring)
INSERT INTO subscription_plans (
    sku, name, description,
    access_period_unit, access_period_value,
    price_amount, price_currency, billing_interval, recurring_interval,
    max_concurrent_streams, max_quality, max_downloads,
    allowed_product_types, features, is_active, is_featured, sort_order
) VALUES
('SUB-MONTH-BASIC', 'Monthly Basic', 'Essential monthly access',
 'month', 1,
 24.99, 'USD', 'recurring', 'monthly',
 2, '1080p', 50,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "50 downloads/month", "Email support", "Offline access"]'::jsonb,
 true, false, 9),

('SUB-MONTH-PRO', 'Monthly Pro', 'Professional monthly access',
 'month', 1,
 49.99, 'USD', 'recurring', 'monthly',
 4, '4K', 100,
 ARRAY['video', 'audiobook', 'ebook', 'scientific'],
 '["4K streaming", "100 downloads/month", "Priority support", "All content"]'::jsonb,
 true, true, 10),

('SUB-MONTH-PREMIUM', 'Monthly Premium', 'Premium with all features',
 'month', 1,
 99.99, 'USD', 'recurring', 'monthly',
 6, '4K', 200,
 ARRAY['video', 'audiobook', 'ebook', 'scientific'],
 '["4K streaming", "200 downloads/month", "24/7 support", "All features"]'::jsonb,
 true, false, 11);

-- Yearly Plans (Recurring)
INSERT INTO subscription_plans (
    sku, name, description,
    access_period_unit, access_period_value,
    price_amount, price_currency, billing_interval, recurring_interval,
    max_concurrent_streams, max_quality, max_downloads,
    allowed_product_types, features, is_active, sort_order, trial_period_days
) VALUES
('SUB-YEAR-BASIC', 'Yearly Basic', 'Essential yearly access (2 months free)',
 'year', 1,
 239.99, 'USD', 'recurring', 'yearly',
 2, '1080p', 600,
 ARRAY['video', 'audiobook', 'ebook'],
 '["HD streaming", "600 downloads/year", "Email support", "2 months free"]'::jsonb,
 true, 12, 7),

('SUB-YEAR-PRO', 'Yearly Pro', 'Professional yearly access (2 months free)',
 'year', 1,
 479.99, 'USD', 'recurring', 'yearly',
 4, '4K', 1200,
 ARRAY['video', 'audiobook', 'ebook', 'scientific'],
 '["4K streaming", "1200 downloads/year", "Priority support", "2 months free"]'::jsonb,
 true, 13, 14),

('SUB-YEAR-PREMIUM', 'Yearly Premium', 'Premium yearly access (3 months free)',
 'year', 1,
 899.99, 'USD', 'recurring', 'yearly',
 6, '4K', 2400,
 ARRAY['video', 'audiobook', 'ebook', 'scientific'],
 '["4K streaming", "Unlimited downloads", "24/7 support", "3 months free"]'::jsonb,
 true, 14, 30);

-- =====================================================
-- SAMPLE COUPONS
-- =====================================================

INSERT INTO subscription_coupons (
    code, name, description,
    discount_type, discount_value, discount_currency,
    valid_from, valid_until,
    max_redemptions, is_active
) VALUES
('WELCOME25', 'Welcome 25% Off', 'Get 25% off your first subscription',
 'percentage', 25.00, 'USD',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days',
 1000, true),

('FREEMONTH', 'Free Month Trial', 'Get your first month free',
 'free_trial', 30.00, 'USD',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days',
 500, true);

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to get active subscription for user
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id VARCHAR)
RETURNS TABLE (
    subscription_id UUID,
    plan_name VARCHAR,
    status VARCHAR,
    current_period_end TIMESTAMP,
    remaining_seconds INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        sp.name,
        us.status,
        us.current_period_end,
        GREATEST(0, EXTRACT(EPOCH FROM (us.current_period_end - CURRENT_TIMESTAMP))::INTEGER)
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND us.current_period_end > CURRENT_TIMESTAMP
    ORDER BY us.current_period_end DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Subscription schema created successfully!';
    RAISE NOTICE 'Tables created: 8';
    RAISE NOTICE 'Subscription plans seeded: 14';
    RAISE NOTICE 'Coupons seeded: 2';
END $$;
