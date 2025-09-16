// --- Create New File: middleware/authMiddleware.js ---

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    // Check if the request has an Authorization header that starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGciOiJ...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the user from the ID in the token and attach them to the request
            // .select('-password') ensures the password hash is not included
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Move on to the next function (the actual route handler)
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

module.exports = { protect };