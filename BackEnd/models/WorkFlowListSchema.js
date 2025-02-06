const mongoose = require('mongoose');


mongoose
const WorkFlowListSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
      enum: ["Backlog", "To Do", "In Progress", "Blocked", "Code Review", "Ready for QA", "QA In Progress", "Approved", "Done", "Deployed"]
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: function() { return this.author; } },
  isDeleted: { type: Boolean, default: false }, 
}, { timestamps: true });

module.exports = mongoose.model('WorkFlowList', WorkFlowListSchema);