var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var group = new Schema({
  name: {
    type: String
  },
  members: {
    type: String
  },
  photo: {
    type: String
  },
  tasks: {
    type: String
  },
  createdAt: {
    type: Date
  }
});