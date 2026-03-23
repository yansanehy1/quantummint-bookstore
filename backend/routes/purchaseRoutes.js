const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected: all purchase routes require auth
router.post('/', authenticateToken, purchaseController.purchaseBook);

module.exports = router;
