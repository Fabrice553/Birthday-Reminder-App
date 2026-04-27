const express = require('express');
const router = express.Router();
const { getQueueStats } = require('../services/queueService');
const { getCronJobStatus } = require('../services/cronService');

// Queue Status Webhook
router.get('/queue/status', async (req, res) => {
  try {
    const stats = await getQueueStats();
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

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

module.exports = router;