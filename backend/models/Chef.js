const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: String,
  ordersAssigned: { type: Number, default: 0 },
  currentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

module.exports = mongoose.model('Chef', chefSchema);
