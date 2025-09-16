// --- File: models/User.js (Complete Version) ---

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Used for generating secure random tokens

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    index: true 
  },
  password: { 
    type: String, 
    required: true 
  },

  // Fields for secure email changes
  newEmail: { type: String, lowercase: true, default: null },
  emailChangeToken: { type: String, default: null },
  emailChangeExpires: { type: Date, default: null },

  // ✅ ADDED: Fields for secure password resets
  passwordResetToken: String,
  passwordResetExpires: Date

});

// This "pre-save hook" automatically hashes the password whenever it's changed.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// This method compares an entered password with the hashed password in the database.
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ ADDED: This method generates a temporary, secure token for password resets.
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // For security, we save a HASHED version of the token to the database.
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set the token to expire in 10 minutes from now.
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    // We return the UN-HASHED token to be sent in the email link.
    return resetToken;
};


module.exports = mongoose.model("User", userSchema);