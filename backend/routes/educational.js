const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const winston = require('winston');
const { authenticateToken } = require('../middleware/authMiddleware');

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Database connection
let db;

async function initializeDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quantummint_db',
      charset: 'utf8mb4'
    });
  }
  return db;
}

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const connection = await initializeDB();
    const [categories] = await connection.execute(`
      SELECT * FROM Categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get books with educational metadata
router.get('/books', async (req, res) => {
  try {
    const connection = await initializeDB();
    const { category, difficulty, page, limit } = req.query;

    const pageNum = (() => {
      const parsed = parseInt(page, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    })();
    const limitNum = (() => {
      const parsed = parseInt(limit, 10);
      // Cap limit to avoid expensive queries / accidental DoS.
      return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 50) : 20;
    })();
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE b.is_published = true';
    const params = [];

    if (category != null) {
      if (typeof category !== 'string' || category.trim().length === 0 || category.length > 100) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      whereClause += ' AND b.category = ?';
      params.push(category.trim());
    }

    if (difficulty != null) {
      if (typeof difficulty !== 'string') {
        return res.status(400).json({ error: 'Invalid difficulty' });
      }
      const allowed = new Set(['beginner', 'intermediate', 'advanced']);
      if (!allowed.has(difficulty)) {
        return res.status(400).json({ error: 'Invalid difficulty' });
      }
      whereClause += ' AND b.difficulty_level = ?';
      params.push(difficulty);
    }

    const [books] = await connection.execute(`
      SELECT 
        b.*,
        u.name as author_name,
        c.name as category_name,
        (SELECT COUNT(*) FROM UserReviews ur WHERE ur.book_id = b.id) as review_count
      FROM Books b
      LEFT JOIN Users u ON b.sellerId = u.id
      LEFT JOIN Categories c ON b.category = c.name
      ${whereClause}
      ORDER BY b.average_rating DESC, b.total_purchases DESC
      LIMIT ? OFFSET ?
    `, [...params, limitNum, offset]);

    const [totalCount] = await connection.execute(`
      SELECT COUNT(*) as total FROM Books b ${whereClause}
    `, params);

    res.json({
      books,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount[0].total,
        pages: Math.ceil(totalCount[0].total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book details with pages and cues
router.get('/books/:id', async (req, res) => {
  try {
    const connection = await initializeDB();
    const { id } = req.params;

    // Get book details
    const [books] = await connection.execute(`
      SELECT 
        b.*,
        u.name as author_name,
        c.name as category_name
      FROM Books b
      LEFT JOIN Users u ON b.sellerId = u.id
      LEFT JOIN Categories c ON b.category = c.name
      WHERE b.id = ?
    `, [id]);

    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = books[0];

    // Get book pages
    const [pages] = await connection.execute(`
      SELECT * FROM BookPages 
      WHERE book_id = ? 
      ORDER BY page_number ASC
    `, [id]);

    // Get media cues
    const [cues] = await connection.execute(`
      SELECT * FROM MediaCues 
      WHERE book_id = ? AND is_active = true 
      ORDER BY timestamp_ms ASC
    `, [id]);

    // Get user reviews
    const [reviews] = await connection.execute(`
      SELECT 
        ur.*,
        u.name as reviewer_name
      FROM UserReviews ur
      LEFT JOIN Users u ON ur.user_id = u.id
      WHERE ur.book_id = ? AND ur.is_published = true
      ORDER BY ur.created_at DESC
      LIMIT 10
    `, [id]);

    res.json({
      ...book,
      pages,
      cues,
      reviews
    });
  } catch (error) {
    logger.error('Error fetching book details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user achievements
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const connection = await initializeDB();
    const userId = req.user.id;

    // Get all available achievements
    const [allAchievements] = await connection.execute(`
      SELECT * FROM Achievements 
      WHERE is_active = true 
      ORDER BY points_value DESC
    `);

    // Get user's earned achievements
    const [userAchievements] = await connection.execute(`
      SELECT 
        ua.*,
        a.name,
        a.description,
        a.badge_icon_url,
        a.points_value
      FROM UserAchievements ua
      JOIN Achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
      ORDER BY ua.earned_at DESC
    `, [userId]);

    // Mark which achievements are earned
    const achievementsWithStatus = allAchievements.map(achievement => ({
      ...achievement,
      earned: userAchievements.some(ua => ua.achievement_id === achievement.id),
      earned_at: userAchievements.find(ua => ua.achievement_id === achievement.id)?.earned_at
    }));

    res.json({
      achievements: achievementsWithStatus,
      earned: userAchievements,
      total_points: userAchievements.reduce((sum, ua) => sum + ua.points_value, 0)
    });
  } catch (error) {
    logger.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Award achievement
router.post('/achievements/:achievementId/award', authenticateToken, async (req, res) => {
  try {
    const connection = await initializeDB();
    const userId = req.user.id;
    const { achievementId } = req.params;

    // Check if achievement exists and is active
    const [achievement] = await connection.execute(`
      SELECT * FROM Achievements 
      WHERE id = ? AND is_active = true
    `, [achievementId]);

    if (achievement.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Check if user already has this achievement
    const [existing] = await connection.execute(`
      SELECT * FROM UserAchievements 
      WHERE user_id = ? AND achievement_id = ?
    `, [userId, achievementId]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Achievement already earned' });
    }

    // Award achievement
    await connection.execute(`
      INSERT INTO UserAchievements (user_id, achievement_id)
      VALUES (?, ?)
    `, [userId, achievementId]);

    res.json({
      message: 'Achievement awarded successfully',
      achievement: achievement[0]
    });
  } catch (error) {
    logger.error('Error awarding achievement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user reading progress
router.get('/progress/:bookId', authenticateToken, async (req, res) => {
  try {
    const connection = await initializeDB();
    const userId = req.user.id;
    const { bookId } = req.params;

    const [progress] = await connection.execute(`
      SELECT 
        rp.*,
        bp.page_number,
        bp.title as page_title
      FROM ReadingProgress rp
      JOIN BookPages bp ON rp.page_id = bp.id
      WHERE rp.user_id = ? AND rp.book_id = ?
      ORDER BY rp.last_accessed_at DESC
    `, [userId, bookId]);

    res.json(progress);
  } catch (error) {
    logger.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reading progress
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    const connection = await initializeDB();
    const userId = req.user.id;
    const {
      book_id,
      page_id,
      current_position,
      completion_percentage,
      time_spent
    } = req.body;

    const bookId = book_id;
    const pageId = parseInt(page_id, 10);
    const currentPositionNum = Number(current_position);
    const completionNum = Number(completion_percentage);
    const timeSpentNum = Number(time_spent);

    if (!bookId) {
      return res.status(400).json({ error: 'Missing book_id' });
    }
    if (!Number.isFinite(pageId) || pageId <= 0) {
      return res.status(400).json({ error: 'Invalid page_id' });
    }
    if (!Number.isFinite(currentPositionNum) || currentPositionNum < 0) {
      return res.status(400).json({ error: 'Invalid current_position' });
    }
    if (!Number.isFinite(completionNum) || completionNum < 0 || completionNum > 100) {
      return res.status(400).json({ error: 'Invalid completion_percentage' });
    }
    if (!Number.isFinite(timeSpentNum) || timeSpentNum < 0 || timeSpentNum > 31536000) {
      // Cap to ~1 year of seconds to prevent extreme values / storage abuse.
      return res.status(400).json({ error: 'Invalid time_spent' });
    }

    // Data integrity: ensure this page belongs to this book.
    const [pageRows] = await connection.execute(`
      SELECT id FROM BookPages WHERE id = ? AND book_id = ?
    `, [pageId, bookId]);
    if (pageRows.length === 0) {
      return res.status(400).json({ error: 'Invalid page_id for the given book_id' });
    }

    await connection.execute(`
      INSERT INTO ReadingProgress (
        user_id, book_id, page_id, current_position, 
        completion_percentage, time_spent
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        current_position = VALUES(current_position),
        completion_percentage = VALUES(completion_percentage),
        time_spent = time_spent + VALUES(time_spent),
        last_accessed_at = CURRENT_TIMESTAMP
    `, [userId, bookId, pageId, currentPositionNum, completionNum, timeSpentNum]);

    // Check for achievement unlocks
    await checkAchievements(connection, userId, bookId);

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    logger.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to check and award achievements
async function checkAchievements(connection, userId, bookId) {
  try {
    // Check for first purchase achievement
    const [purchaseCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM Purchases WHERE user_id = ?
    `, [userId]);

    if (purchaseCount[0].count === 1) {
      const [firstPurchaseAchievement] = await connection.execute(`
        SELECT id FROM Achievements WHERE criteria LIKE '%first_purchase%'
      `);
      
      if (firstPurchaseAchievement.length > 0) {
        await connection.execute(`
          INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
          VALUES (?, ?)
        `, [userId, firstPurchaseAchievement[0].id]);
      }
    }

    // Check for reading streak achievement
    const [streakData] = await connection.execute(`
      WITH consecutive_days AS (
        SELECT 
          DATE(last_accessed_at) as activity_date,
          ROW_NUMBER() OVER (ORDER BY DATE(last_accessed_at)) as rn,
          DATE_SUB(DATE(last_accessed_at), INTERVAL ROW_NUMBER() OVER (ORDER BY DATE(last_accessed_at)) DAY) as group_date
        FROM ReadingProgress
        WHERE user_id = ?
        GROUP BY DATE(last_accessed_at)
        ORDER BY activity_date DESC
      )
      SELECT COUNT(*) as current_streak
      FROM consecutive_days
      WHERE group_date = (SELECT MAX(group_date) FROM consecutive_days)
    `, [userId]);

    const currentStreak = streakData[0]?.current_streak || 0;

    if (currentStreak >= 7) {
      const [streakAchievement] = await connection.execute(`
        SELECT id FROM Achievements WHERE criteria LIKE '%daily_streak%' AND criteria LIKE '%7%'
      `);
      
      if (streakAchievement.length > 0) {
        await connection.execute(`
          INSERT IGNORE INTO UserAchievements (user_id, achievement_id)
          VALUES (?, ?)
        `, [userId, streakAchievement[0].id]);
      }
    }

  } catch (error) {
    logger.error('Error checking achievements:', error);
  }
}

