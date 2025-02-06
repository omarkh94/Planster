const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  
  role: {
    type: String,
    enum: ['admin', 'supervisor', 'member'],
    required: true,
  },
  permissions: {
    type: [String],
    required: true
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
