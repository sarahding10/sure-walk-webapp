const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const riderRoutes = require('../routes/riderRoutes');
const driverRoutes = require('../routes/driverRoutes');
const adminRoutes = require('../routes/adminRoutes');
const authRoutes = require('../routes/authRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/rider', riderRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server error', error: err.message });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).send();  // No content
});

app.get('/favicon.png', (req, res) => {
  res.status(204).send();  // No content
});

// Handle root path ("/")
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the API!');
});

module.exports = app;
