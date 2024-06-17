var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProjectSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  members: [
    {
      memberId: { type: mongoose.Types.ObjectId },
      role: { type: String, default: "user" },
    },
  ],
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = Project = mongoose.model("PROJECT", ProjectSchema);
