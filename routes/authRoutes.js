// --- File: routes/authRoutes.js (Corrected and Completed) ---

// ✅ FIXED: These lines were missing. They are required in every route file.
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const transporter = require('../config/mailer');

/**
 * Generates a JSON Web Token (JWT).
 * Make sure you have a JWT_SECRET in your .env file.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) return res.status(400).json({ error: "All fields are required." });
        
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(409).json({ error: "User already exists." });

        const user = new User({ fullName, email, password });
        const savedUser = await user.save();
        
        res.status(201).json({
            message: "User registered successfully!",
            token: generateToken(savedUser._id),
            user: { fullName: savedUser.fullName, email: savedUser.email }
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
});


/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate a user
 */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user && (await user.comparePassword(password))) {
            res.json({
                message: "Login successful!",
                token: generateToken(user._id),
                user: { fullName: user.fullName, email: user.email }
            });
        } else {
            res.status(401).json({ error: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ error: "Server error during login." });
    }
});


/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request a password reset link
 */
router.post('/forgot-password', async (req, res) => {
    // ... The full, correct code for this route ...
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });
            const resetURL = `http://${req.headers.host}/reset-password.html?token=${resetToken}`;
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset Link',
                html: `Click to reset: <a href="${resetURL}">${resetURL}</a>`,
            });
        }
        res.json({ message: "If the email exists, a reset link has been sent." });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ error: "Error sending email." });
    }
});


/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password using a token
 */
router.put('/reset-password/:token', async (req, res) => {
    // ... The full, correct code for this route ...
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ 
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ error: "Token is invalid or has expired." });
        
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        res.json({ message: "Password reset successfully." });
    } catch (err) {
        res.status(500).json({ error: "Failed to reset password." });
    }
});


// ✅ FIXED: This was likely missing. You must export the router at the end.
module.exports = router;