const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
// todo =>{add phone number required and gender required}
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
      },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true, min: 8, max: 16},
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });




userSchema.pre("save", async function (next) {
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



module.exports = mongoose.model('User', userSchema);


