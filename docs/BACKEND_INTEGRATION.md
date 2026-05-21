# Backend Integration Plan

## QuantumMint Bookstore

---

## Overview

This document outlines the backend integration strategy for the QuantumMint Bookstore platform. The frontend is complete with all UI components, dashboards, and client-side logic. Now we need to integrate with backend services for data persistence, authentication, payment processing, and TTS synthesis.

---

## Architecture

### Technology Stack

**Backend Framework:**

- Node.js + Express (or NestJS for enterprise)
- TypeScript for type safety
- Sequelize ORM (supporting PostgreSQL, MySQL, and SQLite)

**Database:**

- PostgreSQL (primary data store, now supported in backend implementation)
- Redis (caching & sessions)

**Services:**

- TTS Service (separate microservice)
- Media Sync Service (formula processing)
- Payment Gateway Integrations

**Infrastructure:**

- Docker containers
- Nginx reverse proxy
- Let's Encrypt SSL

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'creator', 'support', 'admin')),
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Books Table

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url VARCHAR(500),
  genre VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  total_duration INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

### Chapters Table

```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  text TEXT NOT NULL,
  audio_url VARCHAR(500),
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('12hours', '24hours', '7days', '30days')),
  price_sll DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Usage Sessions Table

```sql
CREATE TABLE usage_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  book_id UUID NOT NULL REFERENCES books(id),
  chapter_id UUID NOT NULL REFERENCES chapters(id),
  duration_seconds INTEGER NOT NULL,
  cost_sll DECIMAL(10,2),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payout', 'subscription', 'usage')),
  amount_sll DECIMAL(10,2) NOT NULL,
  amount_usd DECIMAL(10,2),
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### Wallets Table

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  balance_sll DECIMAL(10,2) DEFAULT 0,
  balance_usd DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  chapter_number INTEGER,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Referrals Table

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  reward_sll DECIMAL(10,2) DEFAULT 5.00,
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

---

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `POST /refresh` - Refresh JWT token

### Books (`/api/books`)

- `GET /` - List all books (with filters)
- `GET /:id` - Get book details
- `POST /` - Create new book (creator only)
- `PUT /:id` - Update book (creator only)
- `DELETE /:id` - Delete book (creator only)
- `POST /:id/publish` - Publish book
- `GET /my-books` - Get creator's books

### TTS (`/api/tts`)

- `POST /synthesize` - Synthesize chapter audio
- `GET /voices` - Get available voices
- `POST /batch` - Batch synthesize multiple chapters

### Subscriptions (`/api/subscriptions`)

- `GET /current` - Get active subscription
- `POST /` - Create subscription
- `POST /upgrade` - Upgrade subscription
- `POST /cancel` - Cancel subscription
- `GET /history` - Get subscription history

### Usage (`/api/usage`)

- `POST /start` - Start listening session
- `POST /update` - Update session duration
- `POST /end` - End session and calculate cost
- `GET /history` - Get usage history

### Payments (`/api/payments`)

- `POST /deposit` - Deposit funds
- `POST /withdraw` - Withdraw funds
- `GET /balance` - Get wallet balance
- `GET /transactions` - Get transaction history
- `POST /payout` - Request creator payout

### Earnings (`/api/earnings`)

- `GET /` - Get total earnings
- `GET /book/:id` - Get earnings for specific book
- `GET /payouts` - Get payout history

### Library (`/api/library`)

- `GET /` - Get user's library
- `POST /add` - Add book to library
- `DELETE /:bookId` - Remove from library
- `GET /:bookId/progress` - Get reading progress
- `PUT /:bookId/progress` - Update progress

### Admin (`/api/admin`)

- `GET /stats` - Platform statistics
- `GET /books` - All books (with moderation status)
- `POST /books/:id/approve` - Approve book
- `POST /books/:id/reject` - Reject book
- `GET /transactions` - All transactions
- `POST /transactions/:id/approve` - Approve transaction

### Referrals (`/api/referrals`)

- `GET /code` - Get referral code
- `GET /` - Get referrals list
- `GET /earnings` - Get referral earnings

---

## Payment Integration

### Orange Money Integration

```javascript
// Orange Money API wrapper
class OrangeMoneyService {
  async deposit(amount, phoneNumber) {
    // Initiate Orange Money payment
    const response = await fetch('https://api.orange.com/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ORANGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'SLL',
        phoneNumber,
        merchantId: ORANGE_MERCHANT_ID,
      }),
    });
    return response.json();
  }

  async withdraw(amount, phoneNumber) {
    // Process withdrawal to Orange Money
  }
}
```

