const express = require('express');
const router = express.Router();
const { getChefs, createChef, deleteChef } = require('../controllers/chefController');

router.get('/', getChefs);
router.post('/', createChef);
router.delete('/:id', deleteChef);

module.exports = router;
