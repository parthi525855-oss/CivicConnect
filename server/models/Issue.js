const mongoose = require('mongoose');

const statusTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed']
    },
    updatedBy: {
      type: String,
      default: 'System'
    },
    remark: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Roads',
        'Garbage',
        'Water',
        'Drainage',
        'Streetlights',
        'Traffic',
        'Public Infrastructure',
        'Environment',
        'Other'
      ]
    },
    location: {
      type: String,
      required: [true, 'Location area is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        default: 13.0827 // Default Chennai center or customizable
      },
      lng: {
        type: Number,
        default: 80.2707
      }
    },
    landmark: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'MEDIUM', 'HIGH'],
      default: 'NORMAL'
    },
    priorityReason: {
      type: String,
      default: 'Rule-based evaluation: Standard submission'
    },
    status: {
      type: String,
      enum: ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Reported'
    },
    adminRemark: {
      type: String,
      default: ''
    },
    upvotes: {
      type: Number,
      default: 0
    },
    supportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    statusTimeline: [statusTimelineSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Issue', issueSchema);
