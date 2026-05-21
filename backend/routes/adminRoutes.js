const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { refundAdminLimiter } = require('../middleware/rateLimiters');

// Apply admin protection to all routes in this router
router.use(authenticateToken);
router.use(isAdmin);

/**
 * @route   GET /api/admin/sellers
 * @desc    List all sellers
 */
router.get('/sellers', adminController.getAllSellers);

/**
 * @route   PUT /api/admin/sellers/:id/status
 * @desc    Approve or reject a seller
 */
router.put('/sellers/:id/status', adminController.updateSellerStatus);

/**
 * @route   GET /api/admin/books
 * @desc    List all books
 */
router.get('/books', adminController.getAllBooks);

/**
 * @route   PUT /api/admin/books/:id/status
 * @desc    Approve or reject a book
 */
router.put('/books/:id/status', adminController.updateBookStatus);

/**
 * @route   POST /api/admin/books/bulk-status
 * @desc    Bulk approve or reject books
 */
router.post('/books/bulk-status', adminController.bulkUpdateBookStatus);

/**
 * @route   GET /api/admin/users
 * @desc    List all users for wallet management
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   POST /api/admin/users/adjust-balance
 * @desc    Adjust user wallet balance
 */
router.post('/users/adjust-balance', adminController.adjustUserBalance);

/**
 * @route   PUT /api/admin/users/role
 * @desc    Update user role
 */
router.put('/users/role', adminController.updateUserRole);

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard stats
 */
router.get('/stats', adminController.getAdminStats);

/**
 * @route   GET /api/admin/logs
 * @desc    Get administrative audit logs
 */
router.get('/logs', adminController.getAuditLogs);

/**
 * @route   GET /api/admin/health
 * @desc    Get system health status
 */
router.get('/health', adminController.getSystemHealth);

/**
 * @route   GET /api/admin/payouts
 * @desc    Get all pending payout requests
 */
router.get('/payouts', adminController.getPayoutRequests);

/**
 * @route   PUT /api/admin/payouts/:id
 * @desc    Approve or reject a payout
 */
router.put('/payouts/:id', adminController.processPayout);

/**
 * @route   POST /api/admin/gift-book
 * @desc    Gift a book to user(s)
 */
router.post('/gift-book', adminController.giftBook);

/**
 * @route   GET /api/admin/refunds/stats
 * @desc    Refund counts for admin dashboard
 */
router.get('/refunds/stats', adminController.getRefundStats);

/**
 * @route   GET /api/admin/refunds
 * @desc    List all refund requests (filter with ?status=pending|approved|rejected)
 */
router.get('/refunds', adminController.getRefundRequests);

/**
 * @route   PUT /api/admin/refunds/:id
 * @desc    Approve or reject a refund request
 */
router.put('/refunds/:id', refundAdminLimiter, adminController.processRefund);

module.exports = router;
