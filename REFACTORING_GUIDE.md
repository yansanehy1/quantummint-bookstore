# QuantumMint Refactoring Quick Reference

**Last Updated:** March 11, 2026

---

## 📁 File Structure Changes

### New Files Created

```
backend/
├── middleware/
│   ├── asyncHandler.js          [NEW] Async error wrapper
│   └── errorHandler.js          [NEW] Centralized error handler
├── utils/
│   └── logger.js                [NEW] Winston structured logger
├── services/
│   ├── walletService.js         [NEW] Wallet operations
│   ├── paymentService.js        [NEW] Payment operations
│   └── purchaseService.js       [NEW] Purchase operations
└── test-api.js                  [NEW] API testing script

root/
├── APPLICATION_FEATURES.md      [NEW] Feature documentation
└── SESSION_SUMMARY.md           [NEW] Session summary
```

---

## 🔄 Middleware Refactoring

### asyncHandler Middleware

**Purpose:** Wrap async route handlers to catch promise rejections

**File:** `backend/middleware/asyncHandler.js`
```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
```

**Usage in Route:**
```javascript
// Before: Manual try/catch
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    await paymentController.initiateDeposit(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// After: Clean with asyncHandler
router.post('/deposit', authenticateToken, 
  asyncHandler(paymentController.initiateDeposit));
```

### errorHandler Middleware

**Purpose:** Centralized error handling with consistent responses

**File:** `backend/middleware/errorHandler.js`
```javascript
const { main: logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({ error: message });
};

module.exports = { errorHandler };
```

**Usage in Server:**
```javascript
// In server.js LAST in middleware chain
app.use(errorHandler);

// Now all errors bubble up to this handler
```

---

## 🌳 Service Layer Extraction

### Before & After: Wallet Operations

#### BEFORE: Controller with DB Logic
```javascript
// backend/controllers/walletController.js (OLD - 100+ lines)
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Business logic in controller
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      const newWallet = await Wallet.create({
        userId,
        balance: 0,
        lastUpdated: new Date()
      });
      return res.json({ balance: 0 });
    }
    
    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.creditWallet = async (req, res) => {
  try {
    const { userId, amount, reference } = req.body;
    
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    
    const newBalance = wallet.balance + amount;
    await wallet.update({ balance: newBalance });
    
    await Transaction.create({
      userId,
      amount,
      type: 'credit',
      reference,
      status: 'completed'
    });
    
    res.json({ success: true, balance: newBalance });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
```

#### AFTER: Thin Controller + Service Layer
```javascript
// backend/services/walletService.js (NEW - Testable)
const walletService = {
  async ensureWalletExists(userId) {
    let wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        lastUpdated: new Date()
      });
    }
    return wallet;
  },

  async getBalance(userId) {
    await this.ensureWalletExists(userId);
    const wallet = await Wallet.findOne({ where: { userId } });
    return wallet.balance;
  },

  async creditWallet(userId, amount, reference) {
    const wallet = await this.ensureWalletExists(userId);
    const newBalance = wallet.balance + amount;
    await wallet.update({ balance: newBalance });
    
    await Transaction.create({
      userId,
      amount,
      type: 'credit',
      reference,
      status: 'completed'
    });
    
    return newBalance;
  },

  async getTransactions(userId, limit = 50) {
    return Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit
    });
  }
};

module.exports = walletService;
```

```javascript
// backend/controllers/walletController.js (REFACTORED - 10 lines)
const walletService = require('../services/walletService');
const asyncHandler = require('../middleware/asyncHandler');

exports.getBalance = asyncHandler(async (req, res) => {
  const balance = await walletService.getBalance(req.user.id);
  res.json({ balance });
});

exports.creditWallet = asyncHandler(async (req, res) => {
  const { amount, reference } = req.body;
  const balance = await walletService.creditWallet(req.user.id, amount, reference);
  res.json({ success: true, balance });
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const transactions = await walletService.getTransactions(req.user.id);
  res.json({ transactions });
});
```

**Benefits:**
- ✅ Service is unit testable
- ✅ Business logic reusable from multiple controllers
- ✅ Controller reduced by 90%
- ✅ Easy to understand flow
- ✅ Mocking in tests is trivial

---

### Payment Service Structure

**File:** `backend/services/paymentService.js`

