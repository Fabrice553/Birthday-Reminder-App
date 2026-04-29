const Birthday = require('../models/birthdayModel');
const { sendBirthdayEmail } = require('../services/emailService');
const Joi = require('joi');

// Validation Schema
const birthdaySchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  dateOfBirth: Joi.date().max('now').required(),
});

// Create Birthday Entry
exports.createBirthday = async (req, res) => {
  try {
    const { error, value } = birthdaySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if email already exists
    const existingBirthday = await Birthday.findOne({ email: value.email });
    if (existingBirthday) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const birthday = new Birthday(value);
    await birthday.save();

    res.status(201).json({
      success: true,
      message: 'Birthday entry created successfully',
      data: birthday,
    });
  } catch (error) {
    console.error('Error creating birthday:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating birthday entry',
      error: error.message,
    });
  }
};

// Get All Birthdays
exports.getAllBirthdays = async (req, res) => {
  try {
    const birthdays = await Birthday.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: birthdays.length,
      data: birthdays,
    });
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching birthdays',
      error: error.message,
    });
  }
};

// Get Single Birthday
exports.getBirthdayById = async (req, res) => {
  try {
    const birthday = await Birthday.findById(req.params.id);

    if (!birthday) {
      return res.status(404).json({
        success: false,
        message: 'Birthday entry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: birthday,
    });
  } catch (error) {
    console.error('Error fetching birthday:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching birthday',
      error: error.message,
    });
  }
};

// Update Birthday
exports.updateBirthday = async (req, res) => {
  try {
    const { error, value } = birthdaySchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((e) => e.message),
      });
    }

    const birthday = await Birthday.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!birthday) {
      return res.status(404).json({
        success: false,
        message: 'Birthday entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Birthday entry updated successfully',
      data: birthday,
    });
  } catch (error) {
    console.error('Error updating birthday:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating birthday',
      error: error.message,
    });
  }
};

// Delete Birthday (Soft Delete)
exports.deleteBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!birthday) {
      return res.status(404).json({
        success: false,
        message: 'Birthday entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Birthday entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting birthday:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting birthday',
      error: error.message,
    });
  }
};

// Get Today's Birthdays
exports.getTodaysBirthdays = async (req, res) => {
  try {
    const birthdays = await Birthday.getTodaysBirthdays();

    res.status(200).json({
      success: true,
      count: birthdays.length,
      data: birthdays,
    });
  } catch (error) {
    console.error('Error fetching today\'s birthdays:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s birthdays',
      error: error.message,
    });
  }
};

// Manually Trigger Birthday Reminders (Testing)
exports.triggerBirthdayReminders = async (req, res) => {
  try {
    const birthdays = await Birthday.getTodaysBirthdays();

    if (birthdays.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No birthdays today',
        count: 0,
        data: [],
        results: [],
      });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Send emails directly (no queue)
    for (const birthday of birthdays) {
      try {
        await sendBirthdayEmail(birthday.email, birthday.username);
        
        results.push({
          email: birthday.email,
          username: birthday.username,
          status: 'success',
          message: 'Birthday email sent successfully',
        });
        successCount++;
        
        console.log(`✅ Birthday email sent to ${birthday.email}`);
      } catch (error) {
        results.push({
          email: birthday.email,
          username: birthday.username,
          status: 'failed',
          message: error.message,
        });
        failureCount++;
        
        console.error(`❌ Failed to send email to ${birthday.email}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Birthday reminders processed - ${successCount} sent, ${failureCount} failed`,
      count: {
        total: birthdays.length,
        success: successCount,
        failed: failureCount,
      },
      data: birthdays,
      results: results,
    });
  } catch (error) {
    console.error('Error triggering reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering reminders',
      error: error.message,
    });
  }
};