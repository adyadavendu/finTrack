const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// ─── Helper function to get start and end dates of a month ───────────────────
const getMonthDateRange = (year, month) => {
  // month is 1-indexed (1-12)
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// ─── Get Monthly Summary ─────────────────────────────────────────────────────
// @route   GET /api/v1/summary/monthly
// @access  Private
exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    
    const queryMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const queryYear = year ? parseInt(year) : currentDate.getFullYear();

    const { startDate, endDate } = getMonthDateRange(queryYear, queryMonth);

    // MongoDB Aggregation Pipeline
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    const result = summary.length > 0 ? summary[0] : { totalIncome: 0, totalExpenses: 0, transactionCount: 0 };
    const netSavings = result.totalIncome - result.totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        totalIncome: result.totalIncome,
        totalExpenses: result.totalExpenses,
        netSavings,
        transactionCount: result.transactionCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Category Breakdown ──────────────────────────────────────────────────
// @route   GET /api/v1/summary/categories
// @access  Private
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    
    const queryMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const queryYear = year ? parseInt(year) : currentDate.getFullYear();

    const { startDate, endDate } = getMonthDateRange(queryYear, queryMonth);

    const breakdown = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
          type: 'expense', // usually we only want category breakdown for expenses
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
          count: 1,
        },
      },
      {
        $sort: { total: -1 }, // sort by total descending
      },
    ]);

    res.status(200).json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Overview (Last 6 Months) ────────────────────────────────────────────
// @route   GET /api/v1/summary/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    const currentDate = new Date();
    // Get start date 6 months ago (start of that month)
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);

    const overview = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $addFields: {
          savings: { $subtract: ['$income', '$expenses'] },
          year: '$_id.year',
          month: '$_id.month',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { year: 1, month: 1 }, // chronological order
      },
    ]);

    // Fill in missing months with 0s for chart consistency
    // This is optional but good practice for charting libraries
    const filledOverview = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed
      
      const existingData = overview.find(item => item.year === year && item.month === month);
      if (existingData) {
        filledOverview.push(existingData);
      } else {
        filledOverview.push({ year, month, income: 0, expenses: 0, savings: 0 });
      }
    }

    res.status(200).json({
      success: true,
      data: filledOverview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ML Bridge Placeholder ───────────────────────────────────────────────────
// @route   GET /api/v1/summary/ml-insights
// @access  Private
exports.mlBridge = async (req, res) => {
  try {
    // Placeholder for ML service communication
    res.status(200).json({
      success: true,
      data: {
        available: false,
        message: "ML service is currently offline or not implemented."
      }
    });
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
};
