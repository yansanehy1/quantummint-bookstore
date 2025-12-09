const jwt = require('jsonwebtoken');
const { logger } = require('@quantummint/shared/utils/logger');

class MailAuthMiddleware {
    constructor(config) {
        this.jwtSecret = config.JWT_SECRET || 'quantum-mail-secret-2024';
        this.sessionTimeout = config.SESSION_TIMEOUT || 3600000; // 1 hour
        this.activeSessions = new Map();
    }

    // Generate JWT token for authenticated user
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            permissions: user.permissions,
            mailboxes: user.mailboxes || [],
            iat: Date.now()
        };

        return jwt.sign(payload, this.jwtSecret, { 
            expiresIn: '1h',
            issuer: 'quantummint-mail-server'
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
            logger.warn('Mail auth token verification failed:', error.message);
            return null;
        }
    }

    // Authentication middleware for web routes
    authenticate(req, res, next) {
        const token = req.cookies?.mail_auth_token || 
                     req.headers.authorization?.replace('Bearer ', '') ||
                     req.query.token;

        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication required',
                redirectTo: '/mail/login'
            });
        }

        const user = this.verifyToken(token);
        if (!user) {
            res.clearCookie('mail_auth_token');
            return res.status(401).json({ 
                error: 'Invalid or expired token',
                redirectTo: '/mail/login'
            });
        }

        req.user = user;
        next();
    }

    // Mailbox access authorization
    authorizeMailbox(mailboxId) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            // Admin can access all mailboxes
            if (req.user.permissions?.includes('admin')) {
                return next();
            }

            // Check if user has access to this mailbox
            const userMailboxes = req.user.mailboxes || [];
            if (!userMailboxes.includes(mailboxId) && req.user.email !== mailboxId) {
                return res.status(403).json({ 
                    error: 'Mailbox access denied',
                    mailbox: mailboxId
                });
            }

            next();
        };
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

    // Login handler for mail users
    async login(req, res, mailService) {
        try {
            const { email, password, rememberMe } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password required' });
            }

            // Authenticate user through mail service
            const user = await mailService.authenticateUser(email, password);
            if (!user) {
                logger.warn(`Failed mail login attempt for: ${email}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = this.generateToken(user);
            
            // Store session
            this.activeSessions.set(user.id, {
                userId: user.id,
                email: user.email,
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

            res.cookie('mail_auth_token', token, cookieOptions);

            logger.info(`Mail user ${email} logged in successfully`);
            
            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    role: user.role,
                    permissions: user.permissions,
                    mailboxes: user.mailboxes
                },
                token: token
            });

        } catch (error) {
            logger.error('Mail login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Logout handler
    logout(req, res) {
        try {
            if (req.user) {
                this.activeSessions.delete(req.user.id);
                logger.info(`Mail user ${req.user.email} logged out`);
            }

            res.clearCookie('mail_auth_token');
            res.json({ success: true, message: 'Logged out successfully' });

        } catch (error) {
            logger.error('Mail logout error:', error);
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
                email: req.user.email,
                username: req.user.username,
                role: req.user.role,
                permissions: req.user.permissions,
                mailboxes: req.user.mailboxes
            },
            session: {
                loginTime: session?.loginTime,
                lastActivity: session?.lastActivity
            }
        });
    }

    // Check mailbox quota
    checkQuota(req, res, next) {
        // This would integrate with the mail service to check storage quotas
        // For now, just pass through
        next();
    }

    // Rate limiting for email sending
    rateLimitSending(maxPerHour = 100) {
        const sendingCounts = new Map();
        
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const userId = req.user.id;
            const now = Date.now();
            const hourAgo = now - (60 * 60 * 1000);

            // Get user's sending history
            if (!sendingCounts.has(userId)) {
                sendingCounts.set(userId, []);
            }

            const userSends = sendingCounts.get(userId);
            
            // Remove old entries
            const recentSends = userSends.filter(timestamp => timestamp > hourAgo);
            sendingCounts.set(userId, recentSends);

            // Check rate limit
            if (recentSends.length >= maxPerHour) {
                return res.status(429).json({ 
                    error: 'Rate limit exceeded',
                    limit: maxPerHour,
                    resetTime: Math.min(...recentSends) + (60 * 60 * 1000)
                });
            }

            // Add current send
            recentSends.push(now);
            next();
        };
    }

    // Session cleanup
    cleanupSessions() {
        const now = Date.now();
        for (const [userId, session] of this.activeSessions.entries()) {
            if (now - session.lastActivity > this.sessionTimeout) {
                this.activeSessions.delete(userId);
                logger.debug(`Cleaned up expired mail session for user ${session.email}`);
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
            email: session.email,
            username: session.username,
            loginTime: session.loginTime,
            lastActivity: session.lastActivity,
            ipAddress: session.ipAddress,
            duration: Date.now() - session.loginTime
        }));

        res.json({ sessions });
    }
}

module.exports = MailAuthMiddleware;
