/**
 * Refund Controller — Learner-facing endpoints
 *
 * Routes:
 *   POST   /api/refunds                    — Submit a new refund request
 *   GET    /api/refunds                    — List the authenticated user's refund requests
 *   GET    /api/refunds/eligible-purchases — Completed purchases eligible for refund
 *   GET    /api/refunds/:id                — Get detail of a single refund request
 */

const { RefundRequest, Purchase, Book } = require('../models');
const { Op } = require('sequelize');
const { uuidv4 } = require('../utils/id');
const { main: logger } = require('../utils/logger');
const { submitRefundSchema } = require('../validation/refundSchema');

exports.submitRefund = async (req, res) => {
    try {
        const validation = submitRefundSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: validation.error.errors[0].message,
                details: validation.error.errors,
            });
        }

        const userId = req.user.id;
        const { purchaseId, reason } = validation.data;

        const purchase = await Purchase.findOne({
            where: { id: purchaseId, userId },
            include: [{ model: Book, attributes: ['title'] }],
        });

        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        if (purchase.status !== 'completed') {
            return res.status(400).json({
                error: `Refunds can only be requested for completed purchases (current status: ${purchase.status})`,
            });
        }

        const existing = await RefundRequest.findOne({
            where: {
                purchaseId,
                status: { [Op.in]: ['pending', 'approved'] },
            },
        });

        if (existing) {
            return res.status(409).json({
                error: `A refund request for this purchase already exists (status: ${existing.status})`,
            });
        }

        const refundRequest = await RefundRequest.create({
            id: uuidv4(),
            userId,
            purchaseId,
            reason,
            status: 'pending',
            amount: purchase.amount,
            currency: purchase.currency,
        });

        logger.info(`[RefundController] Refund request ${refundRequest.id} created by user ${userId} for purchase ${purchaseId}.`);

        res.status(201).json({
            success: true,
            message: 'Refund request submitted successfully. An admin will review it shortly.',
            refundRequest,
        });
    } catch (error) {
        logger.error('[RefundController] Submit refund error:', error);
        res.status(500).json({ error: 'Failed to submit refund request' });
    }
};

exports.getEligiblePurchases = async (req, res) => {
    try {
        const userId = req.user.id;

        const purchases = await Purchase.findAll({
            where: { userId, status: 'completed' },
            include: [
                { model: Book, attributes: ['id', 'title', 'coverUrl'] },
                {
                    model: RefundRequest,
                    required: false,
                    where: { status: { [Op.in]: ['pending', 'approved'] } },
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const eligible = purchases
            .filter((p) => !p.RefundRequest)
            .map((p) => ({
                id: p.id,
                amount: p.amount,
                currency: p.currency,
                createdAt: p.createdAt,
                book: p.Book,
            }));

        res.json(eligible);
    } catch (error) {
        logger.error('[RefundController] Get eligible purchases error:', error);
        res.status(500).json({ error: 'Failed to fetch eligible purchases' });
    }
};

exports.getMyRefunds = async (req, res) => {
    try {
        const userId = req.user.id;

        const refunds = await RefundRequest.findAll({
            where: { userId },
            include: [
                {
                    model: Purchase,
                    include: [{ model: Book, attributes: ['title', 'coverUrl'] }],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(refunds);
    } catch (error) {
        logger.error('[RefundController] Get my refunds error:', error);
        res.status(500).json({ error: 'Failed to fetch refund requests' });
    }
};

exports.getRefundById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const refund = await RefundRequest.findOne({
            where: { id, userId },
            include: [
                {
                    model: Purchase,
                    include: [{ model: Book, attributes: ['title', 'coverUrl', 'description'] }],
                },
            ],
        });

        if (!refund) {
            return res.status(404).json({ error: 'Refund request not found' });
        }

        res.json(refund);
    } catch (error) {
        logger.error('[RefundController] Get refund by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch refund request' });
    }
};
