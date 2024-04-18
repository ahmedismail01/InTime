const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 5;
const refreshTokenSchema = mongoose.Schema({
  refreshToken: String,
  userId: { type: mongoose.Types.ObjectId },
  createdAt: { type: Date, default: Date.now() },
});

refreshTokenSchema.pre("save", async function (next) {
  this.refreshToken = await bcrypt.hash(this.refreshToken, saltrounds);
  next();
});

module.exports = model = mongoose.model("refreshToken", refreshTokenSchema);
