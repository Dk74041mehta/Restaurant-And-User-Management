const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  address: String,
  totalOrders: { type: Number, default: 0 },
  lastOrderAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
