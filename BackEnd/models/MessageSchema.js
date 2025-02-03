const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },          
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  isDeleted: { type: Boolean, default: false },
  replies: [{
    reply: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  }],  
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
