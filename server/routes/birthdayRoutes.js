const express = require('express');
const router = express.Router();
const birthdayController = require('../controllers/birthdayController');

// Create a new birthday entry
router.post('/', birthdayController.createBirthday);

// Get all birthdays
router.get('/', birthdayController.getAllBirthdays);

// Get today's birthdays
router.get('/today', birthdayController.getTodaysBirthdays);

// Get specific birthday
router.get('/:id', birthdayController.getBirthdayById);

// Update birthday
router.put('/:id', birthdayController.updateBirthday);

// Delete birthday
router.delete('/:id', birthdayController.deleteBirthday);

// Manually trigger reminders (testing)
router.post('/trigger/reminders', birthdayController.triggerBirthdayReminders);

module.exports = router;