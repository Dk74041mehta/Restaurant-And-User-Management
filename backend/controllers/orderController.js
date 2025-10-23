const Order = require('../models/Order');
const Table = require('../models/Table');
const Client = require('../models/Client');
const Chef = require('../models/Chef');

exports.createOrder = async (req, res, next) => {
  try {
    const {
      clientName,
      clientPhone,
      clientAddress,
      type,
      items,
      cookingInstructions
    } = req.body;

    const orderId = 'ORD' + Date.now();
    const tableNumber = type === 'Dine In' ? req.body.tableNumber : null;

    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = type === 'Take Away' ? 50 : 0;
    const taxes = (itemTotal + deliveryCharge) * 0.05;
    const grandTotal = itemTotal + deliveryCharge + taxes;

    const order = new Order({
      orderId,
      clientName,
      clientPhone,
      type,
      tableNumber,
      items: items.map(item => ({ ...item, cookingInstructions })),
      itemTotal,
      deliveryCharge,
      taxes,
      grandTotal,
      processingTime: Math.max(...items.map(i => i.preparationTime || 15))
    });

    await order.save();

    let client = await Client.findOne({ phone: clientPhone });
    if (!client) {
      client = new Client({
        name: clientName,
        phone: clientPhone,
        address: clientAddress,
        totalOrders: 0
      });
    }

    client.totalOrders += 1;
    client.lastOrderAt = new Date();
    await client.save();

    if (type === 'Dine In' && tableNumber) {
      await Table.findOneAndUpdate(
        { tableNumber },
        { status: 'Reserved', currentOrderId: order._id }
      );
    }

    const chef = await Chef.findOne().sort({ ordersAssigned: 1 });
    if (chef) {
      chef.ordersAssigned += 1;
      chef.currentOrders.push(order._id);
      await chef.save();

      order.assignedChef = chef._id;
      await order.save();
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('assignedChef', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, completedAt: status === 'Done' ? new Date() : null },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.type === 'Dine In' && status === 'Done') {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { status: 'Available', currentOrderId: null }
      );
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
