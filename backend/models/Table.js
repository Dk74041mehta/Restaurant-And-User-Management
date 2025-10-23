const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  tableName: String,
  chairs: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Reserved'], default: 'Available' },
  currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
