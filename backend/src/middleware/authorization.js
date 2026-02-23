// src/middleware/authorization.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// Authenticate (cek token)
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
        // Sesuaikan properti dengan req.user yang dipakai controller
        req.user = {
            id_user: decoded.id_user,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token tidak valid atau kadaluarsa.'
        });
    }
}
// Authorization (cek role)
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Akses ditolak. Role (${req.user.role}) tidak memiliki izin.`
            });
        }
        next();
    };
};