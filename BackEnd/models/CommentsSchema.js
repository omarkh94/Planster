const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    description: { type: String, required: true },
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
