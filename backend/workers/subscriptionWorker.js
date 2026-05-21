const cron = require('node-cron');
const { Subscription, Transaction, User, UserGroup, sequelize: _seq } = require('../models');
const { Op } = require('sequelize');
const { uuidv4 } = require('../utils/id');
const { main: logger } = require('../utils/logger');
const SUBSCRIPTION_PLANS = require('../config/subscriptionPlans');
const {
    notifySubscriptionLowBalance,
    notifySubscriptionExpired,
} = require('../services/notificationService');

/**
 * Auto-renew a single subscription.
 * Deducts the renewal fee from the payer's wallet (user, sponsor, or group) 
 * and creates a new Subscription row plus a Transaction row.
 */
async function _attemptRenewal(subscription, sequelize) {
    const plan = SUBSCRIPTION_PLANS[subscription.planId];
    if (!plan) {
        logger.warn(`[SubscriptionWorker] Unknown planId "${subscription.planId}" for subscription ${subscription.id} — expiring.`);
        await subscription.update({ status: 'expired', autoRenew: false });
        return 'expired';
    }

    const price        = subscription.currency === 'USD' ? plan.priceUSD : plan.priceSLL;
    const balanceField = subscription.currency === 'USD' ? 'usdBalance' : 'sllBalance';

    // Determine who is paying for the renewal
    let payerType = 'user'; // 'user', 'sponsor', or 'group'
    let payerId = subscription.userId;
    let payer = null;
    let group = null;

    if (subscription.groupId) {
        group = await UserGroup.findByPk(subscription.groupId);
        if (group && group.status === 'active') {
            payerType = 'group';
            payerId = group.id;
        }
    } else if (subscription.sponsorId) {
        payerType = 'sponsor';
        payerId = subscription.sponsorId;
    }

    // Check balance for the payer
    if (payerType === 'group') {
        if (parseFloat(group.prepaidBalance) < price) {
            logger.info(`[SubscriptionWorker] Insufficient prepaid balance for group ${group.id} (plan: ${subscription.planId}) — expiring subscription ${subscription.id}.`);
            await subscription.update({ status: 'expired' });
            return 'expired';
        }
    } else {
        payer = await User.findByPk(payerId);
        if (!payer) {
            logger.warn(`[SubscriptionWorker] Payer ${payerId} not found — expiring subscription ${subscription.id}.`);
            await subscription.update({ status: 'expired', autoRenew: false });
            return 'expired';
        }

        if (parseFloat(payer[balanceField]) < price) {
            logger.info(`[SubscriptionWorker] Insufficient balance for payer ${payer.id} (plan: ${subscription.planId}) — expiring subscription ${subscription.id}.`);
            await subscription.update({ status: 'expired' });
            
            if (payerType === 'user') {
                notifySubscriptionLowBalance({
                    user: payer,
                    planId: subscription.planId,
                    requiredAmount: price,
                    currency: subscription.currency,
                }).catch((err) => logger.error('[SubscriptionWorker] Low-balance notification failed:', err));
            }
            return 'expired';
        }
    }

    // All checks passed — renew inside a DB transaction
    try {
        await sequelize.transaction(async (t) => {
            // 1. Deduct balance
            if (payerType === 'group') {
                await sequelize.query(
                    `UPDATE UserGroups SET \`prepaidBalance\` = \`prepaidBalance\` - ? WHERE id = ?`,
                    { replacements: [price, group.id], transaction: t }
                );
            } else {
                await sequelize.query(
                    `UPDATE Users SET \`${balanceField}\` = \`${balanceField}\` - ? WHERE id = ?`,
                    { replacements: [price, payer.id], transaction: t }
                );
            }

            // 2. Mark current subscription as expired (replaced by new one)
            await subscription.update({ status: 'expired', autoRenew: false }, { transaction: t });

            // 3. Create renewed subscription
            const newEndDate = new Date();
            newEndDate.setHours(newEndDate.getHours() + plan.durationHours);

            await Subscription.create({
                id: uuidv4(),
                userId: subscription.userId,
                sponsorId: subscription.sponsorId,
                groupId: subscription.groupId,
                planId: subscription.planId,
                status: 'active',
                startDate: new Date(),
                endDate: newEndDate,
                amount: price,
                currency: subscription.currency,
                autoRenew: true   // keep auto-renew on the new subscription
            }, { transaction: t });

            // 4. Record transaction for the payer
            await Transaction.create({
                id: uuidv4(),
                userId: payerType === 'group' ? group.sponsorId : payerId,
                type: 'purchase',
                amount: price,
                currency: subscription.currency,
                paymentMethod: null,
                status: 'completed',
                description: `Auto-renewal: ${subscription.planId} plan ${payerType === 'group' ? `for group ${group.name}` : (payerType === 'sponsor' ? `sponsored for user ${subscription.userId}` : '')}`
            }, { transaction: t });
        });

        logger.info(`[SubscriptionWorker] Auto-renewed subscription ${subscription.id} (plan: ${subscription.planId}) paid by ${payerType} ${payerId}.`);
        return 'renewed';
    } catch (err) {
        logger.error(`[SubscriptionWorker] Auto-renewal DB transaction failed for subscription ${subscription.id}:`, err);
        throw err;
    }
}

