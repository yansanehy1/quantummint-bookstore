const { v4: uuidv4 } = require('uuid');
const { main: logger } = require('../utils/logger');
const walletService = require('./walletService');

const PAYMENT_CONFIGS = {
    orange_money: { currency: 'SLL', minDeposit: 10, maxDeposit: 500000, minWithdrawal: 10, maxWithdrawal: 1000000, depositFee: 0, withdrawalFee: 0 },
    afrimoney: { currency: 'SLL', minDeposit: 10, maxDeposit: 750000, minWithdrawal: 10, maxWithdrawal: 1500000, depositFee: 0, withdrawalFee: 0 },
    qmoney: { currency: 'SLL', minDeposit: 10, maxDeposit: 1000000, minWithdrawal: 10, maxWithdrawal: 2000000, depositFee: 0, withdrawalFee: 0 },
    stripe: { currency: 'USD', minDeposit: 1, maxDeposit: 10000, minWithdrawal: 5, maxWithdrawal: null, depositFee: 2.9, depositFeeFixed: 0.30, withdrawalFee: 5 },
};

function validateAmount(method, amount, direction) {
    const cfg = PAYMENT_CONFIGS[method];
    if (!cfg) throw new Error('Invalid payment method');
    const min = direction === 'deposit' ? cfg.minDeposit : cfg.minWithdrawal;
    const max = direction === 'deposit' ? cfg.maxDeposit : cfg.maxWithdrawal;
    if (amount < min) throw new Error(`Minimum ${direction} is ${cfg.currency === 'SLL' ? 'Le' : '$'} ${min.toLocaleString()}`);
    if (max && amount > max) throw new Error(`Maximum ${direction} is ${cfg.currency === 'SLL' ? 'Le' : '$'} ${max.toLocaleString()}`);
}

function calcDepositFee(method, amount) {
    const cfg = PAYMENT_CONFIGS[method];
    if (method === 'stripe') {
        const fee = parseFloat(((amount * cfg.depositFee) / 100 + cfg.depositFeeFixed).toFixed(4));
        return { fee, totalCharged: parseFloat((amount + fee).toFixed(4)) };
    }
    return { fee: 0, totalCharged: amount };
}

function calcWithdrawalFee(method, amount) {
    const cfg = PAYMENT_CONFIGS[method];
    if (method === 'stripe') {
        const fee = parseFloat(((amount * cfg.withdrawalFee) / 100).toFixed(4));
        return { fee, netAmount: parseFloat((amount - fee).toFixed(4)) };
    }
    return { fee: 0, netAmount: amount };
}

function getSequelizeFromReq(req) {
    return req.app.get('sequelize');
}

// create transaction row in database
async function createTransaction(sequelize, data) {
    const { userId, type, amount, currency, paymentMethod, platformFee, externalRef, phoneNumber, description } = data;
    await sequelize.query(
        `INSERT INTO Transactions (id, userId, type, amount, currency, paymentMethod, platformFee, externalRef, phoneNumber, description, status)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 'processing')`,
        { replacements: [userId, type, amount, currency, paymentMethod, platformFee, externalRef, phoneNumber || null, description] }
    );
}

