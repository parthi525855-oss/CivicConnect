const dataService = require('../services/dataService');

// @desc    Get user profile with civic statistics
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await dataService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const totalReports = await dataService.countIssues({ userId });
    const resolvedReports = await dataService.countIssues({
      userId,
      status: { $in: ['Resolved', 'Closed'] }
    });
    const pendingReports = await dataService.countIssues({
      userId,
      status: { $in: ['Reported', 'Under Review', 'Assigned', 'In Progress'] }
    });
    const inProgressReports = await dataService.countIssues({
      userId,
      status: 'In Progress'
    });

    const safeUser = { ...user };
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      data: {
        ...safeUser,
        stats: {
          totalReports,
          resolvedReports,
          pendingReports,
          inProgressReports
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, phone, address } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address.trim();

    const updatedUser = await dataService.updateUser(userId, updates);
    const safeUser = { ...updatedUser };
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: safeUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
