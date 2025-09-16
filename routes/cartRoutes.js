const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  const { userId, items, totalAmount, paymentMethod, email } = req.body;

  if (!email) return res.status(400).send("User email is required.");

  try {
    const order = new Order({
      userId,
      email,
      items,
      totalAmount,
      paymentMethod,
      date: new Date(),
      status: "Pending"
    });

    await order.save();
    res.status(200).json({ orderId: order._id });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).send("Failed to place order.");
  }
};
