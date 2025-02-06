const mongoose = require('mongoose');


const TeamSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }], 
        isDeleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    );
module.exports = mongoose.model('Team', TeamSchema)



