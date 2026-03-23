# QuantumMint Bookstore Login Functionality Exploration

## Executive Summary
**⚠️ CRITICAL ISSUE FOUND**: The frontend login form is misconfigured to call a non-existent API endpoint. The frontend expects to POST to `http://localhost:3002` (user service), but the backend authentication API is running on `http://localhost:3000` at the `/api/auth` routes.

---

## 1. FRONTEND LOGIN IMPLEMENTATION

### Login Component Location
- **File**: `frontend/src/pages/Login.tsx`
- **Type**: React functional component
- **State Management**: Uses React hooks (useState) + AuthContext

### Form Structure
```
- Email input field
- Role selection (User/Seller toggle)
- Submit button (calls useAuth.login())
```

### Current Issues in Login.tsx
1. **Hardcoded Password**: Line 23 uses placeholder `'password123'`
   ```typescript
   await login({ email, password: 'password123' });
   ```
   - No actual password input field in the UI
   - Security risk for any real authentication

2. **Form Validation**: Minimal validation (only checks `email.trim()`)

3. **Role Selection**: Collected but never used in the login call
   - UI shows User/Seller toggle, but API doesn't receive role

### Authentication Flow Chain

#### Step 1: AuthContext (`frontend/src/contexts/AuthContext.tsx`)
```typescript
import { authService } from '../api/services/authService';

const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
        const { user: userData } = await authService.login(credentials);
        setUser(userData);
    } finally {
        setIsLoading(false);
    }
};
```
- Stores user in local state
- Sets loading state during request

#### Step 2: AuthService (`frontend/src/api/services/authService.ts`)
```typescript
async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const response = await userClient.post<{ user: User; token: string }>(
        '/auth/login', 
        credentials
    );
    if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
}
```
- Uses `userClient` (axios client)
- Stores token and user to localStorage
- Expected response: `{ user: User, token: string }`

#### Step 3: API Client (`frontend/src/api/client.ts`)
```typescript
export const API_URLS = {
    user: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3002',
    // ... other services on different ports
};

export const userClient = new ApiClient(API_URLS.user);
```

