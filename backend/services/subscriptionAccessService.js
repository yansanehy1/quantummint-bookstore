const { Subscription } = require('../models');
const { Op } = require('sequelize');

/**
 * Checks if a user has an active subscription that covers a specific book.
 * @param {string} userId - The ID of the user.
 * @param {string} bookId - The ID of the book being accessed.
 * @returns {Promise<object|null>} - Returns the active subscription object if access is granted, otherwise null.
 */
async function checkSubscriptionAccess(userId, bookId) {
    try {
        const now = new Date();
        
        // Find all active subscriptions for the user
        const subscriptions = await Subscription.findAll({
            where: {
                userId,
                status: 'active',
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now }
            }
        });

        if (subscriptions.length === 0) return null;

        // Check each subscription for platform-wide or book-specific access
        for (const sub of subscriptions) {
            // Platform-wide access (no restrictions)
            if (!sub.allowedBookIds || (Array.isArray(sub.allowedBookIds) && sub.allowedBookIds.length === 0)) {
                return sub;
            }

            // Book-specific access
            if (Array.isArray(sub.allowedBookIds) && sub.allowedBookIds.includes(bookId)) {
                return sub;
            }
        }

        return null;
    } catch (error) {
        console.error('Check Subscription Access Error:', error);
        return null;
    }
}

module.exports = {
    checkSubscriptionAccess
};
