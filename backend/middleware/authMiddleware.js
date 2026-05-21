const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token (HS256 only, no algorithm downgrade)
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

module.exports = { authenticateToken, isAdmin };
