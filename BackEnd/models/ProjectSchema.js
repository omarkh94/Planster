const mongoose = require('mongoose');

//todo check for functions and routers if they are working correctly expectedDeadLine date 
const ProjectSchema = new mongoose.Schema({
    // TODO: name should changed to title
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    expectedDeadLine: { type: String, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false },
    projectOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CardsList', required: false }],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: this.author },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Project', ProjectSchema)

