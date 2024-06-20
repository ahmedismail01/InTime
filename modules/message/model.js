var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var message = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
  },
  message: {
    type: String,
  },
  type: { type: String, default: "text" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = model = mongoose.model("Message", message);
