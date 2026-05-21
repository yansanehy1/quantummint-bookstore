const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const cron = require('node-cron');
const moment = require('moment');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Main Backend URL
const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:3000';

// Helper: Check if user has active subscription from main backend
async function checkSubscriptionAccess(userId, productId, token) {
  try {
    const response = await fetch(`${MAIN_BACKEND_URL}/api/subscriptions/check-access?bookId=${productId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.hasAccess ? data : null;
  } catch (error) {
    logger.error('Error calling main backend for subscription check:', error);
    return null;
  }
}

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
let pool, redisClient;

async function initializeConnections() {
  try {
    // PostgreSQL connection
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'quantummint_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    logger.info('PostgreSQL connected successfully');

    // Redis connection
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redisClient.connect();
    logger.info('Redis connected successfully');

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

// PayGO Wallet Management

// Get user wallet
app.get('/api/wallet', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    
    const result = await pool.query(`
      SELECT * FROM paygo_wallets 
      WHERE user_id = $1 AND is_active = true
    `, [userId]);

    if (result.rows.length === 0) {
      // Create wallet if it doesn't exist
      const newWallet = await pool.query(`
        INSERT INTO paygo_wallets (user_id, default_currency)
        VALUES ($1, 'SLL')
        RETURNING *
      `, [userId]);
      return res.json(newWallet.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add funds to wallet
app.post('/api/wallet/deposit', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { amount, currency, payment_method, payment_reference } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!['SLL', 'USD'].includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current wallet
      const walletResult = await client.query(`
        SELECT * FROM paygo_wallets 
        WHERE user_id = $1 AND is_active = true
        FOR UPDATE
      `, [userId]);

      if (walletResult.rows.length === 0) {
        throw new Error('Wallet not found');
      }

      const wallet = walletResult.rows[0];
      const leonesAmount = currency === 'SLL' ? amount : 0;
      const usdAmount = currency === 'USD' ? amount : 0;

      // Update wallet balance
      await client.query(`
        UPDATE paygo_wallets 
        SET 
          leones_balance = leones_balance + $1,
          usd_balance = usd_balance + $2,
          total_deposited_leones = total_deposited_leones + $1,
          total_deposited_usd = total_deposited_usd + $2,
          updated_at = NOW()
        WHERE user_id = $3
      `, [leonesAmount, usdAmount, userId]);

      // Create transaction record
      const newBalance = currency === 'SLL' 
        ? wallet.leones_balance + leonesAmount
        : wallet.usd_balance + usdAmount;

      await client.query(`
        INSERT INTO paygo_transactions (
          wallet_id, user_id, transaction_type, 
          leones_amount, usd_amount,
          leones_balance_before, leones_balance_after,
          usd_balance_before, usd_balance_after,
          payment_method, payment_reference, status
        ) VALUES (
          $1, $2, 'deposit',
          $3, $4,
          $5, $6,
          $7, $8,
          $9, $10, 'completed'
        )
      `, [
        wallet.id, userId, leonesAmount, usdAmount,
        wallet.leones_balance, newBalance,
        wallet.usd_balance, newBalance,
        payment_method, payment_reference
      ]);

      await client.query('COMMIT');

      // Get updated wallet
      const updatedWallet = await pool.query(`
        SELECT * FROM paygo_wallets WHERE user_id = $1
      `, [userId]);

      res.json({
        message: 'Deposit successful',
        wallet: updatedWallet.rows[0],
        transaction: {
          amount,
          currency,
          payment_method,
          payment_reference
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    logger.error('Error processing deposit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check balance for usage
app.get('/api/wallet/check-balance', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { required_leones = 0, required_usd = 0 } = req.query;

    const result = await pool.query(`
      SELECT * FROM check_paygo_balance($1, $2, $3)
    `, [userId, parseFloat(required_leones), parseFloat(required_usd)]);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error checking balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction history
app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = $1';
    const params = [userId];

    if (type) {
      whereClause += ' AND transaction_type = $2';
      params.push(type);
    }

    const transactions = await pool.query(`
      SELECT * FROM paygo_transactions 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, parseInt(limit), offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) as total FROM paygo_transactions ${whereClause}
    `, params);

    res.json({
      transactions: transactions.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Session Management

// Start usage session
app.post('/api/sessions/start', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { product_id, product_type, quality = '480p' } = req.body;

    // Validate product type
    if (!['video', 'audiobook', 'ebook', 'live_stream'].includes(product_type)) {
      return res.status(400).json({ error: 'Invalid product type' });
    }

    // Get applicable rate
    const rateResult = await pool.query(`
      SELECT * FROM paygo_rate_cards 
      WHERE product_type = $1 
      AND is_active = true 
      AND (valid_from <= NOW() AND (valid_until IS NULL OR valid_until > NOW()))
      ORDER BY is_default DESC, valid_from DESC
      LIMIT 1
    `, [product_type]);

    if (rateResult.rows.length === 0) {
      return res.status(400).json({ error: 'No rate card found for this product type' });
    }

    const rate = rateResult.rows[0];
    const sessionToken = generateSessionToken();

    // Check if user has an active subscription for this product
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const subscription = await checkSubscriptionAccess(userId, product_id, token);
    const isSponsored = !!subscription;

    if (!isSponsored) {
        // Check wallet balance only if not sponsored
        const balanceCheck = await pool.query(`
          SELECT * FROM check_paygo_balance($1, $2, $3)
        `, [userId, rate.rate_per_minute_leones, rate.rate_per_minute_usd]);

        if (!balanceCheck.rows[0].can_proceed) {
          return res.status(402).json({ 
            error: 'Insufficient balance',
            balance: balanceCheck.rows[0]
          });
        }
    }

    // Get user wallet
    const walletResult = await pool.query(`
      SELECT id FROM paygo_wallets WHERE user_id = $1 AND is_active = true
    `, [userId]);

    // Create session
    const sessionResult = await pool.query(`
      INSERT INTO paygo_sessions (
        wallet_id, user_id, session_token, product_id, product_type,
        rate_per_minute_leones, rate_per_minute_usd,
        max_quality, current_quality, started_at, last_heartbeat,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10)
      RETURNING *
    `, [
      walletResult.rows[0].id, userId, sessionToken, product_id, product_type,
      isSponsored ? 0 : rate.rate_per_minute_leones, 
      isSponsored ? 0 : rate.rate_per_minute_usd,
      quality, quality,
      JSON.stringify({ 
          is_sponsored: isSponsored, 
          subscription_id: subscription?.subscriptionId,
          group_id: subscription?.groupId
      })
    ]);

    res.json({
      session: sessionResult.rows[0],
      rate: isSponsored ? { ...rate, rate_per_minute_leones: 0, rate_per_minute_usd: 0 } : rate,
      is_sponsored: isSponsored
    });

  } catch (error) {
    logger.error('Error starting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update session heartbeat
app.post('/api/sessions/:sessionToken/heartbeat', authenticateToken, async (req, res) => {
  try {
    const { sessionToken } = req.params;
    const { userId } = req.user;

    const result = await pool.query(`
      UPDATE paygo_sessions 
      SET last_heartbeat = NOW()
      WHERE session_token = $1 AND user_id = $2 AND status = 'active'
      RETURNING *
    `, [sessionToken, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found or inactive' });
    }

    res.json({ 
      message: 'Heartbeat updated',
      session: result.rows[0]
    });

  } catch (error) {
    logger.error('Error updating heartbeat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// End session and calculate charges
app.post('/api/sessions/:sessionToken/end', authenticateToken, async (req, res) => {
  try {
    const { sessionToken } = req.params;
    const { userId } = req.user;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get session
      const sessionResult = await client.query(`
        SELECT * FROM paygo_sessions 
        WHERE session_token = $1 AND user_id = $2 AND status = 'active'
        FOR UPDATE
      `, [sessionToken, userId]);

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found or inactive');
      }

      const session = sessionResult.rows[0];
      const endTime = new Date();
      const durationSeconds = Math.floor((endTime - session.started_at) / 1000);

      // Calculate charges
      const chargeResult = await client.query(`
        SELECT * FROM calculate_paygo_charge($1, $2, $3, $4)
      `, [
        durationSeconds,
        session.rate_per_minute_leones,
        session.rate_per_minute_usd,
        1 // minimum minutes
      ]);

      const charge = chargeResult.rows[0];

      // Get wallet for balance update
      const walletResult = await client.query(`
        SELECT * FROM paygo_wallets WHERE id = $1 FOR UPDATE
      `, [session.wallet_id]);

      const wallet = walletResult.rows[0];

      // Check if sufficient balance
      if (wallet.leones_balance < charge.leones_charge && wallet.usd_balance < charge.usd_charge) {
        throw new Error('Insufficient balance to complete session');
      }

      // Update wallet balance (prefer SLL first)
      let leonesDeducted = Math.min(charge.leones_charge, wallet.leones_balance);
      let usdDeducted = 0;

      if (leonesDeducted < charge.leones_charge) {
        // Need to use USD for remaining amount
        const remainingLeones = charge.leones_charge - leonesDeducted;
        usdDeducted = Math.min(charge.usd_charge, wallet.usd_balance);
      }

      await client.query(`
        UPDATE paygo_wallets 
        SET 
          leones_balance = leones_balance - $1,
          usd_balance = usd_balance - $2,
          total_spent_leones = total_spent_leones + $1,
          total_spent_usd = total_spent_usd + $2,
          last_used_at = NOW()
        WHERE id = $3
      `, [leonesDeducted, usdDeducted, session.wallet_id]);

      // Create transaction record
      await client.query(`
        INSERT INTO paygo_transactions (
          wallet_id, user_id, transaction_type,
          leones_amount, usd_amount,
          leones_balance_before, leones_balance_after,
          usd_balance_before, usd_balance_after,
          service_type, product_id, product_title,
          start_time, end_time, duration_seconds, duration_minutes,
          rate_per_minute_leones, rate_per_minute_usd,
          status
        ) VALUES (
          $1, $2, 'charge',
          $3, $4,
          $5, $6,
          $7, $8,
          $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17,
          'completed'
        )
      `, [
        session.wallet_id, userId,
        -leonesDeducted, -usdDeducted,
        wallet.leones_balance, wallet.leones_balance - leonesDeducted,
        wallet.usd_balance, wallet.usd_balance - usdDeducted,
        session.product_type, session.product_id, `Session ${sessionToken}`,
        session.started_at, endTime, durationSeconds, charge.charged_minutes,
        session.rate_per_minute_leones, session.rate_per_minute_usd
      ]);

      // Update session
      await client.query(`
        UPDATE paygo_sessions 
        SET 
          ended_at = $1,
          total_duration_seconds = $2,
          accumulated_leones = $3,
          accumulated_usd = $4,
          status = 'ended'
        WHERE id = $5
      `, [endTime, durationSeconds, leonesDeducted, usdDeducted, session.id]);

      await client.query('COMMIT');

      res.json({
        message: 'Session ended successfully',
        session: {
          ...session,
          ended_at: endTime,
          total_duration_seconds: durationSeconds,
          accumulated_leones: leonesDeducted,
          accumulated_usd: usdDeducted
        },
        charges: charge,
        wallet_update: {
          leones_deducted: leonesDeducted,
          usd_deducted: usdDeducted
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    logger.error('Error ending session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active sessions
app.get('/api/sessions/active', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(`
      SELECT * FROM paygo_sessions 
      WHERE user_id = $1 AND status = 'active'
      ORDER BY started_at DESC
    `, [userId]);

    res.json({ sessions: result.rows });
  } catch (error) {
    logger.error('Error fetching active sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Report discrete usage (e.g., TTS synthesis or per-action charge)
app.post('/api/usage/report', async (req, res) => {
  try {
    const { userId, productId, productType, durationSeconds, metadata } = req.body;

    if (!userId || !productType || durationSeconds === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const durationMinutes = durationSeconds / 60;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Get rate card
      const rateResult = await client.query(`
        SELECT * FROM paygo_rate_cards 
        WHERE product_type = $1 AND is_active = true
        ORDER BY is_default DESC LIMIT 1
      `, [productType]);

      if (rateResult.rows.length === 0) {
        throw new Error(`No rate card found for ${productType}`);
      }

      const rate = rateResult.rows[0];
      const leonesCharge = durationMinutes * rate.rate_per_minute_leones;
      const usdCharge = durationMinutes * rate.rate_per_minute_usd;

      // 2. Get wallet
      const walletResult = await client.query(`
        SELECT * FROM paygo_wallets WHERE user_id = $1 AND is_active = true FOR UPDATE
      `, [userId]);

      if (walletResult.rows.length === 0) {
        throw new Error('Wallet not found');
      }

      const wallet = walletResult.rows[0];

      // 3. Deduct from wallet
      await client.query(`
        UPDATE paygo_wallets 
        SET 
          leones_balance = leones_balance - $1,
          usd_balance = usd_balance - $2,
          total_spent_leones = total_spent_leones + $1,
          total_spent_usd = total_spent_usd + $2,
          updated_at = NOW()
        WHERE id = $3
      `, [leonesCharge, usdCharge, wallet.id]);

      // 4. Record transaction
      await client.query(`
        INSERT INTO paygo_transactions ( 
          wallet_id, user_id, transaction_type, 
          leones_amount, usd_amount,
          leones_balance_before, leones_balance_after,
          usd_balance_before, usd_balance_after,
          service_type, product_id, duration_seconds, duration_minutes,
          rate_per_minute_leones, rate_per_minute_usd, status, metadata
        ) VALUES (
          $1, $2, 'charge',
          $3, $4,
          $5, $5 - $3,
          $6, $6 - $4,
          $7, $8, $9, $10,
          $11, $12, 'completed', $13
        )
      `, [
        wallet.id, userId, leonesCharge, usdCharge,
        wallet.leones_balance, wallet.usd_balance,
        productType, productId, durationSeconds, durationMinutes,
        rate.rate_per_minute_leones, rate.rate_per_minute_usd,
        JSON.stringify(metadata || {})
      ]);

      await client.query('COMMIT');
      res.json({ message: 'Usage reported and charged', chargeLeones: leonesCharge, chargeUsd: usdCharge });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Error reporting usage:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Utility functions
function generateSessionToken() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Scheduled tasks

// Clean up expired sessions (every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  try {
    const result = await pool.query(`
      UPDATE paygo_sessions 
      SET status = 'expired', ended_reason = 'inactivity_timeout'
      WHERE status = 'active' 
      AND last_heartbeat < NOW() - INTERVAL '5 minutes'
      RETURNING *
    `);

    if (result.rows.length > 0) {
      logger.info(`Cleaned up ${result.rows.length} expired sessions`);
    }
  } catch (error) {
    logger.error('Error cleaning up expired sessions:', error);
  }
});

// Auto-topup processing (every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const result = await pool.query(`
      SELECT * FROM paygo_wallets 
      WHERE auto_topup_enabled = true 
      AND is_active = true
      AND (
        leones_balance < auto_topup_threshold 
        OR usd_balance < auto_topup_threshold
      )
    `);

    for (const wallet of result.rows) {
      // Process auto-topup (would integrate with payment provider)
      logger.info(`Processing auto-topup for user ${wallet.user_id}`);
    }
  } catch (error) {
    logger.error('Error processing auto-topups:', error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'paygo-service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8007;

async function startServer() {
  await initializeConnections();
  
  app.listen(PORT, () => {
    logger.info(`PayGO Service running on port ${PORT}`);
  });
}

startServer().catch(console.error);

module.exports = app;
