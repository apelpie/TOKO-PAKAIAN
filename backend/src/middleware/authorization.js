// src/middleware/authorization.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Authenticate (check token)
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Akses ditolak. Token tidak tersedia.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = {
      id_user: decoded.id_user,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token tidak valid atau kadaluarsa'
    });
  }
};

// Authorize (check role)
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
