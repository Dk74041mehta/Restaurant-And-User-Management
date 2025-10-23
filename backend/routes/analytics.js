const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getFilteredAnalytics
} = require('../controllers/analyticsController');

router.get('/', getAnalytics);
router.get('/filter', getFilteredAnalytics);

module.exports = router;
