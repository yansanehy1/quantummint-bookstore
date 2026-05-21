const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.post('/', isAdmin, groupController.createGroup);
router.get('/', isAdmin, groupController.listGroups);
router.post('/:id/activate', isAdmin, groupController.activateGroup);
router.put('/:id/balance', isAdmin, groupController.adjustGroupBalance);

// Admin or Sponsor routes
router.post('/:id/members', groupController.bulkAddMembers);
router.post('/:id/subscriptions', groupController.activateGroupSubscriptions);

module.exports = router;
