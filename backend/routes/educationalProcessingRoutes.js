const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const router = express.Router();
const educationalContentService = require('../services/educationalContentService');
const { authenticateToken } = require('../middleware/authMiddleware');
const { Book } = require('../models');

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Trigger automated educational processing for a book page.
 * POST /api/educational/processing/process-page
 */
router.post('/process-page', authenticateToken, async (req, res) => {
    try {
        const { bookId, pageId, content } = req.body;

        if (!bookId || !pageId || !content) {
            return res.status(400).json({ error: 'Missing bookId, pageId, or content' });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const result = await educationalContentService.processPage(bookId, pageId, content);

        res.json({
            success: true,
            ...result,
        });
    } catch (err) {
        console.error('Error in educational processing route:', err);
        res.status(500).json({ error: err.message || 'Internal processing error' });
    }
});

/**
 * Bulk processing for an entire book.
 * POST /api/educational/processing/process-bulk
 */
router.post('/process-bulk', authenticateToken, async (req, res) => {
    try {
        const { bookId, pages } = req.body;

        if (!bookId || !pages || !Array.isArray(pages)) {
            return res.status(400).json({ error: 'Missing bookId or pages array' });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const result = await educationalContentService.processBulk(bookId, pages);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('Error in bulk educational processing:', err);
        res.status(500).json({ error: err.message || 'Internal processing error' });
    }
});

/**
 * Extract text from PDF or DOCX file for Studio draft
 * POST /api/educational/processing/extract-text
 */
router.post('/extract-text', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let text = '';
        const mimeType = req.file.mimetype;

        if (mimeType === 'application/pdf') {
            const data = await pdf(req.file.buffer);
            text = data.text;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            text = result.value;
        } else if (mimeType === 'text/plain') {
            text = req.file.buffer.toString('utf-8');
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload PDF, DOCX or TXT.' });
        }

        res.json({ text });
    } catch (err) {
        console.error('Text extraction error:', err);
        res.status(500).json({ error: 'Failed to extract text from file' });
    }
});

module.exports = router;
