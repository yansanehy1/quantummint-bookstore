jest.mock('uuid', () => ({ v4: jest.fn(() => 'uuid-fixed') }));

const purchaseService = require('../services/purchaseService');
const paymentService = require('../services/paymentService');
const walletService = require('../services/walletService');

describe('purchaseService', () => {
    it('throws when purchase amount does not match book price', async () => {
        const sequelize = {
            query: jest.fn()
                .mockResolvedValueOnce([[{ priceSLL: '100', priceUSD: '2.00' }]])
                .mockResolvedValueOnce([[{ balanceSLL: '1000', balanceUSD: '10.00' }]]),
            transaction: async (work) => await work({})
        };
        const req = { app: { get: () => sequelize } };

        await expect(purchaseService.purchaseBook(req, 'user1', 'bookid', 3, 'USD')).rejects.toThrow('Amount does not match book price');
    });

    it('processes purchase with exact price in transaction', async () => {
        const queries = [];
        const sequelize = {
            query: jest.fn(async (sql, opts) => {
                queries.push({ sql, opts });
                if (sql.startsWith('SELECT priceSLL')) {
                    return [[{ priceSLL: '100', priceUSD: '2.00' }]];
                }
                if (sql.startsWith('SELECT balanceSLL')) {
                    return [[{ balanceSLL: '1000', balanceUSD: '10.00' }]];
                }
                return [];
            }),
            transaction: async (work) => await work({})
        };

        const req = { app: { get: () => sequelize } };

        const result = await purchaseService.purchaseBook(req, 'user1', 'bookid', 2.00, 'USD');
        expect(result).toHaveProperty('purchaseId');
        expect(result).toHaveProperty('transactionId');
        expect(sequelize.query).toHaveBeenCalled();
        expect(queries.some(q => q.sql.includes('UPDATE Wallets'))).toBe(true);
    });
});

describe('paymentService.handleStripeWebhook', () => {
    it('completes deposit transaction and credits wallet when payment_intent.succeeded', async () => {
        const sequelize = {
            query: jest.fn()
                .mockResolvedValueOnce([]) // update status
                .mockResolvedValueOnce([[{ id: 'tx1', userId: 'user1', amount: 5.00, currency: 'USD', type: 'deposit' }]]),
        };

        jest.spyOn(walletService, 'creditWallet').mockResolvedValue(undefined);

        const req = { app: { get: () => sequelize } };
        const event = { type: 'payment_intent.succeeded', data: { object: { metadata: { externalRef: 'ref1' } } } };

        const result = await paymentService.handleStripeWebhook(req, event);

        expect(result).toEqual({ received: true });
        expect(sequelize.query).toHaveBeenCalledTimes(2);
        expect(walletService.creditWallet).toHaveBeenCalledWith(sequelize, 'user1', 5.00, 'USD');

        walletService.creditWallet.mockRestore();
    });

    it('marks transaction failed when payment_intent.payment_failed', async () => {
        const sequelize = { query: jest.fn().mockResolvedValue([]) };
        const req = { app: { get: () => sequelize } };
        const event = { type: 'payment_intent.payment_failed', data: { object: { metadata: { externalRef: 'ref1' } } } };

        const result = await paymentService.handleStripeWebhook(req, event);

        expect(result).toEqual({ received: true });
        expect(sequelize.query).toHaveBeenCalledTimes(1);
        expect(sequelize.query).toHaveBeenCalledWith('UPDATE Transactions SET status = ? WHERE externalRef = ?', { replacements: ['failed', 'ref1'] });
    });
});