exports.initiateDeposit = async (req, userId, method, amount, phoneNumber) => {
    if (!PAYMENT_CONFIGS[method]) throw new Error('Invalid payment method');
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) throw new Error('Invalid amount');
    validateAmount(method, amountNum, 'deposit');

    if (method !== 'stripe' && !phoneNumber) {
        throw new Error('Phone number is required for mobile money deposits');
    }

    const { fee } = calcDepositFee(method, amountNum);
    const externalRef = `QM-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const txCurrency = PAYMENT_CONFIGS[method].currency;
    const sequelize = getSequelizeFromReq(req);

    await createTransaction(sequelize, {
        userId,
        type: 'deposit',
        amount: amountNum,
        currency: txCurrency,
        paymentMethod: method,
        platformFee: fee,
        externalRef,
        phoneNumber,
        description: `${txCurrency === 'SLL' ? 'Le' : '$'} ${amountNum.toLocaleString()} via ${method.replace(/_/g, ' ')}`
    });

    if (method !== 'stripe') {
        return { success: true, externalRef, message: `Payment request sent to ${phoneNumber}. Please approve the USSD prompt on your phone.`, amount: amountNum, currency: txCurrency, fee, status: 'processing' };
    }

    return { success: true, externalRef, message: 'Stripe payment initiated. Complete the card form.', amount: amountNum, currency: 'USD', fee, status: 'processing' };
};

exports.initiateWithdrawal = async (req, userId, method, amount, phoneNumber) => {
    if (!PAYMENT_CONFIGS[method]) throw new Error('Invalid payment method');
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) throw new Error('Invalid amount');
    validateAmount(method, amountNum, 'withdrawal');

    const txCurrency = PAYMENT_CONFIGS[method].currency;
    const sequelize = getSequelizeFromReq(req);

    const [wallets] = await sequelize.query('SELECT * FROM Wallets WHERE userId = ?', { replacements: [userId] });
    const wallet = wallets[0];
    if (!wallet) throw new Error('Wallet not found');

    if (txCurrency === 'SLL' && wallet.balanceSLL < amountNum) {
        throw new Error(`Insufficient SLL balance. Available: Le ${parseFloat(wallet.balanceSLL).toLocaleString()}`);
    }
    if (txCurrency === 'USD' && wallet.balanceUSD < amountNum) {
        throw new Error(`Insufficient USD balance. Available: $${parseFloat(wallet.balanceUSD).toFixed(2)}`);
    }

    if (method === 'stripe') {
        const [methods] = await sequelize.query('SELECT * FROM PaymentMethods WHERE userId = ? AND type = ? AND isActive = 1', { replacements: [userId, 'stripe'] });
        if (!methods[0]?.stripeAccountId) {
            throw new Error('No connected Stripe account. Please connect Stripe first.');
        }
    }

    const { fee, netAmount } = calcWithdrawalFee(method, amountNum);
    const externalRef = `QM-WD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    if (txCurrency === 'SLL') {
        await sequelize.query('UPDATE Wallets SET balanceSLL = balanceSLL - ? WHERE userId = ?', { replacements: [amountNum, userId] });
    } else {
        await sequelize.query('UPDATE Wallets SET balanceUSD = balanceUSD - ? WHERE userId = ?', { replacements: [amountNum, userId] });
    }

    await createTransaction(sequelize, {
        userId,
        type: 'withdrawal',
        amount: amountNum,
        currency: txCurrency,
        paymentMethod: method,
        platformFee: fee,
        externalRef,
        phoneNumber,
        description: `Withdrawal of ${txCurrency === 'SLL' ? 'Le' : '$'} ${amountNum.toLocaleString()} via ${method.replace(/_/g, ' ')}`
    });

    return {
        success: true,
        externalRef,
        message: method === 'stripe'
            ? `$${netAmount.toFixed(2)} will be transferred to your Stripe account (5% platform fee applied).`
            : `Le ${netAmount.toLocaleString()} is being sent to ${phoneNumber}. This is instant.`,
        grossAmount: amountNum,
        platformFee: fee,
        netAmount,
        currency: txCurrency,
        status: 'processing',
    };
};

exports.handleMobileMoneyWebhook = async (req, payload) => {
    const { reference, status } = payload || {};
    if (!reference || !status) throw new Error('Invalid webhook payload');

    const sequelize = getSequelizeFromReq(req);
    const txStatus = status === 'SUCCESS' || status === 'SUCCESSFUL' ? 'completed' : 'failed';

    await sequelize.query('UPDATE Transactions SET status = ? WHERE externalRef = ?', { replacements: [txStatus, reference] });

    if (txStatus === 'completed') {
        const [txRows] = await sequelize.query('SELECT * FROM Transactions WHERE externalRef = ?', { replacements: [reference] });
        const tx = txRows[0];
        if (tx && tx.type === 'deposit') {
            await walletService.creditWallet(sequelize, tx.userId, tx.amount, tx.currency);
        }
    }
    return { received: true };
};

exports.handleStripeWebhook = async (req, payload) => {
    const event = payload || {};
    const sequelize = getSequelizeFromReq(req);

    if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object;
        await sequelize.query('UPDATE Transactions SET status = ? WHERE externalRef = ?', { replacements: ['completed', pi.metadata?.externalRef] });
        const [txRows] = await sequelize.query('SELECT * FROM Transactions WHERE externalRef = ?', { replacements: [pi.metadata?.externalRef] });
        const tx = txRows[0];
        if (tx) {
            await walletService.creditWallet(sequelize, tx.userId, tx.amount, tx.currency);
        }
    } else if (event.type === 'payment_intent.payment_failed') {
        const pi = event.data.object;
        await sequelize.query('UPDATE Transactions SET status = ? WHERE externalRef = ?', { replacements: ['failed', pi.metadata?.externalRef] });
    }
    return { received: true };
};

// Stripe Connect helpers
exports.getStripeConnectUrl = (userId) => {
    const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID || 'ca_placeholder';
    const REDIRECT_URI = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/stripe/callback`;
    return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${userId}`;
};

exports.handleStripeConnectCallback = async (req, userId, code) => {
    if (!code || !userId) throw new Error('Missing OAuth parameters');
    // simulate stripe token exchange for dev
    const stripeAccountId = `acct_${code.slice(0, 16)}`;
    const sequelize = getSequelizeFromReq(req);
    await sequelize.query(
        `INSERT INTO PaymentMethods (id, userId, type, stripeAccountId, stripeConnectedAt, isDefault, isActive)
       VALUES (UUID(), ?, 'stripe', ?, NOW(), 0, 1)
       ON DUPLICATE KEY UPDATE stripeAccountId = VALUES(stripeAccountId), stripeConnectedAt = NOW(), isActive = 1`,
        { replacements: [userId, stripeAccountId] }
    );
};

exports.disconnectStripeAccount = async (req, userId) => {
    const sequelize = getSequelizeFromReq(req);
    await sequelize.query('UPDATE PaymentMethods SET isActive = 0 WHERE userId = ? AND type = ?', { replacements: [userId, 'stripe'] });
};
