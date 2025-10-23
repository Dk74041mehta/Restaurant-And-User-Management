const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  averagePreparationTime: { type: Number, default: 15 },
  category: String,
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
