const { CronJob } = require('cron');
const Birthday = require('../models/birthdayModel');
const { sendBirthdayEmail } = require('./emailService');
const config = require('../config');

let birthdayCheckJob = null;

// Initialize Cron Jobs
exports.initializeCronJobs = () => {
  // Birthday Check Job - Runs at 7 AM every day
  birthdayCheckJob = new CronJob(config.cron.birthdayCheckTime, async () => {
    console.log('🔔 Running birthday check cron job...');

    try {
      const todaysBirthdays = await Birthday.getTodaysBirthdays();

      if (todaysBirthdays.length === 0) {
        console.log('No birthdays today');
        return;
      }

      console.log(`🎂 Found ${todaysBirthdays.length} birthday(s) for today`);

      // Send emails directly (no queue needed)
      for (const birthday of todaysBirthdays) {
        try {
          await sendBirthdayEmail(birthday.email, birthday.username);
          console.log(`📧 Birthday email sent to ${birthday.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${birthday.email}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error in birthday check cron job:', error);
    }
  });

  // Reset emailSentToday flag every day at midnight
  const resetJob = new CronJob('0 0 * * *', async () => {
    console.log('🔄 Resetting emailSentToday flag...');

    try {
      await Birthday.updateMany(
        { emailSentToday: true },
        { emailSentToday: false }
      );

      console.log('✅ Reset complete');
    } catch (error) {
      console.error('Error resetting emailSentToday flag:', error);
    }
  });

  // Start jobs
  birthdayCheckJob.start();
  resetJob.start();

  console.log('✅ Cron jobs initialized');
  console.log(`⏰ Birthday check scheduled for: ${config.cron.birthdayCheckTime}`);
};

// Get Cron Job Status
exports.getCronJobStatus = () => {
  return {
    running: birthdayCheckJob?.running,
    nextDate: birthdayCheckJob?.nextDate(),
  };
};

// Stop Cron Jobs
exports.stopCronJobs = () => {
  if (birthdayCheckJob) {
    birthdayCheckJob.stop();
    console.log('❌ Cron jobs stopped');
  }
};