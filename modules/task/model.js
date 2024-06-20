var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const moment = require("moment-timezone");

const cairoTime = moment.tz("Africa/Cairo");

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
  image: { type: String },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  priority: {
    type: Number,
    default: 0,
  },
  tag: {
    name: String,
    color: String,
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
  projectId: { type: mongoose.SchemaTypes.ObjectId },
  userId: { type: mongoose.SchemaTypes.ObjectId },
  projectTask: { type: Boolean, default: false },
  backlog: { type: Boolean, default: false },
});

module.exports = userModel = mongoose.model("task", taskSchema);
