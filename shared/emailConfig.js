/**
 * Email Configuration for QuantumMint Bookstore - Sierra Books
 * Domain: quantum.quantummint.net
 */

module.exports = {
    // Domain Configuration
    domain: 'quantummint.net',
    platformUrl: 'https://quantum.quantummint.net',

    // Email Senders
    senders: {
        orders: {
            email: 'orders@quantummint.net',
            name: 'Sierra Books Order Confirmation'
        },
        support: {
            email: 'support@quantummint.net',
            name: 'Sierra Books Support'
        },
        newsletter: {
            email: 'newsletter@quantummint.net',
            name: 'Sierra Books Newsletter'
        },
        alerts: {
            email: 'alerts@quantummint.net',
            name: 'Sierra Books Inventory Alerts'
        },
        admin: {
            email: 'admin@quantummint.net',
            name: 'QuantumMint Bookstore System'
        }
    },

    // DNS Configuration
    dns: {
        spf: 'v=spf1 include:_spf.quantummint.net include:email-provider.com ~all',
        dmarc: 'v=DMARC1; p=none; rua=mailto:reports@quantummint.net; ruf=mailto:forensics@quantummint.net',
        // DKIM keys should be added via email service provider
    },

    // Email Service Provider Configuration
    esp: {
        transactional: {
            provider: 'sendgrid',
            apiKey: process.env.SENDGRID_API_KEY,
            // Unlimited for transactional emails
        },
        marketing: {
            provider: 'mailchimp',
            apiKey: process.env.MAILCHIMP_API_KEY,
            listId: process.env.MAILCHIMP_LIST_ID,
            monthlyLimit: 10000
        }
    },

    // Webhook Endpoints
    webhooks: {
        open: '/api/email/open',
        click: '/api/email/click',
        unsubscribe: '/api/email/unsubscribe',
        bounce: '/api/email/bounce'
    },

    // Email Templates
    templates: {
        // Customer Journey
        WELCOME_BOOKSTORE_01: 'welcome-bookstore',
        ORDER_CONFIRM_01: 'order-confirmation',
        ORDER_PROCESSED: 'order-processed',
        ORDER_SHIPPED: 'order-shipped',
        ORDER_OUT_FOR_DELIVERY: 'order-out-for-delivery',
        ORDER_DELIVERED: 'order-delivered',

        // Abandoned Cart
        CART_ABANDONED_1H: 'cart-abandoned-1hour',
        CART_ABANDONED_24H: 'cart-abandoned-24hours',
        CART_ABANDONED_72H: 'cart-abandoned-72hours',

        // Inventory
        BACK_IN_STOCK: 'back-in-stock',
        PRICE_DROP: 'price-drop-alert',
        PREORDER_REMINDER: 'preorder-reminder',

        // Marketing
        NEWSLETTER_MONTHLY: 'monthly-newsletter',
        RECOMMENDATIONS: 'personalized-recommendations',

        // Re-engagement
        INACTIVE_30_DAYS: 'reengagement-30days',
        INACTIVE_90_DAYS: 'reengagement-90days',
        INACTIVE_180_DAYS: 'reengagement-180days',

        // Support
        SUPPORT_TICKET: 'support-ticket-received',
        REVIEW_REQUEST_01: 'review-request',

        // Loyalty
        POINTS_EARNED: 'loyalty-points-earned',
        TIER_UPGRADE: 'loyalty-tier-upgrade',
        POINTS_EXPIRING: 'loyalty-points-expiring'
    },

    // Automation Triggers
    triggers: {
        order_placed: {
            template: 'ORDER_CONFIRM_01',
            sender: 'orders',
            immediate: true
        },
        order_shipped: {
            template: 'ORDER_SHIPPED',
            sender: 'orders',
            immediate: true
        },
        cart_abandoned: {
            sequence: [
                { delay: '1 hour', template: 'CART_ABANDONED_1H' },
                { delay: '24 hours', template: 'CART_ABANDONED_24H' },
                { delay: '72 hours', template: 'CART_ABANDONED_72H' }
            ],
            sender: 'orders'
        },
        user_registered: {
            template: 'WELCOME_BOOKSTORE_01',
            sender: 'support',
            immediate: true,
            data: {
                discountCode: 'WELCOME10',
                discountPercent: 10
            }
        },
        wishlist_item_back: {
            template: 'BACK_IN_STOCK',
            sender: 'alerts',
            immediate: true
        },
        order_delivered_7days: {
            template: 'REVIEW_REQUEST_01',
            sender: 'support',
            delay: '7 days'
        }
    },

    // Compliance Settings
    compliance: {
        physicalAddress: 'Sierra Books, [Your Address]', // TODO: Update with actual address
        requireUnsubscribe: true,
        oneClickUnsubscribe: true,
        includePreferenceCenter: true,
        privacyPolicyUrl: 'https://quantum.quantummint.net/privacy',

        // Frequency Caps
        maxMarketingPerWeek: 2,
        maxPromotionalPerDay: 1,
        noSendHoursStart: 22, // 10 PM
        noSendHoursEnd: 6,    // 6 AM

        // Required in all emails
        requiredLinks: [
            { label: 'Unsubscribe', url: '/unsubscribe' },
            { label: 'Manage Preferences', url: '/email-preferences' },
            { label: 'Privacy Policy', url: '/privacy' }
        ]
    },

    // Performance Targets
    metrics: {
        targets: {
            openRate: 0.25,      // 25%
            clickRate: 0.03,     // 3%
            conversionRate: 0.01, // 1%
            unsubscribeRate: 0.005, // 0.5%
            bounceRate: 0.02     // 2%
        },

        // Alert thresholds
        alerts: {
            bounceRateHigh: 0.05,      // Alert if > 5%
            unsubscribeRateHigh: 0.02,  // Alert if > 2%
            openRateLow: 0.15           // Alert if < 15%
        }
    },

    // Seasonal Adjustments
    seasonal: {
        holiday: {
            // November - December
            maxEmailsPerWeek: 3,
            campaigns: ['black-friday', 'cyber-monday', 'holiday-gift-guide']
        },
        postHoliday: {
            // January
            maxEmailsPerWeek: 1
        }
    },

    // Welcome Series Configuration
    welcomeSeries: [
        {
            day: 1,
            subject: 'Welcome to Sierra Books Insider',
            template: 'WELCOME_SERIES_1',
            includeDiscountCode: true
        },
        {
            day: 3,
            subject: 'Meet Our Staff Picks',
            template: 'WELCOME_SERIES_2'
        },
        {
            day: 7,
            subject: 'Behind the Scenes: Our Curating Process',
            template: 'WELCOME_SERIES_3'
        }
    ],

    // Admin Notifications
    adminAlerts: {
        lowStock: {
            recipients: ['admin@quantummint.net'],
            threshold: 5, // Alert when inventory < 5 units
            subject: 'Low Stock Alert - [Product Name]'
        },
        orderAnomalies: {
            recipients: ['admin@quantummint.net'],
            conditions: {
                unusuallyLarge: 10, // More than 10 items
                highValue: 500      // Order value > $500
            },
            subject: 'Order Anomaly Alert - Order [OrderNumber]'
        },
        dailySummary: {
            recipients: ['admin@quantummint.net'],
            time: '08:00',
            subject: 'Daily Sales Summary - [Date]'
        }
    },

    // Testing Configuration
    testing: {
        preflightChecks: [
            'links_functional',
            'images_have_alt_text',
            'mobile_responsive',
            'spam_score_under_2'
        ],
        abTestPercentage: 0.05, // 5% for A/B testing
        testRecipients: process.env.EMAIL_TEST_RECIPIENTS?.split(',') || []
    }
};
