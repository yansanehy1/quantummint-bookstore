const asyncHandler = require('../middleware/asyncHandler');
const walletService = require('../services/walletService');

// ============================================================
// Wallet Controller – balance + transaction history
// ============================================================

exports.getBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await walletService.getBalance(req, userId);
    res.json(data);
});
exports.getTransactions = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await walletService.getTransactions(req, userId, req.query);
    res.json(data);
});