// --- File: routes/orderRoutes.js (Fully Secured and Final Version) ---

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware'); // Import our JWT protector middleware

/**
 * @route   GET /api/orders
 * @desc    Get all orders belonging to the currently logged-in user
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    // The user's identity (`req.user`) is securely provided by the `protect` middleware.
    const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by its ID, ensuring it belongs to the logged-in user
 * @access  Private
 */
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        // ✅ SECURITY CHECK: Ensure the order exists AND that its email matches the logged-in user's email.
        if (!order || order.email !== req.user.email) {
            return res.status(404).json({ error: "Order not found." });
        }
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch order details." });
    }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new order for the currently logged-in user
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, razorpayPaymentId } = req.body;
    if (!items || !totalAmount) {
        return res.status(400).json({ error: "Missing required order information." });
    }
    const newOrder = await Order.create({
      email: req.user.email, // The user's email comes securely from their token.
      items,
      totalAmount,
      paymentMethod,
      razorpayPaymentId: razorpayPaymentId || null
    });
    res.status(201).json({ message: "Order created successfully!", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: "Order creation failed." });
  }
});

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Cancel an existing order, ensuring it belongs to the logged-in user
 * @access  Private
 */
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // ✅ FINAL SECURITY CHECK: This is the critical fix.
    // 1. Check if the order exists.
    // 2. Check if the order's email matches the email of the person making the request (from their token).
    if (!order || order.email !== req.user.email) {
      return res.status(404).json({ error: "Order not found or you are not authorized to cancel it." });
    }

    if (order.status !== 'Processing') {
      return res.status(400).json({ error: `This order cannot be cancelled as its status is "${order.status}".` });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: "Your order has been successfully cancelled.", order });

  } catch (err) {
    res.status(500).json({ error: "Failed to cancel the order." });
  }
});

module.exports = router;