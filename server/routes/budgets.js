const express = require('express');
const {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(createOrUpdateBudget);

router.route('/:id')
  .delete(deleteBudget);

module.exports = router;
