var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
const saltrounds = 5;
var user = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "avatarDefault.jpg",
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
    daily: [
      {
        date: {
          type: Date,
          required: true,
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    monthly: [
      {
        month: {
          type: Number,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    yearly: [
      {
        year: {
          type: Number,
          required: true,
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalPoints: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
  },
  tasks: {
    completedTasks: { type: Number, default: 0 },
    onGoingTasks: { type: Number, default: 0 },
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
  title: {
    type: String,
    default: null,
  },
  about: {
    type: String,
    default: null,
  },
});
user.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltrounds);
  next();
});
module.exports = userModel = mongoose.model("user", user);
