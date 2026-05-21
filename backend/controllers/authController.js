const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const { registerSchema, loginSchema } = require('../validation/authSchema');
const { main: logger } = require('../utils/logger');
const EmailService = require('../../services/shared/emailService');

const emailService = new EmailService();
emailService.initialize().catch(err => logger.error('Failed to initialize EmailService in AuthController', err));

// Ensure we have a secret at startup.
// Using a hardcoded default in production is a critical security flaw.
if (!process.env.JWT_SECRET) {
    const nodeEnv = process.env.NODE_ENV || 'development';

    if (nodeEnv === 'production') {
        logger.error('JWT_SECRET is not defined in environment (refusing to start in production)');
        throw new Error('JWT_SECRET must be set in production');
    }

    logger.warn('JWT_SECRET is not defined; defaulting for development only (DO NOT USE IN PRODUCTION)');
    process.env.JWT_SECRET = 'development_jwt_secret_change_in_production';
}

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
        logger.warn(`[AuthController] Registration validation failed: ${validation.error.errors[0].message}`);
        return res.status(400).json({ 
            error: validation.error.errors[0].message,
            details: validation.error.errors 
        });
    }

    const { name, email, password, role } = validation.data;

    // Check if user exists
    const { User } = req.app.get('models');
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        logger.info(`[AuthController] Registration attempt for existing email: ${email}`);
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'learner'
    });

    logger.info(`[AuthController] User registered successfully: ${user.id} (${email})`);

    // Send welcome email (async, don't block response)
    emailService.sendWelcomeEmail(user).catch(err => logger.error(`Failed to send welcome email to ${email}`, err));

    const token = generateToken(user);
    res.status(201).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            walletBalance: {
                usd: parseFloat(user.usdBalance) || 0,
                sll: parseFloat(user.sllBalance) || 0,
            },
        },
        token,
    });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        logger.warn(`[AuthController] Login validation failed: ${validation.error.errors[0].message}`);
        return res.status(400).json({ 
            error: validation.error.errors[0].message,
            details: validation.error.errors 
        });
    }

    const { email, password } = validation.data;

    // Check for user
    const { User } = req.app.get('models');
    const user = await User.findOne({ where: { email } });
    if (!user) {
        logger.info(`[AuthController] Login attempt for non-existent user: ${email}`);
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.info(`[AuthController] Invalid password for user: ${email}`);
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    logger.info(`[AuthController] User logged in successfully: ${user.id} (${email})`);

    const token = generateToken(user);
    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            walletBalance: {
                usd: parseFloat(user.usdBalance) || 0,
                sll: parseFloat(user.sllBalance) || 0,
            },
        },
        token,
    });
});

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    const { User } = req.app.get('models');
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});