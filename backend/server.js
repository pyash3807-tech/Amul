const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/accounts', require('./routes/accounts'));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Serve static assets from frontend build folder in production
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Wildcard client router: send index.html for non-API client routes
app.get('*splat', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: `API Route ${req.originalUrl} not found` });
  }
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
}

module.exports = app;
