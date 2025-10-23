const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  deleteTable,
  updateTableStatus,
} = require('../controllers/tableController');

router.get('/', getTables);
router.post('/', createTable);
router.delete('/:id', deleteTable);
router.patch('/:id', updateTableStatus);

module.exports = router;
