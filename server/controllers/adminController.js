const dataService = require('../services/dataService');

// @desc    Get admin dashboard summary data
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboard = async (req, res) => {
  try {
    const dashboardData = await dataService.getDashboardData();
    return res.status(200).json({
      success: true,
      ...dashboardData
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin dashboard statistics'
    });
  }
};

// @desc    Get detailed civic issue analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin or Citizen inspection)
const getAdminAnalytics = async (req, res) => {
  try {
    const analyticsData = await dataService.getAnalyticsData();
    return res.status(200).json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving analytics data'
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAdminAnalytics
};
