const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  clientName: String,
  clientPhone: String,
  type: { type: String, enum: ['Dine In', 'Take Away'], required: true },
  tableNumber: Number,
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    cookingInstructions: String,
    preparationTime: Number,
  }],
  itemTotal: Number,
  deliveryCharge: Number,
  taxes: Number,
  grandTotal: Number,
  processingTime: Number,
  assignedChef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  status: { type: String, enum: ['Pending', 'Cooking', 'Served', 'Done'], default: 'Pending' },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
