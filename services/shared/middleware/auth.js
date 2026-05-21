const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid authorization token' });
  }

  const token = authHeader.substring(7).trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ success: false, error: 'Internal server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Unauthorized: insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
