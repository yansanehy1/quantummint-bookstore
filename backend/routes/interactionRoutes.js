const express = require('express');
const router = express.Router();
const { LearnerInteraction } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Log a learner interaction (tap, replay, expand)
 * POST /api/interaction
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { tokenId, formulaId, action, metadata } = req.body;
        const userId = req.user.id;

        const interaction = await LearnerInteraction.create({
            userId,
            tokenId,
            formulaId,
            action: action || 'tap',
            metadata: metadata || {}
        });

        res.status(201).json(interaction);
    } catch (err) {
        console.error('Error logging interaction:', err);
        res.status(500).json({ error: 'Failed to log interaction' });
    }
});

/**
 * Get analytics for a learner or book
 * GET /api/interaction/analytics
 */
router.get('/analytics', authenticateToken, async (req, res) => {
    try {
        const { bookId, userId } = req.query;
        const where = {};
        if (bookId) where.formulaId = bookId; // Simplified for now
        if (userId) where.userId = userId;

        const interactions = await LearnerInteraction.findAll({
            where,
            limit: 100,
            order: [['createdAt', 'DESC']]
        });

        res.json(interactions);
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
