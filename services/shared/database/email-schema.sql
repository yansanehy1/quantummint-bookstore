-- Sierra Books Email System Database Schema
-- PostgreSQL / MySQL Compatible

-- Email Templates
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('transactional', 'marketing', 'alert')),
    subject VARCHAR(200),
    html_content TEXT,
    text_content TEXT,
    variables JSONB,
    sendgrid_template_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Campaigns
CREATE TABLE email_campaigns (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES email_templates(id),
    name VARCHAR(100) NOT NULL,
    segment_criteria JSONB,
    send_schedule TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2),
    click_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Email Logs (Individual email sends)
CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES email_campaigns(id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(100),
    template_name VARCHAR(100),
    subject VARCHAR(200),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    first_click_at TIMESTAMP,
    last_click_at TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    bounce_type VARCHAR(20) CHECK (bounce_type IN ('soft', 'hard', NULL)),
    bounce_reason VARCHAR(255),
    spam_report BOOLEAN DEFAULT false,
    unsubscribe_at TIMESTAMP,
    sendgrid_message_id VARCHAR(100),
    metadata JSONB,
    INDEX idx_recipient_email (recipient_email),
    INDEX idx_sent_at (sent_at),
    INDEX idx_campaign_id (campaign_id)
);

-- User Email Preferences
CREATE TABLE user_email_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    receives_marketing BOOLEAN DEFAULT true,
    receives_alerts BOOLEAN DEFAULT true,
    receives_reviews BOOLEAN DEFAULT true,
    receives_newsletters BOOLEAN DEFAULT true,
    digest_frequency VARCHAR(20) DEFAULT 'daily' CHECK (digest_frequency IN ('immediate', 'daily', 'weekly', 'never')),
    last_marketing_email TIMESTAMP,
    last_alert_email TIMESTAMP,
    marketing_emails_count INTEGER DEFAULT 0,
    total_emails_received INTEGER DEFAULT 0,
    unsubscribed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email)
);

-- Wishlist Alerts
CREATE TABLE wishlist_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    alert_type VARCHAR(20) DEFAULT 'back_in_stock' CHECK (alert_type IN ('back_in_stock', 'price_drop')),
    email_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP,
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP,
    purchased_after_alert BOOLEAN DEFAULT false,
    purchased_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_book (user_id, book_id),
    INDEX idx_email_sent (email_sent)
);

-- Abandoned Cart Tracking
CREATE TABLE abandoned_cart_emails (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    cart_value DECIMAL(10,2),
    reminder_sequence INTEGER DEFAULT 1 CHECK (reminder_sequence IN (1, 2, 3)),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    recovered BOOLEAN DEFAULT false,
    recovered_at TIMESTAMP,
    recovered_value DECIMAL(10,2),
    INDEX idx_cart_id (cart_id),
    INDEX idx_user_email (user_email)
);

-- Email Click Tracking
CREATE TABLE email_clicks (
    id SERIAL PRIMARY KEY,
    email_log_id INTEGER REFERENCES email_logs(id),
    url VARCHAR(500) NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    INDEX idx_email_log_id (email_log_id),
    INDEX idx_url (url)
);

-- Email Queue (for scheduled/delayed sends)
CREATE TABLE email_queue (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(100),
    dynamic_data JSONB,
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    scheduled_for TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    INDEX idx_status_priority (status, priority),
    INDEX idx_scheduled_for (scheduled_for)
);

-- Email Performance Metrics (Daily aggregates)
CREATE TABLE email_metrics_daily (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    emails_unsubscribed INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2),
    click_rate DECIMAL(5,2),
    bounce_rate DECIMAL(5,2),
    unsubscribe_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (metric_date)
);

-- Useful Views
CREATE VIEW email_campaign_performance AS
SELECT 
    c.id,
    c.name,
    c.status,
    c.sent_count,
    c.delivered_count,
    c.opened_count,
    c.clicked_count,
    c.bounced_count,
    ROUND((c.opened_count::DECIMAL / NULLIF(c.delivered_count, 0)) * 100, 2) as open_rate,
    ROUND((c.clicked_count::DECIMAL / NULLIF(c.delivered_count, 0)) * 100, 2) as click_rate,
    ROUND((c.bounced_count::DECIMAL / NULLIF(c.sent_count, 0)) * 100, 2) as bounce_rate
FROM email_campaigns c;

CREATE VIEW recent_email_activity AS
SELECT 
    el.id,
    el.recipient_email,
    el.template_name,
    el.sent_at,
    el.opened_at,
    el.first_click_at,
    el.bounce_type,
    el.unsubscribe_at,
    CASE 
        WHEN el.unsubscribe_at IS NOT NULL THEN 'unsubscribed'
        WHEN el.bounce_type IS NOT NULL THEN 'bounced'
        WHEN el.first_click_at IS NOT NULL THEN 'clicked'
        WHEN el.opened_at IS NOT NULL THEN 'opened'
        WHEN el.delivered_at IS NOT NULL THEN 'delivered'
        ELSE 'sent'
    END as status
FROM email_logs el
ORDER BY el.sent_at DESC
LIMIT 100;

-- Indexes for performance
CREATE INDEX idx_email_logs_opened ON email_logs(opened_at) WHERE opened_at IS NOT NULL;
CREATE INDEX idx_email_logs_clicked ON email_logs(first_click_at) WHERE first_click_at IS NOT NULL;
CREATE INDEX idx_email_logs_bounced ON email_logs(bounce_type) WHERE bounce_type IS NOT NULL;
CREATE INDEX idx_email_queue_pending ON email_queue(scheduled_for, priority) WHERE status = 'pending';
