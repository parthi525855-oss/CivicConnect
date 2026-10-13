const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminAnalytics
} = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/dashboard', protect, requireAdmin, getAdminDashboard);
router.get('/analytics', protect, requireAdmin, getAdminAnalytics);

module.exports = router;
