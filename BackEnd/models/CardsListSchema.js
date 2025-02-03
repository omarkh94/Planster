const mongoose = require('mongoose');


const CardsListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    list: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: false },
    ],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default:this.author},
    isDeleted: { type: Boolean, default: false }, 
  }, { timestamps: true });

module.exports = mongoose.model('CardsList', CardsListSchema);
