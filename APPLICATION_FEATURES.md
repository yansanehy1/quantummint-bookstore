# QuantumMint Bookstore - Application Features & Architecture

**Current Date:** March 11, 2026  
**Application Status:** Fully built, servers running, awaiting database connection

---

## 🎯 Application Overview

**QuantumMint** is a comprehensive digital book marketplace platform with the following capabilities:

### Core Domains
1. **Digital Book Marketplace** - Browse, purchase, and read digital books
2. **Wallet & Payments** - Multi-gateway payment system with balance management
3. **Book Selling Platform** - Sellers can publish and monetize their content
4. **Reading Analytics** - Track reading progress and consumption patterns
5. **AI-Powered Features** - Maps Agent and Vision Agent for enhanced user experiences
6. **Admin Console** - Platform management and oversight

---

## 🏗️ Technology Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MySQL (Sequelize ORM)
- **Authentication:** JWT with bcryptjs
- **Security:** Helmet, Rate Limiting, Input Validation
- **Logging:** Winston (structured, class-based)
- **Port:** 3000

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6.4.1
- **Styling:** TailwindCSS v4.2.0
- **Package Manager:** npm
- **Port:** 3001

### Payment Gateways Integrated
- Orange Money (mobile money)
- Afrimoney (mobile money)
- Qmoney (mobile money)
- Stripe Connect (international payments + seller payouts)

---

## 📊 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | ❌ | Create new user account |
| POST | `/login` | ❌ | Authenticate user, return JWT |
| GET | `/me` | ✅ | Get current authenticated user |

### Wallet (`/api/wallet`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/balance` | ✅ | Get wallet balance |
| GET | `/transactions` | ✅ | Get transaction history |

### Payments (`/api/payments`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/deposit` | ✅ | Initiate wallet top-up |
| POST | `/withdraw` | ✅ | Initiate withdrawal |
| GET | `/stripe/connect` | ✅ | Initiate Stripe seller onboarding |
| GET | `/stripe/callback` | ❌ | Stripe OAuth callback handler |
| POST | `/webhooks/orange` | ❌ | Orange Money webhook |
| POST | `/webhooks/afrimoney` | ❌ | Afrimoney webhook |
| POST | `/webhooks/qmoney` | ❌ | Qmoney webhook |
| POST | `/webhooks/stripe` | ❌ | Stripe webhook |

### Purchases (`/api/purchase`)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/` | ✅ | Purchase a book |

### Health
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | ❌ | API health check |

**Response:** `{ "status": "QuantumMint API running", "version": "1.0.0" }`

---

## 📱 Frontend Pages & Routes

### Public Routes
- `/` - **Home** - Landing page
- `/login` - **Login** - User authentication
- `/register` - **Register** - New account creation
- `/library` or `/marketplace` - **Library** - Browse books
- `/privacy` - **Privacy Policy**
- `/terms` - **Terms of Service**
- `/about` - **About Us**
- `/contact` - **Contact Us**
- `/faq` - **FAQ**
- `/support` - **Support**

### Reader Routes (Authenticated)
- `/read/:bookId` - **Reader** - Read book content
- `/library` - **Library** - User's book collection
- `/wallet` - **Wallet** - View balance, transactions, deposit/withdraw
- `/checkout` - **Checkout** - Purchase books
- `/analytics` - **Reading Analytics** - Track reading progress
- `/referrals` - **Referrals** - Share and earn rewards
- `/settings` - **Settings** - Account preferences

### AI Features (Authenticated)
- `/maps` - **Maps Agent** - Location-based AI services
- `/vision` - **Vision Agent** - Image/document AI analysis

### Seller Routes (Role: seller)
- `/studio` - **Studio** - Edit and manage books
- `/seller/dashboard` - **Seller Dashboard** - Sales & earnings overview
- `/seller/onboarding` - **Seller Onboarding** - Setup guide
- `/seller/registration` - **Seller Registration** - Become a seller
- `/seller/request` - **Request Seller Status** - Apply to sell
- `/edit/:bookId` - **Book Editor** - Create/edit book content

### Admin Routes (Role: admin)
- `/admin` - **Admin Dashboard** - System overview
- `/admin/books` - **Book Management** - Moderate all books
- `/admin/wallet` - **Wallet Management** - User balance oversight

---

## 🔐 User Roles

1. **Reader** (default) - Can browse, purchase, and read books
2. **Seller** - Can create, edit, and sell books; receive payments
3. **Admin** - Can manage platform, users, and content

---

## 💰 Financial Features

### Wallet System
- **Balance Management** - Track available funds
- **Transactions** - Detailed transaction history
- **Multi-Currency Support** - Through payment gateways
- **Deposit Methods:**
  - Orange Money
  - Afrimoney
  - Qmoney
  - Stripe

### Purchase System
- **Book Transactions** - Automatic deductions from wallet
- **Seller Payouts** - Via Stripe Connect
- **Transaction Recording** - Immutable transaction logs
- **Referral Rewards** - Earn by referring friends

