const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All wallet routes require authentication
router.get('/balance', authenticateToken, walletController.getBalance);
router.get('/transactions', authenticateToken, walletController.getTransactions);

module.exports = router;
