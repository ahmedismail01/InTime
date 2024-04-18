var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var taskSchema = new Schema({
  name: {
    type: String,
    required: [true, "name required"],
  },
  disc: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  startAt: Date,
  endAt: Date,
  priority: {
    type: Number,
    default: 0,
  },
  tag: {
    type: String,
  },
  repeat: {
    isRepeated: { type: Boolean, default: false },
    repeadEvery: String,
    repeatTimes: Number,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  steps: [
    {
      stepDisc: String,
      completed: { type: Boolean, default: false },
    },
  ],
  groupId: { type: mongoose.SchemaTypes.ObjectId },
  userId: { type: mongoose.SchemaTypes.ObjectId },
});

module.exports = userModel = mongoose.model("task", taskSchema);
