const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public route — no authentication required
router.get('/plans', subscriptionController.getPlans);

// All routes below require authentication
router.use(authenticateToken);

router.get('/current', subscriptionController.getCurrentSubscription);
router.get('/check-access', subscriptionController.checkAccess);
router.post('/', subscriptionController.createSubscription);
router.post('/batch', subscriptionController.createBatchSubscription);
router.post('/cancel', subscriptionController.cancelSubscription);
router.get('/history', subscriptionController.getHistory);

module.exports = router;
