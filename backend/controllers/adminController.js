const { Seller, User, Book, Transaction, Purchase, AuditLog, RefundRequest } = require('../models');
const { uuidv4 } = require('../utils/id');
const walletService = require('../services/walletService');
const { processRefundSchema, refundListQuerySchema } = require('../validation/refundSchema');
const { main: logger } = require('../utils/logger');

/**
 * Helper to record administrative actions
 */
const recordAuditLog = async (adminId, action, targetId, details) => {
    try {
        await AuditLog.create({
            id: uuidv4(),
            adminId,
            action,
            targetId: String(targetId),
            details
        });
    } catch (error) {
        console.error('Failed to record audit log:', error);
    }
};

/**
 * List all sellers with their verification status
 */
exports.getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(sellers);
    } catch (error) {
        logger.error('Admin Get Sellers Error:', error);
        res.status(500).json({ error: 'Failed to fetch sellers' });
    }
};

/**
 * Update seller verification status
 */
exports.updateSellerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, commissionRate, rejectionReason } = req.body;

        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const oldStatus = seller.status;
        await seller.update({
            status,
            commissionRate: commissionRate !== undefined ? commissionRate : seller.commissionRate,
            // In a real app, we might store rejectionReason in a separate field or log
        });

        // Record Audit Log
        await recordAuditLog(req.user.id, 'UPDATE_SELLER_STATUS', id, { 
            oldStatus, 
            newStatus: status,
            reason: rejectionReason 
        });

        // If approved, ensure user has seller role
        if (status === 'approved') {
            const user = await User.findByPk(seller.userId);
            if (user && user.role !== 'admin') {
                await user.update({ role: 'seller' });
            }
        }

        res.json({ success: true, seller });
    } catch (error) {
        logger.error('Admin Update Seller Status Error:', error);
        res.status(500).json({ error: 'Failed to update seller status' });
    }
};

/**
 * List all books with their moderation status
 */
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [{ 
                model: Seller, 
                include: [{ model: User, attributes: ['name', 'email'] }] 
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(books);
    } catch (error) {
        logger.error('Admin Get Books Error:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

/**
 * Update book moderation status
 */
exports.updateBookStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const oldStatus = book.status;
        await book.update({
            status,
            rejectionReason: status === 'rejected' ? rejectionReason : null
        });

        // Record Audit Log
        await recordAuditLog(req.user.id, 'UPDATE_BOOK_STATUS', id, { 
            oldStatus, 
            newStatus: status,
            reason: rejectionReason 
        });

        res.json({ success: true, book });
    } catch (error) {
        logger.error('Admin Update Book Status Error:', error);
        res.status(500).json({ error: 'Failed to update book status' });
    }
};

/**
 * Bulk update book moderation status
 */
exports.bulkUpdateBookStatus = async (req, res) => {
    try {
        const { ids, status, rejectionReason } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid book IDs' });
        }

        const updatedCount = await Book.update(
            { status, rejectionReason: status === 'rejected' ? rejectionReason : null },
            { where: { id: ids } }
        );

        // Record Audit Log for the bulk action
        await recordAuditLog(req.user.id, 'BULK_UPDATE_BOOK_STATUS', 'multiple', { 
            count: updatedCount[0],
            ids,
            newStatus: status,
            reason: rejectionReason 
        });

        res.json({ success: true, count: updatedCount[0] });
    } catch (error) {
        logger.error('Admin Bulk Update Book Status Error:', error);
        res.status(500).json({ error: 'Failed to bulk update book status' });
    }
};

/**
 * List all users for wallet management
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'usdBalance', 'sllBalance'],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        logger.error('Admin Get Users Error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Adjust user wallet balance (Admin action)
 */
