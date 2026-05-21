/**
 * Cron Jobs for QuantumMint Bookstore Email System
 * Scheduled tasks for email automation
 */

const cron = require('node-cron');
const emailService = require('../emailService');
const emailAutomation = require('../middleware/emailAutomation');
const logger = require('../logger');
const { models, sequelize } = require('../database');
const { Op } = require('sequelize');

class EmailCronJobs {
    constructor() {
        this.jobs = [];
    }

    /**
     * Initialize all cron jobs
     */
    startAll() {
        // 1. Daily at 8 AM: Send abandoned cart reminders
        this.jobs.push(cron.schedule('0 8 * * *', async () => {
            logger.info('Running abandoned cart reminder job');
            try {
                const abandonedCarts = await this.getAbandonedCarts();
                let sentCount = 0;

                for (const cart of abandonedCarts) {
                    const hoursSinceAbandoned = this.getHoursSince(cart.abandonedAt);

                    // Determine which reminder to send
                    if (hoursSinceAbandoned >= 1 && hoursSinceAbandoned < 24 && cart.remindersSent === 0) {
                        await emailAutomation.onCartAbandoned(cart);
                        sentCount++;
                    } else if (hoursSinceAbandoned >= 24 && hoursSinceAbandoned < 72 && cart.remindersSent === 1) {
                        await emailService.sendAbandonedCartEmail(cart, 2);
                        sentCount++;
                    } else if (hoursSinceAbandoned >= 72 && cart.remindersSent === 2) {
                        await emailService.sendAbandonedCartEmail(cart, 3);
                        sentCount++;
                    }
                }

                logger.info(`Abandoned cart job complete: ${sentCount} emails sent`);
            } catch (error) {
                logger.error('Abandoned cart job failed:', error);
            }
        }));

        // 2. Every 3 hours: Process email queue
        this.jobs.push(cron.schedule('0 */3 * * *', async () => {
            logger.info('Processing email queue');
            try {
                await this.processEmailQueue();
            } catch (error) {
                logger.error('Email queue processing failed:', error);
            }
        }));

        // 3. Monday at 10 AM: Send weekly newsletter
        this.jobs.push(cron.schedule('0 10 * * 1', async () => {
            logger.info('Sending weekly newsletter');
            try {
                await this.sendWeeklyNewsletter();
            } catch (error) {
                logger.error('Newsletter send failed:', error);
            }
        }));

        // 4. 1st of month at 9 AM: Send reading recommendations
        this.jobs.push(cron.schedule('0 9 1 * *', async () => {
            logger.info('Sending monthly recommendations');
            try {
                await this.sendMonthlyRecommendations();
            } catch (error) {
                logger.error('Monthly recommendations failed:', error);
            }
        }));

        // 5. Every 6 hours: Clean old email logs
        this.jobs.push(cron.schedule('0 */6 * * *', async () => {
            logger.info('Cleaning old email logs');
            try {
                await this.cleanupOldLogs();
            } catch (error) {
                logger.error('Log cleanup failed:', error);
            }
        }));

        // 6. Every hour: Check for back-in-stock items
        this.jobs.push(cron.schedule('0 * * * *', async () => {
            try {
                await this.checkBackInStockAlerts();
            } catch (error) {
                logger.error('Back-in-stock check failed:', error);
            }
        }));

        // 7. Daily at 8 PM: Send daily sales summary to admin
        this.jobs.push(cron.schedule('0 20 * * *', async () => {
            try {
                const salesData = await this.getDailySalesData();
                await emailAutomation.sendDailySalesSummary(salesData);
            } catch (error) {
                logger.error('Daily summary failed:', error);
            }
        }));

        // 8. Every 15 minutes: Process scheduled emails
        this.jobs.push(cron.schedule('*/15 * * * *', async () => {
            try {
                await this.processScheduledEmails();
            } catch (error) {
                logger.error('Scheduled email processing failed:', error);
            }
        }));

        logger.info(`Started ${this.jobs.length} email cron jobs`);
    }

    /**
     * Stop all cron jobs
     */
    stopAll() {
        this.jobs.forEach(job => job.stop());
        logger.info('All email cron jobs stopped');
    }

    /**
     * Get abandoned carts
     */
    async getAbandonedCarts() {
        // Query the abandoned_cart_emails table for reminders that need to be sent
        try {
            return await models.AbandonedCartEmail.findAll({
                where: {
                    recovered: false,
                    sent_at: {
                        [Op.lt]: new Date(Date.now() - 60 * 60 * 1000) // At least 1 hour ago
                    }
                }
            });
        } catch (error) {
            logger.error('Failed to get abandoned carts:', error);
            return [];
        }
    }

