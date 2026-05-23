const Transaction = require('../models/Transaction');

// ─── Get All Transactions ────────────────────────────────────────────────────
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;

    // Build filter object
    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    
    // Date filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Search by title (regex)
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // case-insensitive
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Transaction ──────────────────────────────────────────────────────
// @route   POST /api/v1/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    // Validate required fields (can also rely on Mongoose validation)
    if (!title || !amount || !type || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, amount, type, and category' });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      date,
      notes,
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Transaction ──────────────────────────────────────────────────────
// @route   PUT /api/v1/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this transaction' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Transaction ──────────────────────────────────────────────────────
// @route   DELETE /api/v1/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
