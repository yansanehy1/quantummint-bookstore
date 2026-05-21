const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Deep search across the bookstore ecosystem.
 * GET /api/search?q=...
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const results = await searchService.deepSearch(q);
        res.json(results);
    } catch (err) {
        console.error('Search route error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
