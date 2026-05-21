const { Note, ReadingSession, Quiz, User, Book, Subscription } = require('../models');
const { uuidv4 } = require('../utils/id');
const educationalContentService = require('../services/educationalContentService');
const subscriptionAccessService = require('../services/subscriptionAccessService');
const { Sequelize } = require('sequelize');
const { main: logger } = require('../utils/logger');

/**
 * Notes
 */
exports.getNotes = async (req, res) => {
    try {
        const { bookId } = req.query;
        const where = { userId: req.user.id };
        if (bookId) where.bookId = bookId;

        const notes = await Note.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(notes);
    } catch (error) {
        logger.error('[LearnerController] Get Notes Error:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { bookId, pageId, content, color, highlightText } = req.body;
        const note = await Note.create({
            id: uuidv4(),
            userId: req.user.id,
            bookId,
            pageId,
            content,
            color,
            highlightText
        });
        logger.info(`[LearnerController] Note created: ${note.id} for book ${bookId} by user ${req.user.id}`);
        res.status(201).json(note);
    } catch (error) {
        logger.error('[LearnerController] Create Note Error:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Note.destroy({ where: { id, userId: req.user.id } });
        if (deleted) {
            logger.info(`[LearnerController] Note deleted: ${id} by user ${req.user.id}`);
        }
        res.json({ success: true });
    } catch (error) {
        logger.error('[LearnerController] Delete Note Error:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
};

/**
 * Spaced Repetition (SRS)
 */
exports.getDueNotes = async (req, res) => {
    try {
        const notes = await Note.findAll({
            where: {
                userId: req.user.id,
                nextReview: { [Sequelize.Op.lte]: new Date() }
            },
            include: [{ model: Book, attributes: ['title', 'coverUrl'] }],
            order: [['nextReview', 'ASC']]
        });
        res.json(notes);
    } catch (error) {
        logger.error('[LearnerController] Get Due Notes Error:', error);
        res.status(500).json({ error: 'Failed to fetch due notes' });
    }
};

exports.reviewNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body; // 1: Again, 2: Hard, 3: Good, 4: Easy

        const note = await Note.findOne({ where: { id, userId: req.user.id } });
        if (!note) return res.status(404).json({ error: 'Note not found' });

        logger.info(`[LearnerController] Reviewing note ${id} with rating ${rating}`);

        let { interval, easeFactor, repetitionCount } = note;

        // SM-2 Algorithm Implementation
        if (rating >= 3) { // Correct response
            if (repetitionCount === 0) {
                interval = 1;
            } else if (repetitionCount === 1) {
                interval = 6;
            } else {
                interval = Math.ceil(interval * easeFactor);
            }
            repetitionCount += 1;
            // Adjust ease factor
            easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        } else { // Incorrect response
            repetitionCount = 0;
            interval = 1;
        }

        if (easeFactor < 1.3) easeFactor = 1.3;

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        await note.update({
            interval,
            easeFactor,
            repetitionCount,
            nextReview
        });

        res.json({ success: true, nextReview, interval });
    } catch (error) {
        logger.error('[LearnerController] Review Note Error:', error);
        res.status(500).json({ error: 'Failed to review note' });
    }
};

/**
 * Reading Sessions
 */
exports.startSession = async (req, res) => {
    try {
        const { bookId } = req.body;
        
        // Check if user has an active subscription for this book
        const subscription = await subscriptionAccessService.checkSubscriptionAccess(req.user.id, bookId);
        const isSponsored = !!subscription;

        const session = await ReadingSession.create({
            id: uuidv4(),
            userId: req.user.id,
            bookId,
            startTime: new Date(),
            pagesRead: [],
            durationSeconds: 0,
            metadata: {
                isSponsored,
                subscriptionId: subscription ? subscription.id : null,
                groupId: subscription ? subscription.groupId : null
            }
        });

        logger.info(`[LearnerController] Reading session started: ${session.id} for book ${bookId} by user ${req.user.id} (Sponsored: ${isSponsored})`);

        res.status(201).json({
            ...session.toJSON(),
            isSponsored
        });
    } catch (error) {
        logger.error('[LearnerController] Start Session Error:', error);
        res.status(500).json({ error: 'Failed to start reading session' });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { pagesRead, durationSeconds } = req.body;

        const session = await ReadingSession.findOne({ where: { id, userId: req.user.id } });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        if (pagesRead) session.pagesRead = [...new Set([...session.pagesRead, ...pagesRead])];
        if (durationSeconds) session.durationSeconds += durationSeconds;
        
        await session.save();
        res.json(session);
    } catch (error) {
        logger.error('[LearnerController] Update Session Error:', error);
        res.status(500).json({ error: 'Failed to update reading session' });
    }
};

/**
 * Analytics
 */
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Mocking some stats for now - in production, aggregate from ReadingSessions
        const sessions = await ReadingSession.findAll({ where: { userId } });
        const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationSeconds / 60), 0);
        const booksRead = new Set(sessions.map(s => s.bookId)).size;

        res.json({
            totalReadingTime: Math.round(totalMinutes),
            booksRead,
            streak: 5, // Mock streak
            dailyProgress: [
                { date: '2024-05-15', minutes: 45 },
                { date: '2024-05-16', minutes: 30 },
                { date: '2024-05-17', minutes: 60 },
                { date: '2024-05-18', minutes: 20 },
                { date: '2024-05-19', minutes: 50 },
            ]
        });
    } catch (error) {
        logger.error('[LearnerController] Get Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

/**
 * Leaderboards
 */
exports.getLeaderboard = async (req, res) => {
    try {
        // Mock leaderboard
        res.json([
            { id: '1', name: 'Alice', readingTime: 1250, rank: 1 },
            { id: '2', name: 'Bob', readingTime: 980, rank: 2 },
            { id: '3', name: 'Charlie', readingTime: 850, rank: 3 },
            { id: '4', name: 'David', readingTime: 720, rank: 4 },
            { id: '5', name: 'Eve', readingTime: 600, rank: 5 },
        ]);
    } catch (error) {
        logger.error('[LearnerController] Get Leaderboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

/**
 * Recommendations
 */
exports.getRecommendations = async (req, res) => {
    try {
        const books = await Book.findAll({ 
            where: { status: 'approved' },
            limit: 5,
            order: [Sequelize.literal('RAND()')]
        });
        res.json(books);
    } catch (error) {
        logger.error('[LearnerController] Get Recommendations Error:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

/**
 * Quizzes
 */
exports.getQuiz = async (req, res) => {
    try {
        const { bookId, chapterId } = req.query;
        const quiz = await Quiz.findOne({
            where: { bookId, chapterId: chapterId || null }
        });

        if (!quiz) {
            // If no quiz exists, generate one on-the-fly via educationalContentService
            const book = await Book.findByPk(bookId);
            const content = book.description; // Fallback to description if no chapter content
            const generated = await educationalContentService.generateQuiz(bookId, chapterId, content);
            return res.json(generated);
        }

        res.json(quiz);
    } catch (error) {
        logger.error('[LearnerController] Get Quiz Error:', error);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
};
