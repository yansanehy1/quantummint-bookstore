jest.mock('uuid', () => ({ v4: jest.fn(() => 'refund-uuid-1') }));

const VALID_PURCHASE_ID = '550e8400-e29b-41d4-a716-446655440000';

const mockRefundRecord = {
    id: 'refund-1',
    userId: 'user-1',
    purchaseId: VALID_PURCHASE_ID,
    status: 'pending',
    amount: 50,
    currency: 'USD',
    update: jest.fn(function (data) {
        Object.assign(mockRefundRecord, data);
        return Promise.resolve(mockRefundRecord);
    }),
};

jest.mock('../models', () => ({
    RefundRequest: {
        findOne: jest.fn().mockResolvedValue(null),
        findByPk: jest.fn().mockResolvedValue(mockRefundRecord),
        create: jest.fn().mockResolvedValue({ id: 'refund-new' }),
        findAll: jest.fn().mockResolvedValue([]),
    },
    Purchase: {
        findOne: jest.fn().mockResolvedValue({
            id: VALID_PURCHASE_ID,
            userId: 'user-1',
            status: 'completed',
            amount: 50,
            currency: 'USD',
            Book: { title: 'Test Book' },
        }),
        findAll: jest.fn().mockResolvedValue([]),
    },
    Book: {},
    User: {
        findByPk: jest.fn().mockResolvedValue({ id: 'user-1', name: 'Test', email: 'test@example.com' }),
    },
    Transaction: {
        create: jest.fn().mockResolvedValue({ id: 'tx-1' }),
    },
    AuditLog: {
        create: jest.fn().mockResolvedValue({}),
    },
}));

const walletService = require('../services/walletService');
const refundController = require('../controllers/refundController');
const adminController = require('../controllers/adminController');
const { RefundRequest, Transaction } = require('../models');

describe('refund workflow integration', () => {
    let mockSequelize;
    let creditWalletSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        creditWalletSpy = jest.spyOn(walletService, 'creditWallet').mockResolvedValue(undefined);
        mockSequelize = {
            transaction: jest.fn(async (work) => work({})),
        };
        RefundRequest.findByPk.mockResolvedValue(mockRefundRecord);
        mockRefundRecord.status = 'pending';
    });

    afterEach(() => {
        creditWalletSpy.mockRestore();
    });

    it('submit → approve credits wallet and records transaction', async () => {
        const submitReq = {
            user: { id: 'user-1' },
            body: {
                purchaseId: VALID_PURCHASE_ID,
                reason: 'The audiobook files were corrupted and would not play.',
            },
        };
        const submitRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await refundController.submitRefund(submitReq, submitRes);
        expect(submitRes.status).toHaveBeenCalledWith(201);

        const processReq = {
            user: { id: 'admin-1' },
            params: { id: 'refund-1' },
            body: { status: 'approved', adminNotes: 'Verified issue' },
            app: { get: () => mockSequelize },
        };
        const processRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await adminController.processRefund(processReq, processRes);

        expect(creditWalletSpy).toHaveBeenCalledWith(mockSequelize, 'user-1', 50, 'USD');
        expect(Transaction.create).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'refund', userId: 'user-1', amount: 50, currency: 'USD' }),
            expect.any(Object)
        );
        expect(processRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, message: 'Refund request approved' })
        );
    });

    it('rejects invalid refund reason on submit', async () => {
        const req = {
            user: { id: 'user-1' },
            body: { purchaseId: VALID_PURCHASE_ID, reason: 'short' },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await refundController.submitRefund(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(RefundRequest.create).not.toHaveBeenCalled();
    });
});
