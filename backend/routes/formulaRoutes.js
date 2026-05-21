const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { Formula, FormulaToken, Book } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

// Internal TTS service URL (FastAPI)
const TTS_SERVICE_URL = process.env.TTS_SERVICE_URL || 'http://localhost:8000/tts';

/**
 * Narrate a formula and store its breakdown
 * POST /api/formula/narrate
 */
router.post('/narrate', authenticateToken, async (req, res) => {
    try {
        const { formula, bookId, field } = req.body;

        if (!formula) {
            return res.status(400).json({ error: 'Formula text is required' });
        }

        // 1. Get breakdown from FastAPI
        const response = await fetch(`${TTS_SERVICE_URL}/breakdown`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formula }),
        });

        const breakdown = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(breakdown);
        }

        // 2. Save formula to database if bookId is provided
        let savedFormula = null;
        if (bookId) {
            savedFormula = await Formula.create({
                bookId,
                rawText: formula,
                field: field || 'math'
            });

            // 3. Save tokens
            if (breakdown.tokens && breakdown.tokens.length > 0) {
                const tokenData = breakdown.tokens.map((token, index) => ({
                    formulaId: savedFormula.id,
                    symbol: token.symbol,
                    spoken: token.spoken,
                    definition: token.definition,
                    orderIndex: index
                }));
                await FormulaToken.bulkCreate(tokenData);
            }
        }

        res.json({
            formulaId: savedFormula ? savedFormula.id : null,
            ...breakdown
        });
    } catch (err) {
        console.error('Error narrating formula:', err);
        res.status(500).json({ error: 'Failed to narrate formula' });
    }
});

/**
 * Get tokens for a formula
 * GET /api/formula/:id/tokens
 */
router.get('/:id/tokens', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const tokens = await FormulaToken.findAll({
            where: { formulaId: id },
            order: [['orderIndex', 'ASC']]
        });
        res.json(tokens);
    } catch (err) {
        console.error('Error fetching tokens:', err);
        res.status(500).json({ error: 'Failed to fetch tokens' });
    }
});

module.exports = router;
