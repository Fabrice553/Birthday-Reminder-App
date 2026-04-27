const Queue = require('bull');
const config = require('../config');
const { sendBirthdayEmail } = require('./emailService');

let birthdayQueue = null;

// Initialize Birthday Queue
exports.initializeBirthdayQueue = () => {
  birthdayQueue = new Queue('birthday-emails', {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    },
  });

  // Process the queue
  birthdayQueue.process('send-birthday-email', async (job) => {
    console.log(`🔄 Processing birthday email for ${job.data.email}`);

    try {
      const result = await sendBirthdayEmail(job.data.email, job.data.username);
      console.log(`✅ Birthday email sent: ${job.data.email}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send birthday email: ${job.data.email}`);
      throw error;
    }
  });

  // Queue Event Listeners
  birthdayQueue.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  birthdayQueue.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed: ${err.message}`);
  });

  birthdayQueue.on('error', (error) => {
    console.error('Queue error:', error);
  });

  console.log('✅ Birthday Queue initialized');
  return birthdayQueue;
};

// Get Queue Instance
exports.getBirthdayQueue = () => {
  return birthdayQueue;
};

// Get Queue Stats
exports.getQueueStats = async () => {
  if (!birthdayQueue) return null;

  const counts = await birthdayQueue.getJobCounts();
  return {
    active: counts.active,
    waiting: counts.waiting,
    completed: counts.completed,
    failed: counts.failed,
  };
};

module.exports.birthdayQueue = birthdayQueue;