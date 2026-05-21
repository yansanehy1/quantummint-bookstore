/**
 * Shared Subscription Plan Definitions
 *
 * Single source of truth used by:
 *   - backend/controllers/subscriptionController.js
 *   - backend/workers/subscriptionWorker.js
 *
 * priceSLL — price in Sierra Leonean Leone (local currency)
 * priceUSD — price in US Dollars
 * durationHours — subscription duration in hours
 */

const SUBSCRIPTION_PLANS = {
    '12hours': { durationHours: 12,  priceUSD: 1.99,  priceSLL: 35000  },
    '24hours': { durationHours: 24,  priceUSD: 2.99,  priceSLL: 55000  },
    '7days':   { durationHours: 168, priceUSD: 9.99,  priceSLL: 180000 },
    '30days':  { durationHours: 720, priceUSD: 29.99, priceSLL: 550000 },
};

module.exports = SUBSCRIPTION_PLANS;
