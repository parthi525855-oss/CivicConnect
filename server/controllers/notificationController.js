const dataService = require('../services/dataService');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notifications = await dataService.findNotifications(userId, 30);
    const unreadCount = await dataService.countUnreadNotifications(userId);

    return res.status(200).json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving notifications'
    });
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const notification = await dataService.markNotificationRead(id, userId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating notification'
    });
  }
};

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await dataService.markAllNotificationsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error marking all notifications as read'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
