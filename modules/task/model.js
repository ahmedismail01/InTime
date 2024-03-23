var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var taskSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique : true
  },
  disc: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  startAt: Date,
  end: Date,
  priority: {
    type: Number,
  },
  tag: {
    type: String,
  },
  isFinished: {
    type: Boolean,
  },
  steps: [
    {
      stepDisc: String,
      completed: Boolean,
    },
  ],
  groupId: { type: mongoose.SchemaTypes.ObjectId },
  userId: { type: mongoose.SchemaTypes.ObjectId },
});

module.exports = userModel = mongoose.model("task", taskSchema);
