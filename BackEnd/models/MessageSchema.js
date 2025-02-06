const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    timestamp: { type: Date, default: Date.now },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notifiedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
