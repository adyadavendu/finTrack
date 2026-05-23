const mongoose = require('mongoose');
const { CATEGORIES } = require('./Transaction');

// ─── Budget Schema ───────────────────────────────────────────────────────────
const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: CATEGORIES,
  },
  limit: {
    type: Number,
    required: [true, 'Limit is required'],
    min: [0, 'Limit cannot be negative'],
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Compound Unique Index ───────────────────────────────────────────────────
// Ensures only one budget per category per month per year for a user
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
