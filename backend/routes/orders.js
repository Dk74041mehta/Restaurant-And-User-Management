const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// 🧾 Create new order (used by User App)
router.post('/', createOrder);

// 📋 Get all orders (used by Dashboard)
router.get('/', getOrders);

// 🔄 Update order status (used by Dashboard)
router.patch('/:id', updateOrderStatus);

module.exports = router;
