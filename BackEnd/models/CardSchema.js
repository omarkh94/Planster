const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    comments: [ 
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
    ],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


CardSchema.pre('save', function (next) {
  if (!this.updatedBy) {
    this.updatedBy = this.author;
  }
  next();
});

module.exports = mongoose.model('Card', CardSchema);