    /**
     * Process email queue
     */
    async processEmailQueue() {
        // Query email_queue table for pending emails
        try {
            const pendingEmails = await models.EmailQueue.findAll({
                where: {
                    status: 'pending',
                    scheduled_for: {
                        [Op.lte]: new Date()
                    }
                },
                order: [
                    ['priority', 'DESC'],
                    ['scheduled_for', 'ASC']
                ],
                limit: 100
            });

            for (const email of pendingEmails) {
                try {
                    await email.update({ status: 'processing' });

                    const result = await emailService.sendTransactional({
                        to: email.recipient_email,
                        templateId: email.template_name,
                        dynamicData: email.dynamic_data
                    });

                    if (result.success) {
                        await email.update({ 
                            status: 'sent', 
                            processed_at: new Date() 
                        });
                    } else {
                        throw new Error(result.error || 'Failed to send email');
                    }
                } catch (error) {
                    logger.error(`Failed to send queued email ${email.id}:`, error);
                    await email.update({ 
                        attempts: email.attempts + 1, 
                        last_error: error.message,
                        status: email.attempts >= 3 ? 'failed' : 'pending' // Retry up to 3 times
                    });
                }
            }
        } catch (error) {
            logger.error('Failed to process email queue:', error);
        }
    }

    /**
     * Send weekly newsletter
     */
    async sendWeeklyNewsletter() {
        try {
            const subscribers = await models.UserEmailPreference.findAll({
                where: {
                    receives_newsletters: true,
                    unsubscribed_at: null
                }
            });

            if (subscribers.length === 0) return;

            // In a real scenario, we'd fetch actual content here
            const newsletterData = {
                weekNumber: this.getWeekNumber(),
                newArrivals: [], // This would be fetched from the main books database
                staffPicks: [],
                upcomingEvents: []
            };

            for (const subscriber of subscribers) {
                try {
                    await emailService.sendTransactional({
                        to: subscriber.email,
                        templateId: 'MONTHLY_NEWSLETTER',
                        dynamicData: newsletterData
                    });
                } catch (error) {
                    logger.error(`Failed to send newsletter to ${subscriber.email}:`, error);
                }
            }
        } catch (error) {
            logger.error('Failed to send weekly newsletter:', error);
        }
    }

    /**
     * Send monthly recommendations
     */
    async sendMonthlyRecommendations() {
        // Implementation would involve complex logic to match user history with books
        logger.info('Monthly recommendations job triggered (Logic pending implementation)');
    }

    /**
     * Clean up old email logs
     */
    async cleanupOldLogs() {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 90);

            const deletedCount = await models.EmailLog.destroy({
                where: {
                    sent_at: {
                        [Op.lt]: cutoffDate
                    },
                    campaign_id: null // Only clean transactional logs, keep campaign logs longer
                }
            });

            logger.info(`Cleaned up ${deletedCount} email logs older than 90 days`);
        } catch (error) {
            logger.error('Failed to cleanup old logs:', error);
        }
    }

    /**
     * Check for back-in-stock alerts
     */
    async checkBackInStockAlerts() {
        try {
            // This would normally join with the main Books table
            // For now, we'll use a raw query or assume a view exists
            const [restockedItems] = await sequelize.query(`
                SELECT w.*, b.title as book_title, b.coverImage as book_image, b.author as book_author
                FROM wishlist_alerts w
                JOIN Books b ON w.book_id = b.id
                WHERE w.email_sent = false AND b.stock > 0
            `);

            for (const item of restockedItems) {
                try {
                    // Send alert via emailAutomation
                    // Note: This assumes onProductBackInStock handles individual users
                    await emailAutomation.onProductBackInStock(
                        { sku: item.book_id, title: item.book_title, coverImage: item.book_image, author: item.book_author },
                        [{ email: item.user_email, name: item.user_name }]
                    );

                    // Mark as sent
                    await sequelize.query('UPDATE wishlist_alerts SET email_sent = true, sent_at = NOW() WHERE id = ?', {
                        replacements: [item.id]
                    });
                } catch (error) {
                    logger.error(`Failed to send back-in-stock alert for item ${item.id}:`, error);
                }
            }
        } catch (error) {
            logger.error('Failed to check back-in-stock alerts:', error);
        }
    }

    /**
     * Get daily sales data
     */
    async getDailySalesData() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Raw query to main transactions/orders table
            const [sales] = await sequelize.query(`
                SELECT 
                    COUNT(*) as totalOrders,
                    SUM(amount) as totalRevenue,
                    COUNT(DISTINCT userId) as newCustomers
                FROM Transactions
                WHERE createdAt >= ? AND status = 'completed'
            `, { replacements: [today] });

            return sales[0] || { totalOrders: 0, totalRevenue: 0, newCustomers: 0 };
        } catch (error) {
            logger.error('Failed to get daily sales data:', error);
            return { totalOrders: 0, totalRevenue: 0, newCustomers: 0 };
        }
    }

    /**
     * Process scheduled emails
     */
    async processScheduledEmails() {
        // Process emails in email_queue that are scheduled for now or past
        await this.processEmailQueue();
    }

    /**
     * Get hours since a date
     */
    getHoursSince(date) {
        return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    }

    /**
     * Get current week number
     */
    getWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.floor(diff / oneWeek);
    }
}

// Create singleton instance
const emailCronJobs = new EmailCronJobs();

module.exports = emailCronJobs;
