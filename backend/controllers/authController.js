const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// we'll access models from request (populated in server.js)
const asyncHandler = require('../middleware/asyncHandler');

// ensure we have a secret at startup
if (!process.env.JWT_SECRET) {
    const { main: logger } = require('../utils/logger');
    logger.error('JWT_SECRET is not defined in environment - using default for development');
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

// basic email regex (not perfect but catches obvious mistakes)
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const { User } = req.app.get('models');
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user)
    });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check for user
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

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user)
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