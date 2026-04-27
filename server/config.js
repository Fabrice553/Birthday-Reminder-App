module.exports = {
  // Email Configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@birthdayreminder.com',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/birthday_reminder',
  },

  // Redis Configuration for Bull Queue
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },

  // Cron Job Configuration
  cron: {
    birthdayCheckTime: process.env.CRON_TIME || '0 7 * * *', // 7 AM daily
  },

  // Application Configuration
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};