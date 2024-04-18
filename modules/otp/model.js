const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, uinque: true },
  otp: String,
  createdAt: { type: Date, default: Date.now(), expires: 1200 },
});

module.exports = OTP = mongoose.model("OTP", OTPSchema);
