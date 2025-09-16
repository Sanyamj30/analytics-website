// --- File: routes/addressRoutes.js (Final Corrected Version) ---

const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Your GET and DELETE routes are correct.

/**
 * @route   POST /api/addresses
 * @desc    Create a new address for the currently logged-in user
 * @access  Private
 */
router.post("/", async (req, res) => {
  try {
    // --- ✅ THE CRITICAL FIX IS HERE ---
    // 1. Take the entire body from the request (street, city, etc.)
    const addressData = req.body;
    
    // 2. Securely add the user's email from their token.
    // This is much safer than destructuring and rebuilding.
    addressData.email = req.user.email;

    // 3. Create the new address with the complete, validated data.
    const newAddress = new Address(addressData);
    await newAddress.save();

    res.status(201).json({ message: "Address saved successfully!", address: newAddress });

  } catch (err) {
    // --- ✅ IMPROVED ERROR HANDLING ---
    // 4. If Mongoose validation fails, log the real error and send it.
    console.error("!!! ADDRESS SAVE FAILED !!!");
    console.error("Validation Error Details:", err.message); // This will show in your terminal

    // Send a more specific error message back to the frontend
    res.status(400).json({ error: "Failed to save address.", details: err.message });
  }
});


// Your other routes (GET, DELETE) remain the same.

module.exports = router;