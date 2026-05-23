const mongoose = require('mongoose');

// ─── Debt Schema ─────────────────────────────────────────────────────────────
const debtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  personName: {
    type: String,
    required: [true, 'Person name is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  type: {
    type: String,
    enum: ['owed_to_me', 'i_owe'],
    required: [true, 'Type is required'],
  },
  dueDate: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
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

module.exports = mongoose.model('Debt', debtSchema);
