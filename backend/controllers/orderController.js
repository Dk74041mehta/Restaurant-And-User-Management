const Order = require('../models/Order');
const Table = require('../models/Table');
const Client = require('../models/Client');
const Chef = require('../models/Chef');

// 🧾 Create New Order (User App)
exports.createOrder = async (req, res) => {
  try {
    const {
      clientName,
      clientPhone,
      clientAddress,
      type,
      tableNumber,
      items,
      cookingInstructions
    } = req.body;

    // ✅ Unique Order ID
    const orderId = 'ORD' + Date.now();

    // ✅ Calculate totals
    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = type === 'Take Away' ? 50 : 0;
    const taxes = (itemTotal + deliveryCharge) * 0.05;
    const grandTotal = itemTotal + deliveryCharge + taxes;

    // ✅ Create new order
    const order = new Order({
      orderId,
      clientName,
      clientPhone,
      type,
      tableNumber: type === 'Dine In' ? tableNumber : null,
      items: items.map(item => ({ ...item, cookingInstructions })),
      itemTotal,
      deliveryCharge,
      taxes,
      grandTotal,
      processingTime: Math.max(...items.map(i => i.preparationTime || 15))
    });

    await order.save();

    // ✅ Update or create client
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

    // ✅ Update table (if dine-in)
    if (type === 'Dine In') {
      await Table.findOneAndUpdate(
        { tableNumber },
        { status: 'Reserved', currentOrderId: order._id },
        { new: true }
      );
    }

    // ✅ Assign to least busy chef
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
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📋 Get All Orders (Dashboard)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('assignedChef', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔄 Update Order Status (Dashboard)
exports.updateOrderStatus = async (req, res) => {
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

    // ✅ Free table if dine-in order done
    if (order.type === 'Dine In' && status === 'Done') {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { status: 'Available', currentOrderId: null }
      );
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