### Qmoney Integration

```javascript
class QmoneyService {
  async deposit(amount, accountNumber) {
    // Qmoney deposit logic
  }

  async withdraw(amount, accountNumber) {
    // Qmoney withdrawal with 1% fee
  }
}
```

### Stripe Integration

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  async createConnectAccount(userId) {
    // Create Stripe Connect account for creator
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
    });
    return account;
  }

  async createPaymentIntent(amount) {
    // Create payment intent for deposits
  }

  async payout(accountId, amount) {
    // Transfer to creator's Stripe account (minus 5% platform fee)
    const platformFee = amount * 0.05;
    const creatorAmount = amount - platformFee;
    
    await stripe.transfers.create({
      amount: creatorAmount * 100, // Convert to cents
      currency: 'usd',
      destination: accountId,
    });
  }
}
```

---

## Revenue Calculation

### Pay-Per-Use Revenue

```javascript
function calculateUsageCost(durationMinutes) {
  const RATE_PER_MINUTE_SLL = 0.0167; // Le 1 per hour
  return durationMinutes * RATE_PER_MINUTE_SLL;
}

function splitRevenue(totalCost) {
  const creatorShare = totalCost * 0.75; // 75%
  const platformShare = totalCost * 0.25; // 25%
  return { creatorShare, platformShare };
}
```

### Subscription Revenue Distribution

```javascript
async function distributeSubscriptionRevenue(subscriptionId) {
  // Get all books listened to during subscription period
  const sessions = await getSubscriptionSessions(subscriptionId);
  
  // Calculate total listening time per book
  const bookListeningTime = {};
  sessions.forEach(session => {
    bookListeningTime[session.bookId] = 
      (bookListeningTime[session.bookId] || 0) + session.duration;
  });
  
  // Get subscription price
  const subscription = await getSubscription(subscriptionId);
  const totalRevenue = subscription.price_sll;
  
  // Platform takes 25%
  const platformShare = totalRevenue * 0.25;
  const creatorsPool = totalRevenue * 0.75;
  
  // Distribute creators' share proportionally
  const totalListeningTime = Object.values(bookListeningTime)
    .reduce((sum, time) => sum + time, 0);
  
  for (const [bookId, listeningTime] of Object.entries(bookListeningTime)) {
    const proportion = listeningTime / totalListeningTime;
    const creatorEarnings = creatorsPool * proportion;
    
    await creditCreator(bookId, creatorEarnings);
  }
}
```

---

## Authentication & Authorization

### JWT Token Strategy

```javascript
import jwt from 'jsonwebtoken';

function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

---

## Real-time Notifications

### WebSocket Setup

```javascript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

// Connection handling
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  socket.join(`user:${userId}`);
  
  socket.on('disconnect', () => {
    socket.leave(`user:${userId}`);
  });
});

// Send notification
function sendNotification(userId, notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}
```

---

## Deployment Strategy

### Docker Compose Setup

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: quantummint
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/quantummint
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  tts-service:
    build: ./tts-service
    ports:
      - "7001:7001"

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://backend:8000/api

volumes:
  postgres_data:
```

---

## Testing Strategy

### Unit Tests

- API endpoint tests
- Revenue calculation tests
- Payment processing tests

### Integration Tests

- End-to-end user flows
- Payment gateway integration
- TTS service integration

### Load Testing

- Concurrent users: 1000+
- API response time: < 200ms
- Database query optimization

---

## Security Considerations

1. **Password Hashing**: bcrypt with salt rounds = 12
2. **SQL Injection**: Use parameterized queries
3. **XSS Protection**: Sanitize all user inputs
4. **CSRF Protection**: CSRF tokens for state-changing operations
5. **Rate Limiting**: 100 requests/minute per IP
6. **Payment Security**: PCI DSS compliance via Stripe
7. **Data Encryption**: Encrypt sensitive data at rest

---

## Next Steps

1. **Set up PostgreSQL database** with schema
2. **Implement authentication** endpoints
3. **Create books CRUD** endpoints
4. **Integrate TTS service**
5. **Implement payment gateways**
6. **Set up WebSocket** for notifications
7. **Deploy to staging** environment
8. **Load testing** and optimization
9. **Production deployment**

---

## Success Criteria

- ✅ All API endpoints functional
- ✅ Payment processing working (all 4 methods)
- ✅ TTS synthesis operational
- ✅ Real-time notifications delivered
- ✅ Revenue split calculated correctly
- ✅ < 200ms API response time
- ✅ 99.9% uptime
- ✅ Secure authentication