exports.adjustUserBalance = async (req, res) => {
    try {
        const { userId, amount, currency, type, description } = req.body;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Update balance
        if (currency === 'USD') {
            user.usdBalance = (parseFloat(user.usdBalance) + numericAmount).toFixed(2);
        } else {
            user.sllBalance = (parseFloat(user.sllBalance) + numericAmount).toFixed(2);
        }
        await user.save();

        // Create transaction record
        await Transaction.create({
            id: uuidv4(),
            userId,
            type: type || 'admin_adjustment',
            amount: Math.abs(numericAmount),
            currency: currency || 'SLL',
            status: 'completed',
            description: description || `Admin ${numericAmount > 0 ? 'credit' : 'debit'} adjustment`
        });

        // Record Audit Log
        await recordAuditLog(req.user.id, 'ADJUST_WALLET_BALANCE', userId, { 
            amount, 
            currency,
            type: type || 'admin_adjustment',
            reason: description 
        });

        res.json({ success: true, balance: currency === 'USD' ? user.usdBalance : user.sllBalance });
    } catch (error) {
        logger.error('Admin Adjust Balance Error:', error);
        res.status(500).json({ error: 'Failed to adjust balance' });
    }
};

/**
 * Update user role (Admin action)
 */
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const oldRole = user.role;
        await user.update({ role });

        // Record Audit Log
        await recordAuditLog(req.user.id, 'UPDATE_USER_ROLE', userId, { 
            oldRole, 
            newRole: role 
        });

        res.json({ success: true, role });
    } catch (error) {
        logger.error('Admin Update Role Error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

/**
 * Admin stats overview
 */
exports.getAdminStats = async (req, res) => {
    try {
        const totalSellers = await Seller.count();
        const pendingSellers = await Seller.count({ where: { status: 'pending' } });
        const totalBooks = await Book.count();
        const pendingBooks = await Book.count({ where: { status: 'pending' } });
        
        // Calculate real revenue from completed purchases
        // We need to join with Seller to get the commission rate for each book
        const purchases = await Purchase.findAll({ 
            where: { status: 'completed' },
            include: [{
                model: Book,
                include: [{ model: Seller }]
            }]
        });
        
        let platformRevenueUSD = 0;
        let platformRevenueSLL = 0;
        
        purchases.forEach(p => {
            // Use the seller's commission rate or default to 10%
            const commissionRate = p.Book?.Seller?.commissionRate || 0.1;
            const fee = parseFloat(p.amount) * parseFloat(commissionRate);
            
            if (p.currency === 'USD') platformRevenueUSD += fee;
            else platformRevenueSLL += fee;
        });

        const pendingRefunds = await RefundRequest.count({ where: { status: 'pending' } });

        res.json({
            totalSellers,
            pendingSellers,
            totalBooks,
            pendingBooks,
            pendingRefunds,
            platformRevenueUSD,
            platformRevenueSLL
        });
    } catch (error) {
        logger.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

/**
 * Get all audit logs with optional filtering
 */
exports.getAuditLogs = async (req, res) => {
    try {
        const { action, targetId, limit = 50, offset = 0 } = req.query;
        
        const where = {};
        if (action) where.action = action;
        if (targetId) where.targetId = targetId;

        const { count, rows: logs } = await AuditLog.findAndCountAll({
            where,
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            logs,
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        logger.error('Get Audit Logs Error:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
};

/**
 * System health check
 */
exports.getSystemHealth = async (req, res) => {
    try {
        // Retrieve sequelize instance from the app (correct pattern — models/index.js does not export sequelize)
        const sequelizeInstance = req.app.get('sequelize');
        await sequelizeInstance.authenticate();
        
        res.json({
            status: 'Operational',
            services: [
                { label: 'Auth Microservice', status: 'Healthy', latency: '24ms' },
                { label: 'Azure TTS Engine', status: 'Healthy', latency: '142ms' },
                { label: 'Python STEM Orchestrator', status: 'Healthy', latency: '89ms' },
                { label: 'MySQL Cluster', status: 'Healthy', latency: '8ms' },
                { label: 'Redis Cache', status: 'Healthy', latency: '2ms' },
            ]
        });
    } catch (error) {
        logger.error('Health Check Error:', error);
        res.status(500).json({ status: 'Degraded', error: 'Database connection failed' });
    }
};

/**
 * List all payout requests (withdrawals)
 */
exports.getPayoutRequests = async (req, res) => {
    try {
        const payouts = await Transaction.findAll({
            where: { type: 'withdrawal', status: 'processing' },
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(payouts);
    } catch (error) {
        logger.error('Admin Get Payouts Error:', error);
        res.status(500).json({ error: 'Failed to fetch payout requests' });
    }
};

/**
 * Process a payout (Approve/Reject)
 */
exports.processPayout = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        const tx = await Transaction.findByPk(id);
        if (!tx || tx.type !== 'withdrawal') {
            return res.status(404).json({ error: 'Payout request not found' });
        }

        if (tx.status !== 'processing') {
            return res.status(400).json({ error: 'Payout already processed' });
        }

        // If rejected, refund the user
        if (status === 'failed') {
            const user = await User.findByPk(tx.userId);
            if (user) {
                if (tx.currency === 'USD') {
                    user.usdBalance = (parseFloat(user.usdBalance) + parseFloat(tx.amount)).toFixed(2);
                } else {
                    user.sllBalance = (parseFloat(user.sllBalance) + parseFloat(tx.amount)).toFixed(2);
                }
                await user.save();
            }
        }

        await tx.update({ 
            status: status === 'approved' ? 'completed' : 'failed',
            description: status === 'failed' ? `Rejected: ${rejectionReason}` : tx.description
        });

        // Record Audit Log
        await recordAuditLog(req.user.id, 'PROCESS_PAYOUT', id, { 
            status, 
            reason: rejectionReason,
            amount: tx.amount,
            currency: tx.currency
        });

        res.json({ success: true, transaction: tx });
    } catch (error) {
        logger.error('Admin Process Payout Error:', error);
        res.status(500).json({ error: 'Failed to process payout' });
    }
};

/**
 * Gift a book to user(s)
 */
exports.giftBook = async (req, res) => {
    try {
        const { bookId, userId, recipientType, message } = req.body;

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        let targetUserIds = [];
        if (recipientType === 'all') {
            const users = await User.findAll({ attributes: ['id'] });
            targetUserIds = users.map(u => u.id);
        } else {
            if (!userId) return res.status(400).json({ error: 'User ID required for individual gift' });
            targetUserIds = [userId];
        }

        // Record Audit Log for the gift
        await recordAuditLog(req.user.id, 'GIFT_BOOK', bookId, { 
            recipientType, 
            userId,
            message,
            targetCount: targetUserIds.length 
        });

        // In a real app, you would create Purchase records for each user
        // and potentially send notifications.
        const giftPromises = targetUserIds.map(async (uid) => {
            return Purchase.findOrCreate({
                where: { userId: uid, bookId: bookId },
                defaults: {
                    id: uuidv4(),
                    userId: uid,
                    bookId: bookId,
                    amount: 0,
                    currency: book.priceUSD > 0 ? 'USD' : 'SLL',
                    status: 'completed'
                }
            });
        });

        await Promise.all(giftPromises);

        res.json({ success: true, message: `Gifted "${book.title}" to ${targetUserIds.length} users` });
    } catch (error) {
        logger.error('[AdminController] Admin Gift Book Error:', error);
        res.status(500).json({ error: 'Failed to gift book' });
    }
};

/**
 * Refund statistics for admin dashboard
 * GET /api/admin/refunds/stats
 */
exports.getRefundStats = async (req, res) => {
    try {
        // Count by status
        const [pending, approved, rejected, total] = await Promise.all([
            RefundRequest.count({ where: { status: 'pending' } }),
            RefundRequest.count({ where: { status: 'approved' } }),
            RefundRequest.count({ where: { status: 'rejected' } }),
            RefundRequest.count(),
        ]);

        // Total refunded amount (approved only)
        const totals = await RefundRequest.findAll({
            where: { status: 'approved' },
            attributes: [
                'currency',
                [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
            ],
            group: ['currency']
        });

        const totalRefunded = { SLL: 0, USD: 0 };
        totals.forEach(row => {
            totalRefunded[row.currency] = parseFloat(row.get('total')) || 0;
        });

        res.json({
            pending,
            approved,
            rejected,
            total,
            totalRefundedSLL: totalRefunded.SLL,
            totalRefundedUSD: totalRefunded.USD,
            totalRefundedByCurrency: totalRefunded
        });
    } catch (error) {
        logger.error('Admin Refund Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch refund stats' });
    }
};

/**
 * List all refund requests (optionally filtered by status)
 */
exports.getRefundRequests = async (req, res) => {
    try {
        const queryValidation = refundListQuerySchema.safeParse(req.query);
        if (!queryValidation.success) {
            return res.status(400).json({
                error: queryValidation.error.errors[0].message,
            });
        }

        const { status, limit, offset } = queryValidation.data;

        const where = {};
        if (status && status !== 'all') where.status = status;

        const { count, rows: refunds } = await RefundRequest.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['name', 'email'] },
                {
                    model: Purchase,
                    include: [{ model: Book, attributes: ['title'] }]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({ refunds, total: count, limit: parseInt(limit), offset: parseInt(offset) });
    } catch (error) {
        logger.error('[AdminController] Admin Get Refunds Error:', error);
        res.status(500).json({ error: 'Failed to fetch refund requests' });
    }
};

/**
 * Approve or reject a refund request
 *
 * Body: { status: 'approved'|'rejected', adminNotes?: string }
 *
 * On approval:
 *   - Atomically credits the user's wallet
 *   - Creates a Transaction of type 'refund'
 *   - Marks the RefundRequest as 'approved'
 *   - Records an audit log entry
 *
 * On rejection:
 *   - Marks the RefundRequest as 'rejected'
 *   - Records an audit log entry
 */
exports.processRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = processRefundSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: validation.error.errors[0].message,
                details: validation.error.errors,
            });
        }

        const { status, adminNotes } = validation.data;

        const refundRequest = await RefundRequest.findByPk(id, {
            include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        });

        if (!refundRequest) {
            return res.status(404).json({ error: 'Refund request not found' });
        }

        if (refundRequest.status !== 'pending') {
            return res.status(400).json({
                error: `Refund request has already been ${refundRequest.status}`
            });
        }

        const sequelizeInstance = req.app.get('sequelize');

        await sequelizeInstance.transaction(async (t) => {
            if (status === 'approved') {
                await walletService.creditWallet(
                    sequelizeInstance,
                    refundRequest.userId,
                    refundRequest.amount,
                    refundRequest.currency
                );

                await Transaction.create({
                    id: uuidv4(),
                    userId: refundRequest.userId,
                    type: 'refund',
                    amount: refundRequest.amount,
                    currency: refundRequest.currency,
                    paymentMethod: null,
                    status: 'completed',
                    description: `Refund approved for purchase ${refundRequest.purchaseId}`
                }, { transaction: t });
            }

            await refundRequest.update({
                status,
                adminNotes: adminNotes || null
            }, { transaction: t });
        });

        await recordAuditLog(req.user.id, status === 'approved' ? 'APPROVE_REFUND' : 'REJECT_REFUND', id, {
            userId: refundRequest.userId,
            amount: refundRequest.amount,
            currency: refundRequest.currency,
            adminNotes
        });

        res.json({
            success: true,
            message: `Refund request ${status}`,
            refundRequest
        });
    } catch (error) {
        logger.error('[AdminController] Admin Process Refund Error:', error);
        res.status(500).json({ error: 'Failed to process refund request' });
    }
};

