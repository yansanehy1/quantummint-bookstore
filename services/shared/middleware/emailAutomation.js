/**
 * Email Automation Middleware
 * Automatically triggers emails based on platform events
 */

const emailService = require('../../shared/emailService');
const logger = require('../../shared/logger');

class EmailAutomation {
    constructor() {
        this.scheduledJobs = new Map();
    }

    /**
     * Handle user registration
     */
    async onUserRegistered(user) {
        try {
            // Send welcome email immediately
            await emailService.sendWelcomeEmail(user);

            // Schedule welcome series
            this.scheduleWelcomeSeries(user);

            logger.info('User registration emails triggered', { userId: user.id });
        } catch (error) {
            logger.error('Failed to send registration emails:', error);
        }
    }

    /**
     * Schedule welcome email series
     */
    scheduleWelcomeSeries(user) {
        const series = emailService.config.welcomeSeries;

        series.forEach((email, index) => {
            if (index === 0) return; // First email already sent

            const delayMs = email.day * 24 * 60 * 60 * 1000;

            setTimeout(async () => {
                try {
                    await emailService.sendTransactional({
                        to: user.email,
                        templateId: email.template,
                        subject: email.subject,
                        sender: 'support',
                        dynamicData: {
                            firstName: user.firstName,
                            includeDiscountCode: email.includeDiscountCode
                        }
                    });
                } catch (error) {
                    logger.error(`Failed to send welcome series email ${index}:`, error);
                }
            }, delayMs);
        });
    }

    /**
     * Handle order placed
     */
    async onOrderPlaced(order) {
        try {
            // Send order confirmation
            await emailService.sendOrderConfirmation(order);

            // Schedule review request for 7 days after expected delivery
            if (order.estimatedDelivery) {
                const reviewDate = new Date(order.estimatedDelivery);
                reviewDate.setDate(reviewDate.getDate() + 7);
                const delayMs = reviewDate.getTime() - Date.now();

                setTimeout(async () => {
                    await emailService.sendReviewRequest(order);
                }, delayMs);
            }

            logger.info('Order confirmation sent', { orderNumber: order.orderNumber });
        } catch (error) {
            logger.error('Failed to send order confirmation:', error);
        }
    }

    /**
     * Handle order shipped
     */
    async onOrderShipped(order, trackingInfo) {
        try {
            await emailService.sendShippingNotification(order, trackingInfo);
            logger.info('Shipping notification sent', { orderNumber: order.orderNumber });
        } catch (error) {
            logger.error('Failed to send shipping notification:', error);
        }
    }

    /**
     * Handle cart abandoned
     */
    async onCartAbandoned(cart) {
        try {
            // Schedule abandoned cart sequence
            await emailService.scheduleEmailSequence('cart_abandoned', {
                to: cart.customerEmail,
                dynamicData: {
                    cartItems: cart.items,
                    cartTotal: cart.total,
                    checkoutUrl: `${emailService.config.platformUrl}/checkout`
                }
            });

            logger.info('Abandoned cart sequence scheduled', { cartId: cart.id });
        } catch (error) {
            logger.error('Failed to schedule abandoned cart emails:', error);
        }
    }

    /**
     * Handle product back in stock
     */
    async onProductBackInStock(product, subscribers) {
        try {
            // Send to all subscribers who wishlisted this product
            for (const user of subscribers) {
                await emailService.sendBackInStockAlert(user, product);
            }

            logger.info('Back in stock alerts sent', {
                productSku: product.sku,
                subscriberCount: subscribers.length
            });
        } catch (error) {
            logger.error('Failed to send back in stock alerts:', error);
        }
    }

    /**
     * Handle price drop
     */
    async onPriceDrop(product, oldPrice, newPrice, subscribers) {
        try {
            for (const user of subscribers) {
                await emailService.sendTransactional({
                    to: user.email,
                    templateId: 'PRICE_DROP',
                    sender: 'alerts',
                    subject: `Price Drop on "${product.title}"!`,
                    dynamicData: {
                        productTitle: product.title,
                        oldPrice,
                        newPrice,
                        savings: oldPrice - newPrice,
                        productUrl: `${emailService.config.platformUrl}/product/${product.sku}`,
                        firstName: user.firstName
                    }
                });
            }

            logger.info('Price drop alerts sent', {
                productSku: product.sku,
                subscriberCount: subscribers.length
            });
        } catch (error) {
            logger.error('Failed to send price drop alerts:', error);
        }
    }

    /**
     * Handle support ticket creation
     */
    async onSupportTicketCreated(ticket) {
        try {
            await emailService.sendSupportTicketConfirmation(ticket);
            logger.info('Support ticket confirmation sent', { ticketId: ticket.ticketId });
        } catch (error) {
            logger.error('Failed to send support ticket confirmation:', error);
        }
    }

    /**
     * Handle low stock alert (admin notification)
     */
    async onLowStock(product) {
        try {
            const adminConfig = emailService.config.adminAlerts.lowStock;

            await emailService.sendTransactional({
                to: adminConfig.recipients[0],
                sender: 'admin',
                subject: `Low Stock Alert - ${product.title}`,
                templateId: 'LOW_STOCK_ALERT',
                dynamicData: {
                    productTitle: product.title,
                    productSku: product.sku,
                    currentStock: product.stock,
                    threshold: adminConfig.threshold,
                    productUrl: `${emailService.config.platformUrl}/admin/products/${product.sku}`
                }
            });

            logger.info('Low stock alert sent to admin', { productSku: product.sku });
        } catch (error) {
            logger.error('Failed to send low stock alert:', error);
        }
    }

    /**
     * Send daily sales summary
     */
    async sendDailySalesSummary(salesData) {
        try {
            const adminConfig = emailService.config.adminAlerts.dailySummary;

            await emailService.sendTransactional({
                to: adminConfig.recipients[0],
                sender: 'admin',
                subject: `Daily Sales Summary - ${new Date().toLocaleDateString()}`,
                templateId: 'DAILY_SALES_SUMMARY',
                dynamicData: {
                    date: new Date().toLocaleDateString(),
                    totalOrders: salesData.totalOrders,
                    totalRevenue: salesData.totalRevenue,
                    topProducts: salesData.topProducts,
                    newCustomers: salesData.newCustomers
                }
            });

            logger.info('Daily sales summary sent');
        } catch (error) {
            logger.error('Failed to send daily sales summary:', error);
        }
    }

    /**
     * Schedule daily sales summary (8 AM)
     */
    scheduleDailySummary(getSalesDataFn) {
        const schedule = () => {
            const now = new Date();
            const targetTime = new Date();
            targetTime.setHours(8, 0, 0, 0);

            if (now > targetTime) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            const delayMs = targetTime.getTime() - now.getTime();

            setTimeout(async () => {
                const salesData = await getSalesDataFn();
                await this.sendDailySalesSummary(salesData);
                schedule(); // Reschedule for next day
            }, delayMs);
        };

        schedule();
    }
}

// Create singleton
const emailAutomation = new EmailAutomation();

module.exports = emailAutomation;
