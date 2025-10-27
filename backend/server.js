const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // User App & Dashboard
  credentials: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/chefs', require('./routes/chefs'));
app.use('/api/analytics', require('./routes/analytics'));

// Base Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Management Backend API',
    status: 'Active',
    endpoints: {
      orders: '/api/orders',
      tables: '/api/tables',
      menu: '/api/menu',
      clients: '/api/clients',
      chefs: '/api/chefs',
      analytics: '/api/analytics'
    }
  });
});

// Error Handler Middleware 
app.use(require('./middleware/errorHandler'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:5174`);
  console.log(`User App: http://localhost:5173`);
});
