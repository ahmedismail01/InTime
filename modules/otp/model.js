const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, uinque: true },
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = OTP = mongoose.model("OTP", OTPSchema);
