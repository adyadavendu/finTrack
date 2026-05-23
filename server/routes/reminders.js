const express = require('express');
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.route('/:id')
  .put(updateReminder)
  .delete(deleteReminder);

module.exports = router;