// Submit book review
router.post('/books/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const connection = await initializeDB();
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, review_text } = req.body;

    const ratingNum = Number(rating);
    const reviewText = review_text == null ? null : review_text;

    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (reviewText != null) {
      if (typeof reviewText !== 'string') {
        return res.status(400).json({ error: 'Invalid review_text' });
      }
      const trimmed = reviewText.trim();
      if (trimmed.length > 2000) {
        return res.status(400).json({ error: 'review_text is too long' });
      }
    }

    // Check if user has purchased the book
    const [purchase] = await connection.execute(`
      SELECT * FROM Purchases WHERE user_id = ? AND book_id = ?
    `, [userId, id]);

    if (purchase.length === 0) {
      return res.status(403).json({ error: 'You must purchase the book before reviewing' });
    }

    // Insert or update review
    await connection.execute(`
      INSERT INTO UserReviews (user_id, book_id, rating, review_text)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        review_text = VALUES(review_text),
        updated_at = CURRENT_TIMESTAMP
    `, [userId, id, ratingNum, reviewText]);

    // Update book average rating
    const [avgRating] = await connection.execute(`
      SELECT AVG(rating) as avg_rating FROM UserReviews WHERE book_id = ? AND is_published = true
    `, [id]);

    const nextAvg = avgRating?.[0]?.avg_rating ?? 0;
    await connection.execute(`
      UPDATE Books SET average_rating = ? WHERE id = ?
    `, [nextAvg, id]);

    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    logger.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
