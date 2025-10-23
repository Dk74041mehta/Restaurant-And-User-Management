const express = require('express');
const router = express.Router();
const { getClients, createClient, deleteClient } = require('../controllers/clientController');

router.get('/', getClients);
router.post('/', createClient);
router.delete('/:id', deleteClient);

module.exports = router;
