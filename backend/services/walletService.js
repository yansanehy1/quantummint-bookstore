const { User, Transaction } = require('../models');
const { main: logger } = require('../utils/logger');
const exchangeRateService = require('./exchangeRateService');

// Kept as compile-time fallback only; live rate comes from exchangeRateService
const SLL_TO_USD_FALLBACK = parseFloat(process.env.FALLBACK_SLL_TO_USD) || 59;

exports.getBalance = async (req, userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const balanceSLL = parseFloat(user.sllBalance) || 0;
    const balanceUSD = parseFloat(user.usdBalance) || 0;

    // Use live exchange rate with fallback
    let rate = SLL_TO_USD_FALLBACK;
    try {
        rate = await exchangeRateService.getRate();
    } catch (e) {
        logger.warn('getBalance: falling back to static SLL rate', e.message);
    }

    const balances = {
        balanceSLL,
        balanceUSD,
        balanceSLLinUSD: parseFloat((balanceSLL / rate).toFixed(4)),
        exchangeRate: rate,
    };

    // For now, keep the raw query for PaymentMethods if it doesn't have a model yet
    const sequelize = req.app.get('sequelize');
    const [methods] = await sequelize.query(
        'SELECT id, type, phoneNumber, stripeAccountId, stripeConnectedAt, isDefault FROM PaymentMethods WHERE userId = ? AND isActive = 1',
        { replacements: [userId] }
    );

    return { ...balances, savedMethods: methods };
};

exports.getTransactions = async (req, userId, opts = {}) => {
    const { page = 1, limit = 20, type, method, status } = opts;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    const where = { userId };
    if (type) where.type = type;
    if (method) where.paymentMethod = method;
    if (status) where.status = status;

    const { count, rows: transactions } = await Transaction.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset
    });

    return {
        transactions,
        pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) }
    };
};

// Internal helper: atomically credit a wallet using a SQL increment
// to eliminate the read-then-write race condition.
exports.creditWallet = async (sequelize, userId, amount, currency) => {
    const field = currency === 'USD' ? 'usdBalance' : 'sllBalance';
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) throw new Error('Invalid credit amount');

    const [, meta] = await sequelize.query(
        `UPDATE Users SET \`${field}\` = \`${field}\` + ? WHERE id = ?`,
        { replacements: [amountNum, userId] }
    );

    // Both MySQL and SQLite expose the row count on the result metadata
    const affectedRows = (meta && (meta.affectedRows ?? meta.rowCount)) ?? 0;
    if (affectedRows === 0) throw new Error('User not found or balance update failed');
};
