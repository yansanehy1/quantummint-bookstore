const { main: logger } = require('../utils/logger');

const SLL_TO_USD = 59;

function getSequelizeFromReq(req) {
    return req.app.get('sequelize');
}

exports.ensureWalletExists = async (sequelize, userId) => {
    // idempotent; create row if missing
    await sequelize.query(
        `INSERT INTO Wallets (id, userId, balanceSLL, balanceUSD) VALUES (UUID(), ?, 0, 0)
       ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
        { replacements: [userId] }
    );
};

exports.getBalance = async (req, userId) => {
    const sequelize = getSequelizeFromReq(req);
    await exports.ensureWalletExists(sequelize, userId);

    const [[wallet]] = await sequelize.query(
        'SELECT balanceSLL, balanceUSD FROM Wallets WHERE userId = ?',
        { replacements: [userId] }
    );

    const balances = {
        balanceSLL: parseFloat(wallet?.balanceSLL) || 0,
        balanceUSD: parseFloat(wallet?.balanceUSD) || 0,
    };
    balances.balanceSLLinUSD = parseFloat(((balances.balanceSLL || 0) / SLL_TO_USD).toFixed(4));

    const [methods] = await sequelize.query(
        'SELECT id, type, phoneNumber, stripeAccountId, stripeConnectedAt, isDefault FROM PaymentMethods WHERE userId = ? AND isActive = 1',
        { replacements: [userId] }
    );

    return { ...balances, savedMethods: methods };
};

exports.getTransactions = async (req, userId, opts = {}) => {
    const sequelize = getSequelizeFromReq(req);
    const { page = 1, limit = 20, type, method, status } = opts;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    let where = 'WHERE userId = ?';
    const replacements = [userId];

    if (type) { where += ' AND type = ?'; replacements.push(type); }
    if (method) { where += ' AND paymentMethod = ?'; replacements.push(method); }
    if (status) { where += ' AND status = ?'; replacements.push(status); }

    const [transactions] = await sequelize.query(
        `SELECT id, type, amount, currency, paymentMethod, platformFee, externalRef,
              phoneNumber, description, status, createdAt
         FROM Transactions ${where}
         ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        { replacements: [...replacements, limitNum, offset] }
    );

    const [[{ total }]] = await sequelize.query(
        `SELECT COUNT(*) as total FROM Transactions ${where}`,
        { replacements }
    );

    return {
        transactions,
        pagination: { page: pageNum, limit: limitNum, total: parseInt(total, 10), pages: Math.ceil(total / limitNum) }
    };
};

// internal helper to update wallet balance
exports.creditWallet = async (sequelize, userId, amount, currency) => {
    const allowedColumns = {
        USD: 'balanceUSD',
        SLL: 'balanceSLL'
    };
    const col = allowedColumns[currency];
    if (!col) {
        throw new Error('Invalid currency for wallet credit');
    }

    await sequelize.query(
        `INSERT INTO Wallets (id, userId, ${col}) VALUES (UUID(), ?, ?)
           ON DUPLICATE KEY UPDATE ${col} = ${col} + ?`,
        { replacements: [userId, amount, amount] }
    );
};