```javascript
const paymentService = {
  async initiateDeposit(userId, amount, method) {
    // Generate unique transaction ID
    const transactionId = `deposit_${userId}_${Date.now()}`;
    
    // Create pending transaction record
    await Transaction.create({
      userId,
      amount,
      type: 'deposit',
      method,
      transactionId,
      status: 'pending'
    });
    
    // Route to appropriate payment gateway
    let paymentUrl;
    if (['orange', 'afrimoney', 'qmoney'].includes(method)) {
      paymentUrl = this.getMobileMoneyUrl(userId, amount, method, transactionId);
    } else if (method === 'stripe') {
      paymentUrl = await this.getStripePaymentUrl(userId, amount, transactionId);
    }
    
    return { paymentUrl, transactionId };
  },

  async handleMobileMoneyWebhook(webhookData) {
    const { transactionId, status, amount } = webhookData;
    
    const transaction = await Transaction.findOne({ where: { transactionId } });
    if (!transaction) return { error: 'Transaction not found' };
    
    if (status === 'success') {
      // Credit wallet
      await walletService.creditWallet(
        transaction.userId, 
        amount, 
        transactionId
      );
      
      // Mark transaction complete
      await transaction.update({ status: 'completed' });
    } else {
      await transaction.update({ status: 'failed' });
    }
    
    return { success: true };
  },

  async getStripeConnectUrl(userId) {
    // Generate OAuth URL for seller account linkage
    const state = `${userId}_${Date.now()}`;
    return `https://connect.stripe.com/oauth/authorize?client_id=${process.env.STRIPE_CLIENT_ID}&state=${state}`;
  },

  async handleStripeConnectCallback(userId, code) {
    // Exchange authorization code for access token
    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_secret: process.env.STRIPE_SECRET_KEY,
        code,
        grant_type: 'authorization_code'
      })
    });
    
    const { stripe_user_id } = await response.json();
    
    // Store seller's Stripe account ID
    await Seller.update(
      { stripeAccountId: stripe_user_id },
      { where: { userId } }
    );
    
    return { success: true };
  }
};
```

---

### Purchase Service

**File:** `backend/services/purchaseService.js`

```javascript
const purchaseService = {
  async purchaseBook(userId, bookId, amount) {
    // Validate user has sufficient balance
    const balance = await walletService.getBalance(userId);
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Deduct from wallet
    const newBalance = await walletService.creditWallet(userId, -amount, `book_purchase_${bookId}`);
    
    // Record purchase
    const purchaseId = `purch_${userId}_${bookId}_${Date.now()}`;
    const purchase = await Purchase.create({
      userId,
      bookId,
      amount,
      purchaseId,
      transactionId: purchaseId,
      status: 'completed'
    });
    
    // Get seller and credit their account (if applicable)
    const book = await Book.findByPk(bookId, { include: ['seller'] });
    if (book.seller) {
      const sellerEarnings = amount * 0.85; // 85% to seller, 15% platform fee
      await walletService.creditWallet(
        book.seller.userId, 
        sellerEarnings, 
        `book_sale_${purchaseId}`
      );
    }
    
    return { success: true, purchaseId, newBalance };
  }
};
```

---

## 📝 Controller Updates Summary

### Auth Controller Changes

**File:** `backend/controllers/authController.js`

```javascript
const asyncHandler = require('../middleware/asyncHandler');
const { main: logger } = require('../utils/logger');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  // ADDED: Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  
  // ADDED: Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // ADDED: Password strength validation
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  
  // Original logic...
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'reader'
  });
  
  // ADDED: Environment check
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.status(201).json({ token, user: { id: user.id, email, name, role: user.role } });
});
```

---

## 🔧 Server Configuration Changes

### server.js - Added Security & Logging

**Before:**
```javascript
const app = express();
app.use(cors());
app.use(express.json());

// ... routes ...
```

**After:**
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const { main: logger } = require('./utils/logger');

const app = express();

// ADDED: Security headers
app.use(helmet());

// ADDED: CORS
app.use(cors());

// ADDED: Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ADDED: Environment validation with logging
['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'JWT_SECRET'].forEach(name => {
  if (!process.env[name]) {
    logger.warn(`Environment variable ${name} is not defined`);
  }
});

// ADDED: Logging for database operations
sequelize.authenticate()
  .then(() => {
    logger.info('Connected to Hostinger MySQL!');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    logger.info('Database & tables synced!');
  })
  .catch(err => logger.error('Connection failed:', err));

// ... routes ...

// ADDED: Centralized error handler (MUST be last)
app.use(errorHandler);
```

---

## 📊 Logging Integration

### Winston Logger

**File:** `backend/utils/logger.js`

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  defaultMeta: { service: 'backend' },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

module.exports = { main: logger };
```

**Usage Changes:**

```javascript
// BEFORE: console.log scattered everywhere
console.log('User registered:', userId);
console.error('Database error:', error);
console.warn('Rate limit near');

// AFTER: Structured logging
const { main: logger } = require('../utils/logger');

logger.info('User registered', { userId });
logger.error('Database error', { error: error.message, stack: error.stack });
logger.warn('Rate limit approaching', { ip: req.ip });
```

---

## 📋 Package.json Changes

### Backend

**Added Dependencies:**
```json
{
  "dependencies": {
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.0.0",
    "winston": "^3.8.0"
  }
}
```

### Frontend

**Updated:**
```json
{
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

**Updated:** `postcss.config.js`
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

---

## ✅ Testing the Refactored Code

### Unit Test Example

```javascript
// test/walletService.test.js
const walletService = require('../services/walletService');

describe('walletService', () => {
  it('should create wallet for new user', async () => {
    const wallet = await walletService.ensureWalletExists(999);
    expect(wallet.balance).toBe(0);
    expect(wallet.userId).toBe(999);
  });

  it('should credit wallet correctly', async () => {
    const userId = 999;
    const balance = await walletService.creditWallet(userId, 100, 'test_ref');
    expect(balance).toBe(100);
  });

  it('should return transaction history', async () => {
    const transactions = await walletService.getTransactions(999);
    expect(Array.isArray(transactions)).toBe(true);
  });
});
```

### Integration Test Example

```javascript
// test/auth.integration.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication Flow', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('reader');
  });

  it('should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

---

## 🎯 Key Refactoring Principles Applied

1. **Single Responsibility** - Each service handles one domain
2. **DRY** - Code not repeated across controllers
3. **Testability** - Services are independently testable
4. **Maintainability** - Changes localized to service layer
5. **Scalability** - Easy to add new features
6. **Security** - Centralized validation and error handling
7. **Observability** - Structured logging throughout

---

## 📚 References

- **AsyncHandler:** Prevents uncaught promise rejections
- **Service Pattern:** Separates business logic from routing
- **Middleware Pattern:** Cross-cutting concerns
- **Error Handler:** Single point of error response formatting
- **Winston Logger:** Enterprise-grade structured logging

---

**End of Refactoring Guide**
