const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Welcome Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); 
});

// Routes
app.use('/api/birthdays', require('./routes/birthdayRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/birthday_reminder';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Initialize Cron Jobs
const { initializeCronJobs } = require('./services/cronService');
initializeCronJobs();

// Routes
app.use('/api/birthdays', require('./routes/birthdayRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎂 Birthday Reminder App running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;