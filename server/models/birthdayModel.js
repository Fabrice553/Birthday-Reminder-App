const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function (v) {
          return v < new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },
    month: {
      type: Number,
    },
    day: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailSentToday: {
      type: Boolean,
      default: false,
    },
    lastEmailSent: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to extract month and day
birthdaySchema.pre('save', function (next) {
  if (this.dateOfBirth) {
    this.month = this.dateOfBirth.getMonth() + 1; // getMonth() returns 0-11
    this.day = this.dateOfBirth.getDate();
  }
  next();
});

// Method to check if today is birthday
birthdaySchema.methods.isBirthdayToday = function () {
  const today = new Date();
  return this.month === today.getMonth() + 1 && this.day === today.getDate();
};

// Static method to get today's birthdays
birthdaySchema.statics.getTodaysBirthdays = async function () {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return this.find({
    month,
    day,
    isActive: true,
    emailSentToday: false,
  });
};

module.exports = mongoose.model('Birthday', birthdaySchema);