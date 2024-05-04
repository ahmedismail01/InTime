const mongoose = require("mongoose");

const otplifespan = process.env.OTP_LIFESPAN * 60;
const OTPSchema = new mongoose.Schema({
  email: { type: String, uinque: true },
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: otplifespan,
  },
});

module.exports = OTP = mongoose.model("OTP", OTPSchema);
