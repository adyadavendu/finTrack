const Reminder = require('../models/Reminder');

// ─── Get All Reminders ───────────────────────────────────────────────────────
// @route   GET /api/v1/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Reminder ─────────────────────────────────────────────────────────
// @route   POST /api/v1/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    const { title, amount, dueDate, isRecurring, recurringInterval, isPaid } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide title and dueDate' });
    }

    const reminder = await Reminder.create({
      userId: req.user.id,
      title,
      amount,
      dueDate,
      isRecurring,
      recurringInterval,
      isPaid
    });

    res.status(201).json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Reminder ─────────────────────────────────────────────────────────
// @route   PUT /api/v1/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    // Check ownership
    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this reminder' });
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Reminder ─────────────────────────────────────────────────────────
// @route   DELETE /api/v1/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    // Check ownership
    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this reminder' });
    }

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
