const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require('mysql2/promise');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const winston = require('winston');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

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

    logger.info('Database connections established');
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

// API Routes

// Get media cues for a book
app.get('/api/cues/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Check cache first
    const cacheKey = `cues:${bookId}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Fetch from database
    const [cues] = await db.execute(`
      SELECT 
        mc.*,
        bp.page_number,
        bp.title as page_title
      FROM MediaCues mc
      JOIN BookPages bp ON mc.page_id = bp.id
      WHERE mc.book_id = ? AND mc.is_active = true
      ORDER BY mc.timestamp_ms ASC
    `, [bookId]);

    // Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(cues));
    
    res.json(cues);
  } catch (error) {
    logger.error('Error fetching cues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add media cue
app.post('/api/cues', authenticateToken, async (req, res) => {
  try {
    const {
      book_id,
      page_id,
      cue_type,
      timestamp_ms,
      content,
      metadata,
      position_data
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO MediaCues (
        book_id, page_id, cue_type, timestamp_ms, 
        content, metadata, position_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      book_id, page_id, cue_type, timestamp_ms,
      content, JSON.stringify(metadata || {}), JSON.stringify(position_data || {})
    ]);

    // Clear cache
    await redisClient.del(`cues:${book_id}`);

    // Broadcast to connected clients
    io.emit('cueAdded', {
      id: result.insertId,
      book_id,
      page_id,
      cue_type,
      timestamp_ms,
      content,
      metadata,
      position_data
    });

    res.status(201).json({ id: result.insertId, message: 'Cue added successfully' });
  } catch (error) {
    logger.error('Error adding cue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reading progress
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { book_id, page_id, current_position, completion_percentage, time_spent } = req.body;

    await db.execute(`
      INSERT INTO ReadingProgress (
        user_id, book_id, page_id, current_position, 
        completion_percentage, time_spent
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        current_position = VALUES(current_position),
        completion_percentage = VALUES(completion_percentage),
        time_spent = time_spent + VALUES(time_spent),
        last_accessed_at = CURRENT_TIMESTAMP
    `, [user_id, book_id, page_id, current_position, completion_percentage, time_spent]);

    // Cache progress
    const progressKey = `progress:${user_id}:${book_id}`;
    await redisClient.setEx(progressKey, 1800, JSON.stringify({
      current_position,
      completion_percentage,
      time_spent,
      last_accessed: new Date().toISOString()
    }));

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    logger.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reading progress
app.get('/api/progress/:userId/:bookId', authenticateToken, async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    
    // Check cache first
    const progressKey = `progress:${userId}:${bookId}`;
    const cached = await redisClient.get(progressKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const [progress] = await db.execute(`
      SELECT 
        current_position,
        completion_percentage,
        time_spent,
        last_accessed_at
      FROM ReadingProgress
      WHERE user_id = ? AND book_id = ?
      ORDER BY last_accessed_at DESC
      LIMIT 1
    `, [userId, bookId]);

    if (progress.length > 0) {
      await redisClient.setEx(progressKey, 1800, JSON.stringify(progress[0]));
      res.json(progress[0]);
    } else {
      res.json(null);
    }
  } catch (error) {
    logger.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Join book room for real-time sync
  socket.on('joinBook', (bookId) => {
    socket.join(`book:${bookId}`);
    logger.info(`Client ${socket.id} joined book ${bookId}`);
  });

  // Handle real-time position updates
  socket.on('positionUpdate', async (data) => {
    const { bookId, userId, position, pageId } = data;
    
    // Broadcast to other users in the same book (for collaborative features)
    socket.to(`book:${bookId}`).emit('userPosition', {
      userId,
      position,
      pageId,
      timestamp: Date.now()
    });

    // Cache position for quick access
    const positionKey = `position:${userId}:${bookId}`;
    await redisClient.setEx(positionKey, 300, JSON.stringify({
      position,
      pageId,
      timestamp: Date.now()
    }));
  });

  // Handle trigger events for media cues
  socket.on('triggerCue', (data) => {
    const { bookId, cueId, timestamp } = data;
    
    // Broadcast cue trigger to all users in the book
    io.to(`book:${bookId}`).emit('cueTriggered', {
      cueId,
      timestamp,
      triggeredBy: socket.id
    });
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'media-sync-service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8004;

async function startServer() {
  await initializeConnections();
  
  server.listen(PORT, () => {
    logger.info(`Media Sync Service running on port ${PORT}`);
  });
}

startServer().catch(console.error);

module.exports = app;
