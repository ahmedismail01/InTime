const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 5;
const refreshTokenSchema = mongoose.Schema({
  refreshToken: String,
  userId: { type: mongoose.Types.ObjectId },
  createdAt: { type: Date },
});

refreshTokenSchema.pre("save", async function () {
  this.refreshToken = await bcrypt.hash(this.refreshToken, saltrounds);
});

module.exports = model = mongoose.model("refreshToken", refreshTokenSchema);
