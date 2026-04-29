const express = require('express');
const router = express.Router();
const { getCronJobStatus } = require('../services/cronService');

// Cron Job Status Webhook
router.get('/cron/status', (req, res) => {
  try {
    const status = getCronJobStatus();
    res.status(200).json({
      success: true,
      data: status,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health Check Webhook
router.get('/health', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Webhook service is healthy',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;