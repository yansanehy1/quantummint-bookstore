const express = require('express');
const router = express.Router();
const draftController = require('../controllers/draftController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', draftController.saveDraft);
router.get('/', draftController.getDrafts);
router.get('/:id', draftController.getDraft);
router.delete('/:id', draftController.deleteDraft);

module.exports = router;
