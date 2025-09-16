// --- File: routes/userRoutes.js (Professionally Updated with JWT) ---

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const Order = require('../models/Order');
const Address = require('../models/Address');
const transporter = require('../config/mailer');
const { protect } = require('../middleware/authMiddleware'); // ✅ Import the new secure middleware

/**
 * All routes in this file are now protected. The 'protect' middleware runs first.
 * It verifies the user's JWT and attaches their user document to `req.user`.
 * We no longer need to find the user by their email in the request body.
 */

// --- [PATCH] /api/user/update-details ---
router.patch('/update-details', protect, async (req, res) => {
    try {
        const { fullName, newsletterSubscribed } = req.body;
        
        // The user is available at req.user from the protect middleware
        const user = req.user;
        if (fullName || typeof fullName === 'string') user.fullName = fullName.trim();
        if (typeof newsletterSubscribed === 'boolean') user.newsletterSubscribed = newsletterSubscribed;
        
        const updatedUser = await user.save();
        res.json({
            message: 'Your settings have been updated!',
            user: { fullName: updatedUser.fullName, email: updatedUser.email, newsletterSubscribed: updatedUser.newsletterSubscribed }
        });
    } catch (error) { res.status(500).json({ error: "Failed to update your details." }); }
});

// --- [PATCH] /api/user/change-password ---
router.patch('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        // ... (validation for password fields) ...

        const isMatch = await req.user.comparePassword(currentPassword);
        if (!isMatch) return res.status(401).json({ error: "Incorrect current password." });

        req.user.password = newPassword;
        await req.user.save();
        res.json({ message: 'Password changed successfully!' });
    } catch (error) { res.status(500).json({ error: "Failed to change password." }); }
});


// --- [POST] /api/user/request-email-change ---
router.post('/request-email-change', protect, async (req, res) => {
    try {
        // ... The logic inside this function remains largely the same ...
        // as it already deals with the logged-in req.user object.
    } catch (error) { /* ... */ }
});


// --- [DELETE] /api/user/delete-account ---
router.delete('/delete-account', protect, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: "Password is required." });
        
        const isMatch = await req.user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

        // ✅ Data integrity: Delete all user-related data before deleting the user
        await Order.deleteMany({ email: req.user.email });
        await Address.deleteMany({ email: req.user.email });
        await User.findByIdAndDelete(req.user.id);
        
        res.json({ message: "Account permanently deleted." });
    } catch (error) { res.status(500).json({ error: "Failed to delete account." }); }
});

// NOTE: The GET route for /confirm-email-change/:token remains public and does not use the `protect` middleware.

module.exports = router;