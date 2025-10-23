const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  deleteTable,
  updateTableStatus,
} = require('../controllers/tableController');

// 🪑 Get all tables (Dashboard view)
router.get('/', getTables);

// ➕ Create new table (Dashboard only)
router.post('/', createTable);

// ❌ Delete table (only if not reserved)
router.delete('/:id', deleteTable);

// 🔄 Update table status (Available / Reserved)
router.patch('/:id', updateTableStatus);

module.exports = router;
