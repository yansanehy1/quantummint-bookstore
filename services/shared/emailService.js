/**
 * Email Service for QuantumMint Bookstore
 * Handles all email sending, templating, and automation
 */

const emailConfig = require('./emailConfig');
const logger = require('./logger');

class EmailService {
    constructor() {
        this.config = emailConfig;
        this.sendgridClient = null;
        this.mailchimpClient = null;
        this.queue = [];
        this.initialized = false;
    }

    /**
     * Initialize email service with providers
     */
    async initialize() {
        try {
            // Initialize SendGrid for transactional emails
            if (this.config.esp.transactional.apiKey) {
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(this.config.esp.transactional.apiKey);
                this.sendgridClient = sgMail;
                logger.info('SendGrid initialized for transactional emails');
            }

            // Initialize Mailchimp for marketing emails
            if (this.config.esp.marketing.apiKey) {
                const Mailchimp = require('@mailchimp/mailchimp_marketing');
                Mailchimp.setConfig({
                    apiKey: this.config.esp.marketing.apiKey,
                    server: process.env.MAILCHIMP_SERVER || 'us1'
                });
                this.mailchimpClient = Mailchimp;
                logger.info('Mailchimp initialized for marketing emails');
            }

            this.initialized = true;
            logger.info('Email Service initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize Email Service:', error);
            throw error;
        }
    }

    /**
     * Send transactional email
     */
    async sendTransactional(options) {
        const {
            to,
            templateId,
            dynamicData = {},
            sender = 'support',
            subject,
            trackOpen = true,
            trackClick = true
        } = options;

        if (!this.sendgridClient) {
            logger.error('SendGrid not initialized');
            return { success: false, error: 'Email service not initialized' };
        }

        try {
            const senderConfig = this.config.senders[sender];

            const msg = {
                to,
                from: {
                    email: senderConfig.email,
                    name: senderConfig.name
                },
                subject: subject || this.getDefaultSubject(templateId),
                templateId: this.getTemplateId(templateId),
                dynamicTemplateData: {
                    ...dynamicData,
                    platformUrl: this.config.platformUrl,
                    unsubscribeUrl: `${this.config.platformUrl}/unsubscribe`,
                    companyAddress: this.config.compliance.physicalAddress
                },
                trackingSettings: {
                    clickTracking: { enable: trackClick },
                    openTracking: { enable: trackOpen }
                }
            };

            const result = await this.sendgridClient.send(msg);

            logger.info('Transactional email sent', {
                to,
                templateId,
                messageId: result[0].headers['x-message-id']
            });

            return {
                success: true,
                messageId: result[0].headers['x-message-id']
            };

        } catch (error) {
            logger.error('Failed to send transactional email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(order) {
        return this.sendTransactional({
            to: order.customerEmail,
            templateId: 'ORDER_CONFIRM_01',
            sender: 'orders',
            subject: `Your QuantumMint Order ${order.orderNumber} is Confirmed!`,
            dynamicData: {
                orderNumber: order.orderNumber,
                orderDate: order.createdAt,
                items: order.items,
                subtotal: order.subtotal,
                shipping: order.shippingCost,
                tax: order.tax,
                total: order.total,
                shippingAddress: order.shippingAddress,
                estimatedDelivery: order.estimatedDelivery,
                trackingUrl: `${this.config.platformUrl}/track/${order.orderNumber}`
            }
        });
    }

    /**
     * Send shipping notification
     */
    async sendShippingNotification(order, trackingInfo) {
        return this.sendTransactional({
            to: order.customerEmail,
            templateId: 'ORDER_SHIPPED',
            sender: 'orders',
            subject: `Your QuantumMint Order ${order.orderNumber} Has Shipped!`,
            dynamicData: {
                orderNumber: order.orderNumber,
                trackingNumber: trackingInfo.trackingNumber,
                carrier: trackingInfo.carrier,
                carrierTrackingUrl: trackingInfo.trackingUrl,
                estimatedDelivery: trackingInfo.estimatedDelivery,
                items: order.items.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    coverImage: item.coverImage
                }))
            }
        });
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(user) {
        return this.sendTransactional({
            to: user.email,
            templateId: 'WELCOME_BOOKSTORE_01',
            sender: 'support',
            subject: 'Welcome to QuantumMint - Your Literary Journey Begins!',
            dynamicData: {
                firstName: user.name.split(' ')[0],
                discountCode: 'WELCOME10',
                discountPercent: 10,
                collectionsUrl: `${this.config.platformUrl}/collections`,
                newArrivalsUrl: `${this.config.platformUrl}/new`
            }
        });
    }

    /**
     * Send abandoned cart email
     */
    async sendAbandonedCartEmail(cart, sequenceNumber = 1) {
        const templates = {
            1: 'CART_ABANDONED_1H',
            2: 'CART_ABANDONED_24H',
            3: 'CART_ABANDONED_72H'
        };

        const subjects = {
            1: 'Forgot Something in Your Cart? Your Books Await!',
            2: 'Last Chance! Your QuantumMint Cart Expires Soon',
            3: 'We Saved Your Books - Complete Your Purchase'
        };

        const discountCodes = {
            2: { code: 'CART5', percent: 5 },
            3: { code: 'FREESHIP', type: 'free_shipping' }
        };

        return this.sendTransactional({
            to: cart.customerEmail,
            templateId: templates[sequenceNumber],
            sender: 'orders',
            subject: subjects[sequenceNumber],
            dynamicData: {
                cartItems: cart.items,
                cartTotal: cart.total,
                checkoutUrl: `${this.config.platformUrl}/checkout`,
                discountCode: discountCodes[sequenceNumber]?.code,
                discountPercent: discountCodes[sequenceNumber]?.percent
            }
        });
    }

