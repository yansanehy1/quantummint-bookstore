const jwt = require('jsonwebtoken');
const { logger } = require('@quantummint/shared/utils/logger');

class WebAuthMiddleware {
    constructor(config) {
        this.jwtSecret = config.JWT_SECRET || 'quantum-domain-secret-2024';
        this.sessionTimeout = config.SESSION_TIMEOUT || 3600000; // 1 hour
        this.activeSessions = new Map();
    }

    // Generate JWT token for authenticated user
    generateToken(user) {
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
            permissions: user.permissions,
            iat: Date.now()
        };

        return jwt.sign(payload, this.jwtSecret, { 
            expiresIn: '1h',
            issuer: 'quantummint-domain-controller'
        });
    }

    // Verify JWT token
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            
            // Check if session is still active
            if (this.activeSessions.has(decoded.id)) {
                const session = this.activeSessions.get(decoded.id);
                if (Date.now() - session.lastActivity > this.sessionTimeout) {
                    this.activeSessions.delete(decoded.id);
                    return null;
                }
                
                // Update last activity
                session.lastActivity = Date.now();
                return decoded;
            }
            
            return null;
        } catch (error) {
            logger.warn('Token verification failed:', error.message);
            return null;
        }
    }

    // Authentication middleware for web routes
    authenticate(req, res, next) {
        const token = req.cookies?.auth_token || 
                     req.headers.authorization?.replace('Bearer ', '') ||
                     req.query.token;

        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication required',
                redirectTo: '/login'
            });
        }

        const user = this.verifyToken(token);
        if (!user) {
            res.clearCookie('auth_token');
            return res.status(401).json({ 
                error: 'Invalid or expired token',
                redirectTo: '/login'
            });
        }

        req.user = user;
        next();
    }

    // Role-based authorization middleware
    authorize(requiredRoles = []) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            if (requiredRoles.length === 0) {
                return next();
            }

            const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

            if (!hasRequiredRole) {
                return res.status(403).json({ 
                    error: 'Insufficient permissions',
                    required: requiredRoles,
                    current: userRoles
                });
            }

            next();
        };
    }

    // Permission-based authorization
    requirePermission(permission) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const userPermissions = req.user.permissions || [];
            if (!userPermissions.includes(permission) && !userPermissions.includes('admin')) {
                return res.status(403).json({ 
                    error: 'Permission denied',
                    required: permission
                });
            }

            next();
        };
    }

    // Login handler
    async login(req, res, userService) {
        try {
            const { username, password, rememberMe } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }

            // Authenticate user through directory service
            const user = await userService.authenticate(username, password);
            if (!user) {
                logger.warn(`Failed login attempt for user: ${username}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = this.generateToken(user);
            
            // Store session
            this.activeSessions.set(user.id, {
                userId: user.id,
                username: user.username,
                loginTime: Date.now(),
                lastActivity: Date.now(),
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });

            // Set cookie
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 // 7 days or 1 hour
            };

            res.cookie('auth_token', token, cookieOptions);

            logger.info(`User ${username} logged in successfully`);
            
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    role: user.role,
                    permissions: user.permissions
                },
                token: token
            });

        } catch (error) {
            logger.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Logout handler
    logout(req, res) {
        try {
            if (req.user) {
                this.activeSessions.delete(req.user.id);
                logger.info(`User ${req.user.username} logged out`);
            }

            res.clearCookie('auth_token');
            res.json({ success: true, message: 'Logged out successfully' });

        } catch (error) {
            logger.error('Logout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get current user info
    getCurrentUser(req, res) {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const session = this.activeSessions.get(req.user.id);
        
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                role: req.user.role,
                permissions: req.user.permissions
            },
            session: {
                loginTime: session?.loginTime,
                lastActivity: session?.lastActivity
            }
        });
    }

    // Session cleanup
    cleanupSessions() {
        const now = Date.now();
        for (const [userId, session] of this.activeSessions.entries()) {
            if (now - session.lastActivity > this.sessionTimeout) {
                this.activeSessions.delete(userId);
                logger.debug(`Cleaned up expired session for user ${session.username}`);
            }
        }
    }

    // Start session cleanup interval
    startSessionCleanup() {
        setInterval(() => {
            this.cleanupSessions();
        }, 5 * 60 * 1000); // Clean up every 5 minutes
    }

    // Get active sessions (admin only)
    getActiveSessions(req, res) {
        if (!req.user?.permissions?.includes('admin')) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const sessions = Array.from(this.activeSessions.values()).map(session => ({
            userId: session.userId,
            username: session.username,
            loginTime: session.loginTime,
            lastActivity: session.lastActivity,
            ipAddress: session.ipAddress,
            duration: Date.now() - session.loginTime
        }));

        res.json({ sessions });
    }
}

module.exports = WebAuthMiddleware;
