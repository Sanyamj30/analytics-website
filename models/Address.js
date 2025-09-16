const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  // Use email to link the address to the user, keeping it consistent with your Order model.
  email: { 
    type: String, 
    required: true,
    index: true // Add an index for faster lookups by email
  },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  // Optional: A flag to mark a default address for quick checkout.
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Address", addressSchema);