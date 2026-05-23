const express = require('express');
const {
  getMonthlySummary,
  getCategoryBreakdown,
  getOverview,
  mlBridge
} = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlySummary);
router.get('/categories', getCategoryBreakdown);
router.get('/overview', getOverview);
router.get('/ml-insights', mlBridge);

module.exports = router;
