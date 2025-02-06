const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlowList', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    expectedDeadLine: { type: String, required: true , required: false},
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
    ],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


TicketSchema.pre('save', function (next) {
  if (!this.updatedBy) {
    this.updatedBy = this.author;
  }
  next();
});

module.exports = mongoose.model('Ticket', TicketSchema);
