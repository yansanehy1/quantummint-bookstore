const express = require('express');
const router = express.Router();
const learnerController = require('../controllers/learnerController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Notes
router.get('/notes', learnerController.getNotes);
router.post('/notes', learnerController.createNote);
router.delete('/notes/:id', learnerController.deleteNote);

// SRS (Spaced Repetition System)
router.get('/srs/due', learnerController.getDueNotes);
router.post('/srs/review/:id', learnerController.reviewNote);

// Reading Sessions
router.post('/sessions/start', learnerController.startSession);
router.put('/sessions/:id', learnerController.updateSession);
router.get('/analytics', learnerController.getAnalytics);

// Leaderboards
router.get('/leaderboard', learnerController.getLeaderboard);

// Recommendations
router.get('/recommendations', learnerController.getRecommendations);

// Quizzes
router.get('/quiz', learnerController.getQuiz);

module.exports = router;
