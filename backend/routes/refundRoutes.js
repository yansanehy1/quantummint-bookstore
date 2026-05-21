const express = require('express');
const router = express.Router();
const refundController = require('../controllers/refundController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { refundSubmitLimiter } = require('../middleware/rateLimiters');

router.use(authenticateToken);

router.post('/', refundSubmitLimiter, refundController.submitRefund);
router.get('/eligible-purchases', refundController.getEligiblePurchases);
router.get('/', refundController.getMyRefunds);
router.get('/:id', refundController.getRefundById);

module.exports = router;
