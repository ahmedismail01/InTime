var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var message = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
  },
  message: {
    type: String,
  },
  createdAt: {},
  type: {},
});

module.exports = model = mongoose.model("message", message);
