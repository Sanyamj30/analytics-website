const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.saveCart = async (req, res) => {
  const { userId, items } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = items;
      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      await Cart.create({ userId, items });
    }
    res.status(200).json({ message: 'Cart saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving cart' });
  }
};

exports.createOrder = async (req, res) => {
  const { email, items, totalAmount, paymentMethod, razorpayPaymentId } = req.body;


  try {
    const newOrder = await Order.create({
  email,
  items,
  totalAmount,
  paymentMethod,
  razorpayPaymentId: razorpayPaymentId || null
});


    res.status(201).json({ orderId: newOrder._id });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
};