### Expected API Request
- **URL**: `http://localhost:3002/auth/login`
- **Method**: POST
- **Body**: `{ email: string, password: string }`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer [token]` (if already authenticated)

---

## 2. BACKEND AUTHENTICATION IMPLEMENTATION

### Server Configuration (`backend/server.js`)
```javascript
const PORT = process.env.PORT || 3000;  // DEFAULT PORT
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
```
- **Default Port**: 3000
- **CORS**: Configured to allow frontend requests from http://localhost:5173

### Routes Setup
```javascript
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);  // Routes: /api/auth/[endpoint]
```

### Auth Routes (`backend/routes/authRoutes.js`)
```javascript
router.post('/register', register);      // POST /api/auth/register
router.post('/login', login);            // POST /api/auth/login ← LOGIN ENDPOINT
router.get('/me', authenticateToken, getMe);  // GET /api/auth/me (protected)
```

### Login Controller (`backend/controllers/authController.js`)

#### Handler: `exports.login`
```javascript
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user
    const { User } = req.app.get('models');
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Return success with token
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user)
    });
});
```

#### Key Backend Requirements
1. **Environment Variables** (checked at startup):
   - `JWT_SECRET` - Required (no default, exits if missing)
   - `DB_NAME` - Default: 'quantummint_db'
   - `DB_USER` - Default: 'root'
   - `DB_PASS` - Default: ''
   - `DB_HOST` - Default: '127.0.0.1'
   - `DB_PORT` - Default: 3306
   - `FRONTEND_URL` - Default: 'http://localhost:5173'

2. **Database Requirements**:
   - MySQL database with User table
   - User fields: id, email, password (hashed), name, role
   - Uses Sequelize ORM with auto-sync enabled

3. **Security Features**:
   - Passwords hashed with bcryptjs (salt: 10)
   - JWT tokens expire in 30 days
   - Email validation with regex: `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`
   - Password minimum 8 characters
   - Rate limiting: 120 requests per 15 minutes per IP

#### Response Format
```json
{
    "id": "user-uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user" or "seller",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 3. THE CRITICAL MISMATCH

### Current Configuration
| Component | Expected URL | Actual Port |
|-----------|-------------|------------|
| Frontend authService | `http://localhost:3002/auth/login` | ❌ None (microservice not running) |
| Backend auth route | `/api/auth/login` | `http://localhost:3000/api/auth/login` ✓ |

### What Happens When Login is Attempted
1. **Frontend submits**: POST to `http://localhost:3002/auth/login`
2. **Result**: 
   - If port 3002 is closed: `ECONNREFUSED` or network timeout
   - If port 3002 has different service: 404 Not Found
   - **User gets error**: "Request Error: Network Error"

### Root Cause Analysis
The frontend uses a **microservices architecture** (api/client.ts) with split services:
```javascript
user: 'http://localhost:3002'
book: 'http://localhost:3003'
audio: 'http://localhost:3004'
wallet: 'http://localhost:3005'
// ... etc
```

But the backend has a **monolithic architecture** with everythingunder:
```
http://localhost:3000/api/[resource]
```

---

## 4. ERROR HANDLING & LOGGING

### Frontend Error Handling
**AuthContext**: 
```typescript
try {
    const { user: userData } = await authService.login(credentials);
    setUser(userData);
} finally {
    setIsLoading(false);
}
```
- ⚠️ No catch block - errors not handled in component
- Errors bubble up unhandled

**AuthService**:
```typescript
catch (error) {
    console.error('Login failed:', error);
    throw error;
}
```
- Only logs to console
- Re-throws without UI feedback

**ApiClient** (axios interceptor):
```typescript
if (error.response?.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}
return Promise.reject(this.handleError(error));
```
- Redirects on 401
- Converts network errors to generic messages

### Backend Error Handling
**Controller**: Uses `asyncHandler` middleware to catch exceptions
**Errors Return**:
- 400: Bad request (missing fields, invalid email, wrong credentials)
- 401: Invalid token (from `authenticateToken` middleware)
- 500: Unhandled exceptions (caught by error handler)

**Logging**: Uses Winston logger at `backend/utils/logger.js`:
```javascript
logger.info('Connected to Hostinger MySQL!');
logger.error('Connection failed:', err);
```

---

## 5. AUTHENTICATION TOKEN & TOKEN VALIDATION

### JWT Token Generation
```javascript
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};
```
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiry**: 30 days
- **Payload**: `{ id, role }`

### Token Validation (`backend/middleware/authMiddleware.js`)
```javascript
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.substring(7).trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
};
```

**Frontend Token Storage** (localStorage):
- Key: `auth_token`
- Retrieved in every API call via axios interceptor
- Sent as: `Authorization: Bearer [token]`

---

## 6. POTENTIAL ISSUES SUMMARY

### Issue #1: API Endpoint Mismatch ⚠️ CRITICAL
- **Problem**: Frontend calls port 3002, backend on port 3000
- **Impact**: All login attempts will fail with "Network Error"
- **Fix**: Update `frontend/src/api/client.ts` line 91:
  ```typescript
  user: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3000/api',
  ```

### Issue #2: Missing Password Input UI
- **Problem**: Login form has no password field, uses hardcoded 'password123'
- **Impact**: Cannot authenticate with actual user passwords
- **Fix**: Add password input field to Login.tsx:
  ```typescript
  const [password, setPassword] = useState('');
  // ... input element for password
  await login({ email, password });
  ```

### Issue #3: No Error Display to User
- **Problem**: Errors logged to console but not shown in UI
- **Impact**: User doesn't know why login failed
- **Fix**: Update AuthContext catch blocks:
  ```typescript
  const [error, setError] = useState('');
  const login = async (credentials: LoginRequest) => {
      try {
          const { user: userData } = await authService.login(credentials);
          setUser(userData);
          setError('');
      } catch (error) {
          setError(error.message);
      }
  };
  ```

### Issue #4: Database Connection Required
- **Problem**: Backend requires MySQL database to be running
- **Impact**: Sequelize sync will fail if DB not accessible
- **Check**: Ensure `DB_HOST`, `DB_USER`, `DB_PASS` are correct

### Issue #5: JWT_SECRET Not Set
- **Problem**: Backend exits at startup if JWT_SECRET undefined
- **Impact**: Server won't start
- **Fix**: Set environment variable before running backend:
  ```bash
  set JWT_SECRET=your_secret_key_here_min_32_chars
  npm start
  ```

### Issue #6: Role Selection Not Used
- **Problem**: Frontend collects role but doesn't send it to login endpoint
- **Impact**: Login doesn't differentiate user types
- **Fix**: Pass role in login request if backend supports it

---

## 7. RECOMMENDED TESTING STEPS

1. **Verify Backend is Running**
   ```bash
   curl http://localhost:3000
   # Expected: { "status": "QuantumMint API running", "version": "1.0.0" }
   ```

2. **Test Login Endpoint Directly**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```

3. **Verify User Exists in Database**
   ```sql
   SELECT id, email, role FROM Users WHERE email = 'test@example.com';
   ```

4. **Check Frontend Network Tab**
   - Open DevTools → Network tab
   - Attempt login
   - Check actual request URL (will show 404 on port 3002)

5. **Verify Environment Variables**
   - Backend: JWT_SECRET, DB credentials
   - Frontend: VITE_USER_SERVICE_URL (if needed)

---

## 8. ARCHITECTURE DIAGRAM

```
FRONTEND (Port 5173)
├── Login.tsx
│   └── useAuth.login()
│       └── AuthContext.tsx
│           └── authService.login()
│               └── userClient.post('/auth/login', credentials)
│                   └── ApiClient (axios)
│                       └── POST http://localhost:3002/auth/login ❌ WRONG
│
BACKEND (Port 3000)
├── /api/auth/login ← Server running here
│   └── authController.login()
│       ├── Find user by email
│       ├── bcrypt.compare(password, hashed)
│       ├── generateToken(user)
│       └── Response: { id, name, email, role, token }
│
DATABASE (MySQL)
└── Users table (email, password_hash, name, role, etc.)
```

---

## 9. FILES INVOLVED

### Frontend
- `frontend/src/pages/Login.tsx` - UI Component
- `frontend/src/contexts/AuthContext.tsx` - Auth state management
- `frontend/src/api/services/authService.ts` - API call wrapper
- `frontend/src/api/client.ts` - Axios client configuration
- `frontend/src/types/api.ts` - TypeScript interfaces

### Backend
- `backend/server.js` - Express server setup
- `backend/routes/authRoutes.js` - Route definitions
- `backend/controllers/authController.js` - Login/Register logic
- `backend/middleware/authMiddleware.js` - JWT validation
- `backend/models/User.js` - User model definition
- `backend/utils/logger.js` - Logging utility

---

## 10. NEXT STEPS

1. **Immediate**: Fix API endpoint mismatch (port 3002 → 3000)
2. **High Priority**: Add password input field to form
3. **High Priority**: Add error display to UI
4. **Medium Priority**: Set JWT_SECRET environment variable
5. **Medium Priority**: Verify MySQL database is accessible
6. **Low Priority**: Add role parameter to login if backend implements it

