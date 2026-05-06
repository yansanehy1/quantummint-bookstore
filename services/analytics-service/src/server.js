const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require('mysql2/promise');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const moment = require('moment');
const _ = require('lodash');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});

// Database connections
let db, redisClient;

async function initializeConnections() {
  try {
    // MySQL connection
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quantummint_db',
      charset: 'utf8mb4'
    });

    // Redis connection
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redisClient.connect();

    logger.info('Analytics service database connections established');
  } catch (error) {
    logger.error('Failed to connect to databases:', error);
    process.exit(1);
  }
}

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Analytics event tracking
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const {
      book_id,
      page_id,
      event_type,
      event_data,
      session_id,
      ip_address,
      user_agent
    } = req.body;

    await db.execute(`
      INSERT INTO AnalyticsEvents (
        user_id, book_id, page_id, event_type, event_data,
        session_id, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id, book_id, page_id, event_type,
      JSON.stringify(event_data || {}), session_id, ip_address, user_agent
    ]);

    // Update real-time metrics in Redis
    const eventKey = `events:${event_type}:${moment().format('YYYY-MM-DD')}`;
    await redisClient.incr(eventKey);
    await redisClient.expire(eventKey, 86400); // 24 hours

    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    logger.error('Error tracking event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user engagement analytics
app.get('/api/analytics/user/:userId/engagement', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30' } = req.query; // days

    const startDate = moment().subtract(parseInt(period), 'days').format('YYYY-MM-DD');

    // Get reading sessions
    const [sessions] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT session_id) as sessions,
        SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as page_views,
        SUM(CASE WHEN event_type = 'audio_play' THEN 1 ELSE 0 END) as audio_plays,
        AVG(CASE WHEN event_type = 'progress_update' THEN JSON_EXTRACT(event_data, '$.time_spent') ELSE 0 END) as avg_session_time
      FROM AnalyticsEvents
      WHERE user_id = ? AND created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [userId, startDate]);

    // Get completion rates
    const [completions] = await db.execute(`
      SELECT 
        b.title,
        rp.completion_percentage,
        rp.time_spent,
        rp.last_accessed_at
      FROM ReadingProgress rp
      JOIN Books b ON rp.book_id = b.id
      WHERE rp.user_id = ?
      ORDER BY rp.last_accessed_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      sessions,
      completions,
      period: `${period} days`
    });
  } catch (error) {
    logger.error('Error fetching user engagement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book performance analytics
app.get('/api/analytics/book/:bookId/performance', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;

    // Get basic stats
    const [stats] = await db.execute(`
      SELECT 
        COUNT(DISTINCT ae.user_id) as unique_readers,
        COUNT(DISTINCT ae.session_id) as total_sessions,
        SUM(CASE WHEN ae.event_type = 'page_view' THEN 1 ELSE 0 END) as total_page_views,
        AVG(rp.completion_percentage) as avg_completion_rate,
        b.total_purchases,
        b.total_views,
        b.average_rating
      FROM Books b
      LEFT JOIN AnalyticsEvents ae ON b.id = ae.book_id
      LEFT JOIN ReadingProgress rp ON b.id = rp.book_id
      WHERE b.id = ?
    `, [bookId]);

    // Get engagement over time
    const [engagement] = await db.execute(`
      SELECT 
        DATE(ae.created_at) as date,
        COUNT(DISTINCT ae.user_id) as daily_active_users,
        COUNT(DISTINCT ae.session_id) as daily_sessions,
        SUM(CASE WHEN ae.event_type = 'page_view' THEN 1 ELSE 0 END) as daily_page_views
      FROM AnalyticsEvents ae
      WHERE ae.book_id = ? AND ae.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(ae.created_at)
      ORDER BY date DESC
    `, [bookId]);

    // Get popular pages
    const [popularPages] = await db.execute(`
      SELECT 
        bp.page_number,
        bp.title,
        COUNT(ae.id) as views,
        AVG(rp.time_spent) as avg_time_spent
      FROM BookPages bp
      LEFT JOIN AnalyticsEvents ae ON bp.id = ae.page_id AND ae.event_type = 'page_view'
      LEFT JOIN ReadingProgress rp ON bp.id = rp.page_id
      WHERE bp.book_id = ?
      GROUP BY bp.id, bp.page_number, bp.title
      ORDER BY views DESC
      LIMIT 10
    `, [bookId]);

    res.json({
      stats: stats[0],
      engagement,
      popularPages
    });
  } catch (error) {
    logger.error('Error fetching book performance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform overview analytics (admin only)
app.get('/api/analytics/platform/overview', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get key metrics
    const [metrics] = await db.execute(`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN u.role = 'educator' THEN u.id END) as total_educators,
        COUNT(DISTINCT b.id) as total_books,
        COUNT(DISTINCT CASE WHEN b.is_published = true THEN b.id END) as published_books,
        SUM(b.total_purchases) as total_purchases,
        AVG(b.average_rating) as avg_rating,
        COUNT(DISTINCT ae.session_id) as total_sessions
      FROM Users u
      CROSS JOIN Books b
      LEFT JOIN AnalyticsEvents ae ON DATE(ae.created_at) = CURDATE()
    `);

    // Get daily active users (last 7 days)
    const [dailyActive] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as daily_active_users
      FROM AnalyticsEvents
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Get top categories
    const [topCategories] = await db.execute(`
      SELECT 
        c.name,
        COUNT(b.id) as book_count,
        SUM(b.total_purchases) as total_purchases,
        AVG(b.average_rating) as avg_rating
      FROM Categories c
      LEFT JOIN Books b ON c.id = (
        CASE 
          WHEN b.category = c.name THEN c.id
          ELSE NULL
        END
      )
      GROUP BY c.id, c.name
      ORDER BY book_count DESC
      LIMIT 10
    `);

    res.json({
      metrics: metrics[0],
      dailyActive,
      topCategories
    });
  } catch (error) {
    logger.error('Error fetching platform overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get learning insights
app.get('/api/analytics/insights/learning', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Learning patterns
    const [patterns] = await db.execute(`
      SELECT 
        HOUR(ae.created_at) as hour_of_day,
        DAYOFWEEK(ae.created_at) as day_of_week,
        COUNT(*) as activity_count
      FROM AnalyticsEvents ae
      WHERE ae.user_id = ? AND ae.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY HOUR(ae.created_at), DAYOFWEEK(ae.created_at)
      ORDER BY activity_count DESC
      LIMIT 10
    `, [userId]);

    // Subject preferences
    const [preferences] = await db.execute(`
      SELECT 
        c.name as category,
        COUNT(DISTINCT b.id) as books_read,
        AVG(rp.completion_percentage) as avg_completion,
        SUM(rp.time_spent) as total_time
      FROM ReadingProgress rp
      JOIN Books b ON rp.book_id = b.id
      JOIN Categories c ON b.category = c.name
      WHERE rp.user_id = ?
      GROUP BY c.id, c.name
      ORDER BY total_time DESC
    `, [userId]);

    // Learning streak
    const [streak] = await db.execute(`
      WITH consecutive_days AS (
        SELECT 
          DATE(created_at) as activity_date,
          ROW_NUMBER() OVER (ORDER BY DATE(created_at)) as rn,
          DATE_SUB(DATE(created_at), INTERVAL ROW_NUMBER() OVER (ORDER BY DATE(created_at)) DAY) as group_date
        FROM AnalyticsEvents
        WHERE user_id = ? AND event_type IN ('page_view', 'audio_play')
        GROUP BY DATE(created_at)
      )
      SELECT COUNT(*) as current_streak
      FROM consecutive_days
      WHERE group_date = (
        SELECT MAX(group_date)
        FROM consecutive_days
      )
    `, [userId]);

    res.json({
      patterns,
      preferences,
      currentStreak: streak[0]?.current_streak || 0
    });
  } catch (error) {
    logger.error('Error fetching learning insights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'analytics-service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8006;

async function startServer() {
  await initializeConnections();
  
  app.listen(PORT, () => {
    logger.info(`Analytics Service running on port ${PORT}`);
  });
}

startServer().catch(console.error);

module.exports = app;
