const mongoose = require('mongoose');
const bcrypt = require("bcrypt")


const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true }, 
        phoneNumber: { type: Number, required: true },
        projects: [
            {
              project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
              role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, 
              
            }
          ], 
        password: { type: String, required: true, min: 8, max: 16 },
        team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: false }, 
        isDeleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    );




UserSchema.pre("save", async function (next) {
    this.email = this.email.toLowerCase()
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});



module.exports = mongoose.model('User', UserSchema);


