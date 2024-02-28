var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
const saltrounds = 5;
var user = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: {
    allTasks: [
      {
        type: mongoose.SchemaTypes.ObjectId,
      },
    ],
    completedTasks: {
      type: Number,
    },
    inCompletedTasks: {
      type: Number,
    },
  },
  token : {
    type : String
  },
  profilePhoto: {
    type: String,
  },
  level: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  age: {
    type: Number,
  },
  groups: {
    type: String,
  },
  points: {
    monthlyPoints: { type: [{ type: Number }] },
    weeklyPoints: [{ type: Number }],
    dailyPoints: [{ type: Number }],
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
  },
  notifications: {
    message: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  role: {
    type: String,
    default: "user",
  },
});
user.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltrounds);
  next();
});
module.exports = userModel = mongoose.model("user", user);
