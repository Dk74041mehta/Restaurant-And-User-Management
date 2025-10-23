const Order = require('../models/Order');
const Client = require('../models/Client');
const Chef = require('../models/Chef');

/**
 * @desc  Get overall analytics for dashboard
 * @route GET /api/analytics
 * @access Public (Dashboard)
 */
exports.getAnalytics = async (req, res) => {
  try {
    // ✅ Total Orders
    const totalOrders = await Order.countDocuments();

    // ✅ Total Revenue (sum of grandTotal)
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // ✅ Total Clients (unique phone numbers)
    const totalClients = await Client.countDocuments();

    // ✅ Total Chefs
    const totalChefs = await Chef.countDocuments();

    res.status(200).json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue,
        totalClients,
        totalChefs,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc Get filtered analytics (Daily, Weekly, Monthly, Yearly)
 * @route GET /api/analytics/filter?type=daily|weekly|monthly|yearly
 */
exports.getFilteredAnalytics = async (req, res) => {
  try {
    const { type } = req.query;

    let startDate = new Date();
    if (type === 'daily') startDate.setDate(startDate.getDate() - 1);
    else if (type === 'weekly') startDate.setDate(startDate.getDate() - 7);
    else if (type === 'monthly') startDate.setMonth(startDate.getMonth() - 1);
    else if (type === 'yearly') startDate.setFullYear(startDate.getFullYear() - 1);

    // ✅ Orders within selected timeframe
    const orders = await Order.find({ createdAt: { $gte: startDate } }).sort({ createdAt: 1 });

    // ✅ Group revenue by date
    const revenueByDate = {};
    orders.forEach(order => {
      const day = order.createdAt.toISOString().split('T')[0];
      revenueByDate[day] = (revenueByDate[day] || 0) + order.grandTotal;
    });

    res.status(200).json({
      success: true,
      filter: type,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.grandTotal, 0),
      dataPoints: Object.entries(revenueByDate).map(([date, total]) => ({ date, total })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
