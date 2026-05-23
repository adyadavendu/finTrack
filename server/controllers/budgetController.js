const Budget = require('../models/Budget');

// ─── Get Budgets ─────────────────────────────────────────────────────────────
// @route   GET /api/v1/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Default to current month/year if not provided
    const currentDate = new Date();
    const queryMonth = month ? parseInt(month) : currentDate.getMonth() + 1; // getMonth() is 0-indexed
    const queryYear = year ? parseInt(year) : currentDate.getFullYear();

    const budgets = await Budget.find({
      userId: req.user.id,
      month: queryMonth,
      year: queryYear,
    });

    res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create or Update Budget (Upsert) ────────────────────────────────────────
// @route   POST /api/v1/budgets
// @access  Private
exports.createOrUpdateBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    if (!category || limit === undefined || !month || !year) {
      return res.status(400).json({ success: false, message: 'Please provide category, limit, month, and year' });
    }

    // Use findOneAndUpdate with upsert: true to update if exists, or create new
    const budget = await Budget.findOneAndUpdate(
      {
        userId: req.user.id,
        category,
        month,
        year,
      },
      {
        $set: { limit }, // Only update limit if it exists
      },
      {
        new: true, // Return the modified document
        upsert: true, // Create a new document if no documents match the filter
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
       return res.status(400).json({ success: false, message: Object.values(error.errors).map(val => val.message).join(', ') });
    }
    // Handle duplicate key error (if our upsert somehow hit a race condition)
    if (error.code === 11000) {
       return res.status(400).json({ success: false, message: 'Budget already exists for this category/month/year' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Budget ───────────────────────────────────────────────────────────
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    // Check ownership
    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this budget' });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
