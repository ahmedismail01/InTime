var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var group = new Schema({
  name: {
    type: String,
    unique : true
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      role: { type: String, default: "user" },
    },
  ],
  photo: {
    type: String,
  },
  tasks: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  chatId: mongoose.Types.ObjectId,
});
