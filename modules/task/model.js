var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var task = new Schema({
 allTasks : {
  name: {
    type: String,
    required : true,
  },
  disc: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  start: {
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
  },
  end: {
    time: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  priority: {
    type: Number,
  },
  tag: {
    type: String,
  },
  isFinished: {
    type: Boolean,
  },
  steps: {
    numOfSteps: {
      type: Number,
    },
    completedSteps: {
      type: Number,
    },
  },
 groupId : { type : mongoose.SchemaTypes.ObjectId}
 },
 userId : { type : mongoose.SchemaTypes.ObjectId}
});
