const jwt = require('jsonwebtoken');
const config = require('../config');

const authorize = (requiredRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = decoded; // Attach user info to the request

            if (!requiredRoles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = authorize;