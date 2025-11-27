// Add this interface at the top of the file
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ioredis_1 = require("ioredis");
const service_registry_client_1 = require("@quantummin/shared/utils/service-registry-client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Register OAuth routes (callback handler)
const oauth_1 = require("./routes/oauth");
(0, oauth_1.registerOAuthRoutes)(app);
const redis = new ioredis_1.Redis(process.env.REDIS_URL || '');
const serviceRegistry = new service_registry_client_1.ServiceRegistryClient();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.'
});
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    name: zod_1.z.string().min(2).max(100),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['admin', 'seller', 'user']).default('user'),
    referralCode: zod_1.z.string().optional()
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    deviceInfo: zod_1.z.object({
        userAgent: zod_1.z.string(),
        ip: zod_1.z.string()
    }).optional()
});
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy' });
});
app.post('/register', authLimiter, async (req, res) => {
    try {
        const { email, password, name, phone, role, referralCode } = registerSchema.parse(req.body);
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const userService = await serviceRegistry.discover('user-service');
        const userResponse = await fetch(`${userService[0].serviceUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, passwordHash, name, phone, role })
        });
        if (!userResponse.ok) {
            throw new Error('Failed to create user');
        }
        const user = await userResponse.json();
        if (referralCode) {
            try {
                const referralService = await serviceRegistry.discover('referral-service');
                await fetch(`${referralService[0].serviceUrl}/referrals/apply`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ referralCode, newUserId: user.id })
                });
            }
            catch (error) {
                console.warn('Referral processing failed:', error);
            }
        }
        const { accessToken, refreshToken } = await generateTokens(user);
        await redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        res.status(201).json({
            success: true,
            userId: user.id,
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password, deviceInfo } = loginSchema.parse(req.body);
        const user = await getUserByEmail(email);
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            await logSecurityEvent('failed_login', { email, ...deviceInfo });
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = await generateTokens(user);
        await redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        await logSecurityEvent('successful_login', { userId: user.id, ...deviceInfo });
        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
        if (storedToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        const user = await getUserById(decoded.userId);
        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
        await redis.set(`refresh_token:${user.id}`, newRefreshToken, 'EX', 7 * 24 * 60 * 60);
        res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
});
app.post('/logout', async (req, res) => {
    try {
        const { userId } = req.body;
        await redis.del(`refresh_token:${userId}`);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.post('/forgot-password', authLimiter, async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (user) {
        const resetToken = jsonwebtoken_1.default.sign({ userId: user.id, purpose: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await redis.set(`password_reset:${user.id}`, resetToken, 'EX', 3600);
        const notificationService = await serviceRegistry.discover('notification-service');
        await fetch(`${notificationService[0].serviceUrl}/emails/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: user.email,
                template: 'password-reset',
                data: { resetToken, name: user.name }
            })
        });
    }
    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
});
async function generateTokens(user) {
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: getPermissions(user.role)
    }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}
function getPermissions(role) {
    const permissions = {
        user: ['read:books', 'purchase:books', 'read:own_profile'],
        seller: ['read:books', 'purchase:books', 'create:books', 'read:sales', 'read:own_profile'],
        admin: ['read:books', 'purchase:books', 'create:books', 'read:sales', 'manage:users', 'manage:content', 'read:analytics']
    };
    return permissions[role] || permissions.user;
}
async function logSecurityEvent(eventType, data) {
    try {
        const analyticsService = await serviceRegistry.discover('analytics-service');
        await fetch(`${analyticsService[0].serviceUrl}/security-events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType, data, timestamp: new Date() })
        });
    }
    catch (error) {
        console.error('Failed to log security event:', error);
    }
}
async function getUserByEmail(_email) {
    // TODO: Implement actual database lookup
    return null;
}
async function getUserById(_id) {
    // TODO: Implement actual database lookup
    return null;
}
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
    serviceRegistry.register('auth-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});
