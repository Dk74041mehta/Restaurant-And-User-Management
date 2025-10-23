const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getFilteredAnalytics
} = require('../controllers/analyticsController');

// 📊 Get all-time analytics
router.get('/', getAnalytics);

// 📈 Get filtered analytics (daily, weekly, etc.)
router.get('/filter', getFilteredAnalytics);

module.exports = router;
