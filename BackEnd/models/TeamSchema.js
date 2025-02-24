const mongoose = require('mongoose');


// const teamTitles = [
//   "Engineering",
//   "Product",
//   "Design",
//   "Marketing",
//   "Sales",
//   "Support",
//   "HR",
//   "Operations",
//   "software",
//   "Legal"
// ];

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false }],
    members: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
    }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Team', TeamSchema)