    /**
     * Send back in stock notification
     */
    async sendBackInStockAlert(user, product) {
        return this.sendTransactional({
            to: user.email,
            templateId: 'BACK_IN_STOCK',
            sender: 'alerts',
            subject: `"${product.title}" is Back in Stock at QuantumMint!`,
            dynamicData: {
                productTitle: product.title,
                productAuthor: product.author,
                productPrice: product.price,
                productImage: product.coverImage,
                productUrl: `${this.config.platformUrl}/product/${product.sku}`,
                firstName: user.name.split(' ')[0]
            }
        });
    }

    /**
     * Send review request
     */
    async sendReviewRequest(order) {
        return this.sendTransactional({
            to: order.customerEmail,
            templateId: 'REVIEW_REQUEST_01',
            sender: 'support',
            subject: 'How Did You Enjoy Your Books?',
            dynamicData: {
                orderNumber: order.orderNumber,
                items: order.items,
                reviewUrl: `${this.config.platformUrl}/review/${order.orderNumber}`
            }
        });
    }

    /**
     * Send gift notification (Batch/Sponsored subscription)
     */
    async sendGiftNotification(recipient, sponsor, planId) {
        return this.sendTransactional({
            to: recipient.email,
            templateId: 'SUBSCRIPTION_GIFTED',
            sender: 'support',
            subject: `You've Been Gifted a QuantumMint Subscription!`,
            dynamicData: {
                recipientName: recipient.name.split(' ')[0],
                sponsorName: sponsor.name,
                planName: planId.toUpperCase(),
                loginUrl: `${this.config.platformUrl}/login`
            }
        });
    }

    /**
     * Send support ticket confirmation
     */
    async sendSupportTicketConfirmation(ticket) {
        return this.sendTransactional({
            to: ticket.customerEmail,
            templateId: 'SUPPORT_TICKET',
            sender: 'support',
            subject: `QuantumMint Support Request ${ticket.ticketId} Received`,
            dynamicData: {
                ticketId: ticket.ticketId,
                subject: ticket.subject,
                expectedResponse: '24-48 hours',
                ticketUrl: `${this.config.platformUrl}/support/ticket/${ticket.ticketId}`
            }
        });
    }

    /**
     * Schedule automated email sequence
     */
    async scheduleEmailSequence(trigger, data) {
        const triggerConfig = this.config.triggers[trigger];

        if (!triggerConfig) {
            logger.error(`Unknown trigger: ${trigger}`);
            return { success: false, error: 'Unknown trigger' };
        }

        // Handle sequences
        if (triggerConfig.sequence) {
            for (const step of triggerConfig.sequence) {
                const delayMs = this.parseDelay(step.delay);

                // Schedule email with delay
                setTimeout(async () => {
                    await this.sendTransactional({
                        ...data,
                        templateId: step.template,
                        sender: triggerConfig.sender
                    });
                }, delayMs);
            }

            return { success: true, sequenceScheduled: true };
        }

        // Handle immediate sends
        if (triggerConfig.immediate) {
            return this.sendTransactional({
                ...data,
                templateId: triggerConfig.template,
                sender: triggerConfig.sender,
                dynamicData: {
                    ...data.dynamicData,
                    ...triggerConfig.data
                }
            });
        }

        return { success: false, error: 'Invalid trigger configuration' };
    }

    /**
     * Parse delay string to milliseconds
     */
    parseDelay(delayString) {
        const match = delayString.match(/(\d+)\s*(hour|hours|day|days)/i);
        if (!match) return 0;

        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        if (unit.startsWith('hour')) {
            return value * 60 * 60 * 1000;
        } else if (unit.startsWith('day')) {
            return value * 24 * 60 * 60 * 1000;
        }

        return 0;
    }

    /**
     * Get SendGrid template ID from config template name
     */
    getTemplateId(templateName) {
        // This would map to actual SendGrid template IDs
        // For now, return the template name
        return process.env[`SENDGRID_TEMPLATE_${templateName}`] || templateName;
    }

    /**
     * Get default subject for template
     */
    getDefaultSubject(templateId) {
        const subjects = {
            'ORDER_CONFIRM_01': 'Your QuantumMint Bookstore Order Confirmation',
            'ORDER_SHIPPED': 'Your Order Has Shipped',
            'WELCOME_BOOKSTORE_01': 'Welcome to QuantumMint Bookstore',
            'BACK_IN_STOCK': 'Item Back in Stock'
        };
        return subjects[templateId] || 'QuantumMint Bookstore Notification';
    }

    /**
     * Check if email frequency limits are respected
     */
    async checkFrequencyLimits(userEmail, emailType = 'marketing') {
        // Frequency checking logic can be added here as the platform scales
        return true;
    }

    /**
     * Track email event (open, click, bounce)
     */
    async trackEvent(eventType, eventData) {
        logger.info(`Email event: ${eventType}`, eventData);
    }

    /**
     * Handle webhook from email provider
     */
    async handleWebhook(eventType, payload) {
        switch (eventType) {
            case 'open':
                await this.trackEvent('email_opened', payload);
                break;
            case 'click':
                await this.trackEvent('email_clicked', payload);
                break;
            case 'bounce':
                await this.trackEvent('email_bounced', payload);
                break;
            case 'unsubscribe':
                await this.trackEvent('email_unsubscribed', payload);
                break;
        }
    }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
