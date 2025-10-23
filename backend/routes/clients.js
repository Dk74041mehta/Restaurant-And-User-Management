const express = require('express');
const router = express.Router();
const { getClients, createClient, deleteClient } = require('../controllers/clientController');

// ✅ all must be function references
router.get('/', getClients);
router.post('/', createClient);
router.delete('/:id', deleteClient);

module.exports = router;
