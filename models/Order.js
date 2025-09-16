// --- START OF FILE Order.js ---

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: String,
  items: Array,
  totalAmount: Number,
  paymentMethod: { type: String, default: "Cash on delivery" },
  razorpayPaymentId: { type: String, default: null },
  // ✅ Use an enum to define all possible order statuses
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);