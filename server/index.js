const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const birthdayRoutes = require('./routes/birthdayRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { initializeCronJobs } = require('./services/cronService');
const { initializeBirthdayQueue } = require('./services/queueService');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/birthday_reminder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Initialize Queue
initializeBirthdayQueue();

// Initialize Cron Jobs
initializeCronJobs();

// Routes
app.use('/api/birthdays', birthdayRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎂 Birthday Reminder App running on port ${PORT}`);
});

module.exports = app;