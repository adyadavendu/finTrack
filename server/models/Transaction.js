const mongoose = require('mongoose');

// ─── Shared category enum used across Transaction and Budget ─────────────────
const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Salary', 'Freelance', 'Investment', 'Other',
];

// ─── Transaction Schema ──────────────────────────────────────────────────────
const transactionSchema = new mongoose.Schema({
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
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: CATEGORIES,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the categories array so other models can reuse it
module.exports = mongoose.model('Transaction', transactionSchema);
module.exports.CATEGORIES = CATEGORIES;
