const mongoose = require('mongoose');

// ─── Reminder Schema ─────────────────────────────────────────────────────────
const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  amount: {
    type: Number,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringInterval: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reminder', reminderSchema);
