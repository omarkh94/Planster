const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },           
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], 
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],     
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
