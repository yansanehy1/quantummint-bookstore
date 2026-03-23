const asyncHandler = require('../middleware/asyncHandler');
const purchaseService = require('../services/purchaseService');

// ============================================================
// Purchase Controller – handle book purchases via wallet
// ============================================================
exports.purchaseBook = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { bookId, amount, currency } = req.body || {};

    const result = await purchaseService.purchaseBook(req, userId, bookId, amount, currency);
    res.json({ success: true, message: 'Purchase successful', ...result });
});