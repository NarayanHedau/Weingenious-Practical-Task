const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Auth Header:', authHeader);

    let token;
    if (authHeader) {
        const parts = authHeader.split(' ');
        token = parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : authHeader;
    }

    console.log('Token:', token);
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};