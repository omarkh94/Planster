const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false }], 
    projectOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
      },
    ], 
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.pre("save", function (next) {
    this.teams = [...new Set(this.teams.map(team => team.toString()))];
    next();
  });
  

module.exports = mongoose.model('Project', ProjectSchema);
