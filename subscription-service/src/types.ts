// Type definitions for Subscription Service

export interface SubscriptionPlan {
    id: string;
    sku: string;
    name: string;
    description: string;
    access_period_unit: 'hour' | 'day' | 'week' | 'month' | 'year';
    access_period_value: number;
    access_duration_seconds: number;
    price_amount: number;
    price_currency: string;
    billing_interval: 'one_time' | 'recurring';
    recurring_interval?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    max_concurrent_streams: number;
    max_quality: string;
    max_downloads: number;
    max_offline_devices: number;
    allowed_product_types: string[];
    allowed_categories?: string[];
    excluded_categories?: string[];
    max_products_per_month: number;
    is_active: boolean;
    is_featured: boolean;
    requires_approval: boolean;
    trial_period_days: number;
    trial_price_amount: number;
    sort_order: number;
    icon_url?: string;
    features: string[];
    restrictions: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}

export interface UserSubscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'cancelled' | 'expired' | 'suspended' | 'pending' | 'trial' | 'paused';
    current_period_start: Date;
    current_period_end: Date;
    cancel_at_period_end: boolean;
    cancelled_at?: Date;
    total_seconds_consumed: number;
    seconds_consumed_this_period: number;
    last_access_time?: Date;
    payment_method_id?: string;
    payment_provider: string;
    subscription_provider_id?: string;
    billing_cycle_anchor?: Date;
    current_billing_period_start?: Date;
    current_billing_period_end?: Date;
    trial_start?: Date;
    trial_end?: Date;
    is_in_trial: boolean;
    auto_renew: boolean;
    renewal_attempts: number;
    next_payment_attempt?: Date;
    products_accessed_this_month: number;
    streams_this_month: number;
    downloads_this_month: number;
    metadata: Record<string, any>;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface SubscriptionUsage {
    id: string;
    subscription_id: string;
    user_id: string;
    usage_type: 'stream' | 'download' | 'view' | 'access' | 'offline';
    product_id?: string;
    product_type?: string;
    category?: string;
    start_time: Date;
    end_time?: Date;
    duration_seconds: number;
    quality?: string;
    device_id?: string;
    ip_address?: string;
    user_agent?: string;
    data_transferred_bytes: number;
    estimated_cost: number;
    completed: boolean;
    error_reason?: string;
    created_at: Date;
}

export interface SubscriptionInvoice {
    id: string;
    subscription_id: string;
    user_id: string;
    invoice_number: string;
    period_start: Date;
    period_end: Date;
    due_date: Date;
    subtotal_amount: number;
    tax_amount: number;
    total_amount: number;
    currency: string;
    tax_rate: number;
    discount_amount: number;
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    paid_at?: Date;
    payment_method?: string;
    payment_id?: string;
    payment_provider?: string;
    billing_address?: Record<string, any>;
    tax_id?: string;
    invoice_pdf_url?: string;
    hosted_invoice_url?: string;
    receipt_number?: string;
    metadata: Record<string, any>;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateSubscriptionRequest {
    user_id: string;
    plan_id: string;
    payment_method?: string;
    coupon_code?: string;
}

export interface AccessCheckRequest {
    user_id: string;
    product_id: string;
    product_type: string;
    requested_quality?: string;
}

export interface AccessCheckResponse {
    access: boolean;
    reason?: string;
    message?: string;
    subscription?: Partial<UserSubscription>;
    remaining_seconds?: number;
    max_quality?: string;
    max_concurrent_streams?: number;
}

export interface SubscriptionAnalyticsResponse {
    subscription: UserSubscription;
    usage_statistics: {
        total_sessions: number;
        total_seconds: number;
        average_session_seconds: number;
        longest_session_seconds: number;
        shortest_session_seconds: number;
        stream_count: number;
        download_count: number;
    };
    cost_analysis: {
        total_paid: number;
        cost_per_hour: number;
    };
    time_analysis: {
        hourly_usage: Array<{ hour: number; sessions: number; seconds: number }>;
        daily_usage: Array<{ day: number; sessions: number; seconds: number }>;
    };
    recommendations: Array<{
        type: string;
        reason: string;
        suggestion: string;
        priority: string;
    }>;
}
