const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    },
    complaintId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['STATUS_UPDATE', 'PRIORITY_UPDATE', 'ADMIN_REMARK', 'SUPPORT_MILESTONE', 'SYSTEM'],
      default: 'STATUS_UPDATE'
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
