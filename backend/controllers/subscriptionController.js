const { Subscription, Transaction, User, UserGroup } = require('../models');
const { uuidv4 } = require('../utils/id');
const { main: logger } = require('../utils/logger');
const SUBSCRIPTION_PLANS = require('../config/subscriptionPlans');
const exchangeRateService = require('../services/exchangeRateService');

exports.getCurrentSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            where: {
                userId: req.user.id,
                status: 'active'
            },
            order: [['endDate', 'DESC']]
        });

        if (!subscription) {
            return res.json(null);
        }

        // Check if expired
        if (new Date() > new Date(subscription.endDate)) {
            await subscription.update({ status: 'expired' });
            return res.json(null);
        }

        res.json(subscription);
    } catch (error) {
        logger.error('Get Subscription Error:', error);
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
};

exports.createSubscription = async (req, res) => {
    try {
        const { planId, currency } = req.body;
        const userId = req.user.id;

        const plan = SUBSCRIPTION_PLANS[planId];
        if (!plan) {
            return res.status(400).json({ error: 'Invalid subscription plan' });
        }

        const price = currency === 'USD' ? plan.priceUSD : plan.priceSLL;
        const user = await User.findByPk(userId);

        // Check balance
        const balanceField = currency === 'USD' ? 'usdBalance' : 'sllBalance';
        if (parseFloat(user[balanceField]) < price) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Calculate end date
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + plan.durationHours);

        // Transactional update
        const result = await User.sequelize.transaction(async (t) => {
            // Deduct balance
            await user.update({
                [balanceField]: (parseFloat(user[balanceField]) - price).toFixed(2)
            }, { transaction: t });

            // Deactivate existing active subscriptions
            await Subscription.update(
                { status: 'cancelled' },
                { 
                    where: { userId, status: 'active' },
                    transaction: t 
                }
            );

            // Create subscription
            const subscription = await Subscription.create({
                id: uuidv4(),
                userId,
                planId,
                status: 'active',
                endDate,
                amount: price,
                currency,
                startDate: new Date()
            }, { transaction: t });

            // Create transaction record
            await Transaction.create({
                id: uuidv4(),
                userId,
                type: 'purchase',
                amount: price,
                currency,
                paymentMethod: null,
                status: 'completed',
                description: `Subscription: ${planId} plan`
            }, { transaction: t });

            return subscription;
        });

        res.status(201).json({
            success: true,
            message: 'Subscription activated successfully',
            subscription: result
        });
    } catch (error) {
        logger.error('Create Subscription Error:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            where: {
                userId: req.user.id,
                status: 'active'
            }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        await subscription.update({ autoRenew: false, status: 'cancelled' });
        res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
        logger.error('Cancel Subscription Error:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Subscription.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        logger.error('Get Subscription History Error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

const subscriptionAccessService = require('../services/subscriptionAccessService');
const EmailService = require('../../services/shared/emailService');

const emailService = new EmailService();
emailService.initialize().catch(err => logger.error('Failed to initialize EmailService in SubscriptionController', err));

/**
 * GET /api/subscriptions/check-access?bookId=...
 * Check if the authenticated user has access to a specific book.
 */
exports.checkAccess = async (req, res) => {
    try {
        const { bookId } = req.query;
        if (!bookId) return res.status(400).json({ error: 'bookId is required' });

        const subscription = await subscriptionAccessService.checkSubscriptionAccess(req.user.id, bookId);
        
        res.json({
            hasAccess: !!subscription,
            subscriptionId: subscription ? subscription.id : null,
            groupId: subscription ? subscription.groupId : null,
            sponsorId: subscription ? subscription.sponsorId : null
        });
    } catch (error) {
        logger.error('Check Subscription Access Error:', error);
        res.status(500).json({ error: 'Failed to check subscription access' });
    }
};

/**
 * GET /api/subscriptions/plans
 */ Returns all subscription plans with live USD↔SLL conversions.
 * Public endpoint — no authentication required.
 */
exports.getPlans = async (req, res) => {
    try {
        const rate = await exchangeRateService.getRate();

        const plans = Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => ({
            id,
            durationHours: plan.durationHours,
            // Canonical SLL prices (always authoritative)
            priceSLL: plan.priceSLL,
            // USD price — use hardcoded value but also show live-rate equivalent
            priceUSD: plan.priceUSD,
            // Live conversion: priceSLL converted to USD at current market rate
            priceSLLinUSD: parseFloat((plan.priceSLL / rate).toFixed(4)),
        }));

        res.json({ plans, exchangeRate: rate });
    } catch (error) {
        logger.error('Get Plans Error:', error);
        res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
};

/**
 * POST /api/subscriptions/batch
 * A user (sponsor) pays for subscriptions for a list of other users.
 */
exports.createBatchSubscription = async (req, res) => {
    try {
        const { planId, currency, recipientEmails } = req.body;
        const sponsorId = req.user.id;

        if (!Array.isArray(recipientEmails) || recipientEmails.length === 0) {
            return res.status(400).json({ error: 'No recipient emails provided' });
        }

        const plan = SUBSCRIPTION_PLANS[planId];
        if (!plan) {
            return res.status(400).json({ error: 'Invalid subscription plan' });
        }

        const pricePerUser = currency === 'USD' ? plan.priceUSD : plan.priceSLL;
        const totalCost = pricePerUser * recipientEmails.length;

        const sponsor = await User.findByPk(sponsorId);
        const balanceField = currency === 'USD' ? 'usdBalance' : 'sllBalance';

        if (parseFloat(sponsor[balanceField]) < totalCost) {
            return res.status(400).json({ 
                error: 'Insufficient balance for batch subscription',
                required: totalCost,
                available: sponsor[balanceField]
            });
        }

        // Find existing users for these emails
        const recipients = await User.findAll({ where: { email: recipientEmails } });
        const foundEmails = recipients.map(r => r.email);
        const missingEmails = recipientEmails.filter(e => !foundEmails.includes(e));

        if (recipients.length === 0) {
            return res.status(400).json({ error: 'None of the provided emails are registered users' });
        }

        const endDate = new Date();
        endDate.setHours(endDate.getHours() + plan.durationHours);

        await User.sequelize.transaction(async (t) => {
            // Deduct from sponsor balance
            await sponsor.update({
                [balanceField]: (parseFloat(sponsor[balanceField]) - totalCost).toFixed(2)
            }, { transaction: t });

            // Create subscriptions
            const subscriptions = recipients.map(user => ({
                id: uuidv4(),
                userId: user.id,
                sponsorId,
                planId,
                status: 'active',
                startDate: new Date(),
                endDate,
                amount: pricePerUser,
                currency
            }));

            await Subscription.bulkCreate(subscriptions, { transaction: t });

            // Create transaction record for sponsor
            await Transaction.create({
                id: uuidv4(),
                userId: sponsorId,
                type: 'purchase',
                amount: totalCost,
                currency,
                paymentMethod: null,
                status: 'completed',
                description: `Batch Subscription: ${planId} plan for ${recipients.length} users`
            }, { transaction: t });
        });

        logger.info(`[SubscriptionController] Batch subscription by user ${sponsorId} for ${recipients.length} users`);

        // Send notifications (async, don't block response)
        recipients.forEach(user => {
            emailService.sendGiftNotification(user, sponsor, planId)
                .catch(err => logger.error(`Failed to send gift notification to ${user.email}`, err));
        });

        res.status(201).json({
            success: true,
            message: `Successfully subscribed ${recipients.length} users`,
            processedCount: recipients.length,
            missingEmails
        });

    } catch (error) {
        logger.error('Batch Subscription Error:', error);
        res.status(500).json({ error: 'Failed to process batch subscription' });
    }
};
