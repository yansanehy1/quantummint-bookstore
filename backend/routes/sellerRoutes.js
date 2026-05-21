const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/sellers/register
 * @desc    Register as a seller or update application
 * @access  Private
 */
router.post('/register', authenticateToken, sellerController.registerSeller);

/**
 * @route   GET /api/sellers/profile
 * @desc    Get seller profile
 * @access  Private (Seller only)
 */
router.get('/profile', authenticateToken, sellerController.getSellerProfile);

/**
 * @route   GET /api/sellers/earnings
 * @desc    Get seller earnings and performance
 * @access  Private (Seller only)
 */
router.get('/earnings', authenticateToken, sellerController.getEarnings);

/**
 * @route   POST /api/sellers/payout
 * @desc    Request a payout
 * @access  Private (Seller only)
 */
router.post('/payout', authenticateToken, sellerController.requestPayout);

/**
 * @route   GET /api/sellers/voices
 * @desc    Get all cloned voices for the seller
 * @access  Private (Seller only)
 */
router.get('/voices', authenticateToken, sellerController.getClonedVoices);

module.exports = router;