---

## 🔧 Backend Architecture

### Middleware
- **asyncHandler** - Wraps async routes to catch promise rejections
- **errorHandler** - Centralized error handling with consistent JSON responses
- **authMiddleware** - JWT token verification
- **helmet** - Security headers
- **rate-limit** - DDoS prevention (120 requests per 15 min per IP)

### Services (Business Logic Layer)
1. **walletService** - Wallet operations
   - `ensureWalletExists()` - Create wallet for new user
   - `getBalance()` - Check balance
   - `getTransactions()` - Retrieve history
   - `creditWallet()` - Add funds

2. **paymentService** - Payment operations
   - `initiateDeposit()` - Start deposit flow
   - `initiateWithdrawal()` - Start withdrawal
   - `handleMobileMoneyWebhook()` - Process mobile money callbacks
   - `handleStripeWebhook()` - Process Stripe payments
   - `getStripeConnectUrl()` - OAuth for seller onboarding
   - `handleStripeConnectCallback()` - Complete OAuth
   - `disconnectStripeAccount()` - Remove seller payment account

3. **purchaseService** - Purchase operations
   - `purchaseBook()` - Execute book purchase with validation

### Models (Database Schema)
- **User** - User accounts with roles
- **Book** - Digital book metadata
- **Purchase** - Purchase transactions
- **Transaction** - Payment transactions
- **Wallet** - User wallet balances
- **Seller** - Seller account details
- **Referral** - Referral rewards tracking

### Controllers (Request/Response)
- **authController** - Handles register, login, getMe
- **walletController** - Delegates to walletService
- **paymentController** - Delegates to paymentService
- **purchaseController** - Delegates to purchaseService

### Logging
- **Winston Logger** - Structured logging with timestamps
- **Service Name Tagging** - Identify log sources
- **Levels** - error, warn, info, http, debug

---

## 📦 Dependencies

### Backend (Key Packages)
- express (server framework)
- sequelize (ORM)
- mysql2 (database driver)
- jsonwebtoken (JWT auth)
- bcryptjs (password hashing)
- helmet (security headers)
- express-rate-limit (rate limiting)
- cors (cross-origin)
- dotenv (environment variables)
- winston (logging)
- uuid (ID generation)

### Frontend (Key Packages)
- react (UI framework)
- vite (build tool)
- tailwindcss (styling)
- lucide-react (icons)
- wouter (routing)
- axios (HTTP client)
- recharts (visualization)

---

## 🚀 Current Status

✅ **Completed:**
- Full API endpoints implemented
- All routes defined
- Services extracted for business logic
- Security measures in place
- Frontend framework loaded
- Both servers running successfully

⚠️ **Pending:**
- Database connection (MySQL not running locally)
- User authentication flows (blocked by DB)
- Payment flow testing (blocked by DB)
- Email system configuration

---

## 🔄 Server Status

**Backend Server** - http://localhost:3000
- Status: ✅ Running
- Health Check: ✅ Responding (`GET /`)
- Database: ⚠️ Disconnected (MySQL not accessible)

**Frontend Server** - http://localhost:3001  
- Status: ✅ Running
- Vite Dev Server: ✅ Ready
- CSS Build: ✅ Tailwind v4 configured

---

## 📋 API Request Example

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

# Response (Success):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "reader"
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

# Response (Success):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Get Wallet Balance (Authenticated)
```bash
GET /api/wallet/balance
Authorization: Bearer <JWT_TOKEN>

# Response (Success):
{
  "balance": 1500.00,
  "currency": "USD"
}
```

### Deposit Money
```bash
POST /api/payments/deposit
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "amount": 500.00,
  "method": "orange" // or "afrimoney", "qmoney", "stripe"
}

# Response:
{
  "paymentUrl": "https://payment-gateway.com/...",
  "transactionId": "txn_123456"
}
```

### Purchase Book
```bash
POST /api/purchase
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "bookId": 5,
  "amount": 25.99
}

# Response (Success):
{
  "success": true,
  "purchaseId": "purch_789456",
  "message": "Book purchased successfully"
}
```

---

## 🎓 Next Steps for Testing

1. **Set up MySQL Database**
   - Configure `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - Run schema files from `database/` directory
   - Restart backend server

2. **Test Authentication**
   - Register test user via `/api/auth/register`
   - Login and get JWT token
   - Use token in Authorization header for protected routes

3. **Test Wallet Features**
   - Create wallet for user
   - Test balance retrieval
   - Test transaction history

4. **Test Payments**
   - Test payment gateway redirects
   - Verify webhook handling
   - Test Stripe Connect seller onboarding

5. **Test Book Purchase Flow**
   - Deposit funds via payment gateway
   - Purchase a book
   - Verify balance deduction
   - Confirm purchase record

6. **Test Frontend Integration**
   - Navigate through React pages
   - Verify API calls from frontend
   - Test authentication flow
   - Test payment UI

---

**End of Feature Documentation**
