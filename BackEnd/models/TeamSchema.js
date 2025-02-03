const mongoose = require('mongoose');


const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true , default:'project_01'},
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false
        },
        role: {
            type: mongoose.Schema.Types.ObjectId, ref: 'TeamRole', required: false
        }
    }],
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Team', TeamSchema)


