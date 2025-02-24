const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    projectOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expectedDeadLine: { type: String, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false },
    list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlowList', required: true }],
    isDeleted: { type: Boolean, default: false },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Project', ProjectSchema);
