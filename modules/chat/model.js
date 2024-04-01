var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chat = new Schema({
  groupId: {
    type: Schema.Types.ObjectId
  },
  messages: {
    type: String
  },
  admin: {
    type: Schema.Types.ObjectId
  },
  policy: {
    chatPolicy : String,
  }
});

module.exports = model = mongoose.model("chat" , chat)