jest.mock('uuid', () => ({ v4: jest.fn(() => 'test-sub-uuid') }));

const mockUserFindByPk = jest.fn();
const mockSubscriptionCreate = jest.fn();
const mockTransactionCreate = jest.fn();

jest.mock('../models', () => ({
    Subscription: {
        findAll: jest.fn(),
        update: jest.fn(),
        create: (...args) => mockSubscriptionCreate(...args),
    },
    Transaction: {
        create: (...args) => mockTransactionCreate(...args),
    },
    User: {
        findByPk: (...args) => mockUserFindByPk(...args),
    },
    sequelize: {},
}));

jest.mock('node-cron', () => ({
    schedule: jest.fn(),
}));

jest.mock('../services/notificationService', () => ({
    notifySubscriptionLowBalance: jest.fn().mockResolvedValue({ sent: true }),
    notifySubscriptionExpired: jest.fn().mockResolvedValue({ sent: true }),
}));

const { _attemptRenewal } = require('../workers/subscriptionWorker');
const {
    notifySubscriptionLowBalance,
} = require('../services/notificationService');

describe('subscriptionWorker._attemptRenewal', () => {
    const mockTransaction = jest.fn(async (work) => work({}));
    const mockSequelize = {
        transaction: mockTransaction,
        query: jest.fn().mockResolvedValue([]),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('expires subscription and sends low-balance notification when balance is insufficient', async () => {
        const subscription = {
            id: 'sub-1',
            userId: 'user-1',
            planId: '24hours',
            currency: 'SLL',
            update: jest.fn().mockResolvedValue(undefined),
        };

        const mockUser = {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            sllBalance: '0',
            usdBalance: '0',
        };

        mockUserFindByPk.mockResolvedValue(mockUser);

        const result = await _attemptRenewal(subscription, mockSequelize);

        expect(result).toBe('expired');
        expect(subscription.update).toHaveBeenCalledWith({ status: 'expired' });
        expect(notifySubscriptionLowBalance).toHaveBeenCalledWith(
            expect.objectContaining({
                user: mockUser,
                planId: '24hours',
                currency: 'SLL',
            })
        );
        expect(mockTransaction).not.toHaveBeenCalled();
    });

    it('renews subscription when balance is sufficient', async () => {
        const subscription = {
            id: 'sub-2',
            userId: 'user-2',
            planId: '12hours',
            currency: 'USD',
            update: jest.fn().mockResolvedValue(undefined),
        };

        mockUserFindByPk.mockResolvedValue({
            id: 'user-2',
            usdBalance: '100',
            sllBalance: '0',
        });
        mockSubscriptionCreate.mockResolvedValue({});
        mockTransactionCreate.mockResolvedValue({});

        const result = await _attemptRenewal(subscription, mockSequelize);

        expect(result).toBe('renewed');
        expect(mockTransaction).toHaveBeenCalled();
        expect(mockSubscriptionCreate).toHaveBeenCalled();
        expect(mockTransactionCreate).toHaveBeenCalled();
        expect(notifySubscriptionLowBalance).not.toHaveBeenCalled();
    });
});
