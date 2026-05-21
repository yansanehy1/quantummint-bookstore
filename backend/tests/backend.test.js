jest.mock('uuid', () => ({ v4: jest.fn(() => 'uuid-fixed') }));

jest.mock('../models', () => ({
    Book: {
        findByPk: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
        sequelize: {
            transaction: jest.fn(async (work) => work({})),
        },
    },
    Purchase: {
        create: jest.fn().mockResolvedValue({ id: 'purchase-1' }),
    },
    Transaction: {
        create: jest.fn().mockResolvedValue({ id: 'tx-1' }),
    },
}));

const { Book, User } = require('../models');
const purchaseService = require('../services/purchaseService');
const paymentService = require('../services/paymentService');
const walletService = require('../services/walletService');

describe('purchaseService', () => {
    it('throws when purchase amount does not match book price', async () => {
        Book.findByPk.mockResolvedValue({ priceSLL: '100', priceUSD: '2.00' });
        User.findByPk.mockResolvedValue({
            usdBalance: '10.00',
            sllBalance: '1000',
            update: jest.fn(),
        });

        await expect(purchaseService.purchaseBook({}, 'user1', 'bookid', 3, 'USD')).rejects.toThrow('Amount does not match book price');
    });

    it('processes purchase with exact price in transaction', async () => {
        const mockUpdate = jest.fn().mockResolvedValue(undefined);
        Book.findByPk.mockResolvedValue({ priceSLL: '100', priceUSD: '2.00' });
        User.findByPk.mockResolvedValue({
            usdBalance: '10.00',
            sllBalance: '1000',
            update: mockUpdate,
        });

        const result = await purchaseService.purchaseBook({}, 'user1', 'bookid', 2.00, 'USD');
        expect(result).toHaveProperty('purchaseId');
        expect(result).toHaveProperty('transactionId');
        expect(mockUpdate).toHaveBeenCalled();
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