/**
 * Worker to handle subscription expiry and auto-renewal.
 * Schedules two jobs:
 *   1. Expiry sweep  — marks stale active subscriptions as expired.
 *   2. Renewal sweep — attempts auto-renewal for subscriptions expiring within 1 hour.
 */
const startSubscriptionWorker = (sequelize) => {
    // ── Job 1: Mark expired subscriptions (runs every hour) ─────────────────
    cron.schedule('0 * * * *', async () => {
        logger.info('[SubscriptionWorker] Running expiry sweep...');
        try {
            const now = new Date();
            // Mark ANY active subscription as expired if it's past its end date
            // and autoRenew is false. (If autoRenew is true, it should have been 
            // handled by the renewal sweep, but we check here as a fallback for 
            // missed renewals too).
            const expiring = await Subscription.findAll({
                where: {
                    status: 'active',
                    endDate: { [Op.lt]: now },
                    // If it's autoRenew: true, we give it a 1-hour grace period 
                    // before forcefully expiring it here, to let the renewal job work.
                    [Op.or]: [
                        { autoRenew: false },
                        { 
                            autoRenew: true, 
                            endDate: { [Op.lt]: new Date(now.getTime() - 60 * 60 * 1000) } 
                        }
                    ]
                },
            });

            if (expiring.length === 0) return;

            await Subscription.update(
                { status: 'expired' },
                {
                    where: {
                        id: { [Op.in]: expiring.map((s) => s.id) },
                    },
                }
            );

            logger.info(`[SubscriptionWorker] Expiry sweep: marked ${expiring.length} subscription(s) as expired.`);

            for (const sub of expiring) {
                const user = await User.findByPk(sub.userId);
                if (user) {
                    notifySubscriptionExpired({ user, planId: sub.planId })
                        .catch((err) => logger.error('[SubscriptionWorker] Expiry notification failed:', err));
                }
            }
        } catch (error) {
            logger.error('[SubscriptionWorker] Expiry sweep error:', error);
        }
    });

    // ── Job 2: Auto-renewal sweep (runs every hour, 5 minutes after expiry sweep) ──
    cron.schedule('5 * * * *', async () => {
        logger.info('[SubscriptionWorker] Running auto-renewal sweep...');
        try {
            const now    = new Date();
            const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

            // Find active subscriptions with autoRenew=true that expire within the next hour
            const candidates = await Subscription.findAll({
                where: {
                    status: 'active',
                    autoRenew: true,
                    endDate: { [Op.lte]: inOneHour }
                }
            });

            if (candidates.length === 0) {
                logger.info('[SubscriptionWorker] Auto-renewal sweep: no subscriptions due for renewal.');
                return;
            }

            logger.info(`[SubscriptionWorker] Auto-renewal sweep: processing ${candidates.length} candidate(s).`);

            let renewed = 0;
            let expired = 0;
            const expiredSubs = [];

            for (const sub of candidates) {
                try {
                    const result = await _attemptRenewal(sub, sequelize);
                    if (result === 'renewed') renewed++;
                    else {
                        expired++;
                        expiredSubs.push(sub);
                    }
                } catch (err) {
                    logger.error(`[SubscriptionWorker] Failed to process subscription ${sub.id}:`, err);
                    // Force expire if it failed multiple times or is significantly past due
                    if (new Date() > new Date(sub.endDate.getTime() + 2 * 60 * 60 * 1000)) {
                        await sub.update({ status: 'expired', autoRenew: false });
                    }
                    expired++;
                    expiredSubs.push(sub);
                }
            }

            logger.info(`[SubscriptionWorker] Auto-renewal sweep complete — renewed: ${renewed}, expired: ${expired}.`);

            for (const sub of expiredSubs) {
                const user = await User.findByPk(sub.userId);
                if (user) {
                    notifySubscriptionExpired({ user, planId: sub.planId })
                        .catch((err) => logger.error('[SubscriptionWorker] Expiry notification failed:', err));
                }
            }

        } catch (error) {
            logger.error('[SubscriptionWorker] Auto-renewal sweep error:', error);
        }
    });

    logger.info('[SubscriptionWorker] Subscription worker started (expiry + auto-renewal).');
};

module.exports = { startSubscriptionWorker, _attemptRenewal };
