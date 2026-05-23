const Debt = require('../models/Debt');

// ─── Get All Debts ───────────────────────────────────────────────────────────
// @route   GET /api/v1/debts
// @access  Private
exports.getDebts = async (req, res) => {
  try {
    const debts = await Debt.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: debts.length,
      data: debts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Debt ─────────────────────────────────────────────────────────────
// @route   POST /api/v1/debts
// @access  Private
exports.createDebt = async (req, res) => {
  try {
    const { personName, amount, type, dueDate, notes, isPaid } = req.body;

    if (!personName || !amount || !type) {
      return res.status(400).json({ success: false, message: 'Please provide personName, amount, and type' });
    }

    const debt = await Debt.create({
      userId: req.user.id,
      personName,
      amount,
      type,
      dueDate,
      notes,
      isPaid
    });

    res.status(201).json({
      success: true,
      data: debt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Debt ─────────────────────────────────────────────────────────────
// @route   PUT /api/v1/debts/:id
// @access  Private
exports.updateDebt = async (req, res) => {
  try {
    let debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt not found' });
    }

    // Check ownership
    if (debt.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this debt' });
    }

    debt = await Debt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: debt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Debt ─────────────────────────────────────────────────────────────
// @route   DELETE /api/v1/debts/:id
// @access  Private
exports.deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt not found' });
    }

    // Check ownership
    if (debt.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this debt' });
    }

    await debt.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
