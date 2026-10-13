const dataService = require('../services/dataService');
const { evaluateSmartPriority } = require('../utils/priorityEngine');

// Helper to generate next sequential complaint ID
const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `CIV-${currentYear}-`;

  const latestIssue = await dataService.getLatestComplaintWithPrefix(prefix);

  let sequence = 1;
  if (latestIssue && latestIssue.complaintId) {
    const parts = latestIssue.complaintId.split('-');
    if (parts.length === 3) {
      const num = parseInt(parts[2], 10);
      if (!isNaN(num)) {
        sequence = num + 1;
      }
    }
  }

  // Ensure unique ID in case of concurrent records
  let candidateId = `${prefix}${String(sequence).padStart(4, '0')}`;
  let exists = await dataService.findIssueById(candidateId);
  while (exists) {
    sequence += 1;
    candidateId = `${prefix}${String(sequence).padStart(4, '0')}`;
    exists = await dataService.findIssueById(candidateId);
  }

  return candidateId;
};

const DEFAULT_CATEGORY_IMAGES = {
  Roads: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
  Garbage: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80',
  Water: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
  Drainage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
  Streetlights: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
  Traffic: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&auto=format&fit=crop&q=80',
  'Public Infrastructure': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
  Environment: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
};

// @desc    Create a new civic issue report
// @route   POST /api/issues
// @access  Private (Citizen or Admin)
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      landmark,
      priority,
      lat,
      lng
    } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and location'
      });
    }

    const complaintId = await generateComplaintId();

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      imageUrl = DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES.Other;
    }

    const coordinates = {
      lat: lat ? parseFloat(lat) : 13.0827 + (Math.random() - 0.5) * 0.08,
      lng: lng ? parseFloat(lng) : 80.2707 + (Math.random() - 0.5) * 0.08
    };

    const smartEval = evaluateSmartPriority({
      category,
      upvotes: 0,
      title,
      description,
      requestedPriority: priority
    });

    const userId = req.user._id || req.user.id;

    const issue = await dataService.createIssue({
      complaintId,
      userId,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      landmark: landmark ? landmark.trim() : '',
      image: imageUrl,
      coordinates,
      priority: smartEval.priority,
      priorityReason: smartEval.reason,
      status: 'Reported',
      adminRemark: '',
      upvotes: 0,
      supportedBy: [],
      statusTimeline: [
        {
          status: 'Reported',
          updatedBy: req.user.name,
          remark: 'Issue reported by citizen',
          timestamp: new Date()
        }
      ]
    });

    // Notification for author
    await dataService.createNotification({
      userId,
      issueId: issue._id || issue.id,
      complaintId: issue.complaintId,
      type: 'STATUS_UPDATE',
      message: `Your complaint ${issue.complaintId} has been successfully registered and is under review.`
    });

    return res.status(201).json({
      success: true,
      message: 'Civic issue report created successfully',
      data: issue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating issue'
    });
  }
};

// @desc    Get all issues with filtering, search, sorting
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res) => {
  try {
    const {
      category,
      status,
      priority,
      search,
      myIssues,
      sort = 'newest',
      page,
      limit
    } = req.query;

    const myIssuesUserId =
      myIssues === 'true' && req.user ? req.user._id || req.user.id : null;

    const issues = await dataService.findIssues({
      category,
      status,
      priority,
      search,
      myIssuesUserId,
      sort
    });

    // Optional safe pagination preserving full backwards-compatibility
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const total = issues.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedData = issues.slice(startIndex, startIndex + limitNum);

      return res.status(200).json({
        success: true,
        count: paginatedData.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        data: paginatedData
      });
    }

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('Get issues error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving issues'
    });
  }
};

// @desc    Get single issue by ID or complaintId
// @route   GET /api/issues/:id
// @access  Public
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await dataService.findIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Get issue by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving issue details'
    });
  }
};

// @desc    Update an issue
// @route   PUT /api/issues/:id
// @access  Private (Owner or Admin)
const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await dataService.findIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const ownerId = (issue.userId?._id || issue.userId)?.toString();
    const currentUserId = (req.user._id || req.user.id)?.toString();

    if (ownerId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this issue'
      });
    }

    const { title, description, category, location, landmark } = req.body;
    const updates = {};

    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (category) updates.category = category;
    if (location) updates.location = location.trim();
    if (landmark !== undefined) updates.landmark = landmark.trim();
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    // Recalculate smart rule-based priority if relevant content changed,
    // preserving explicit admin priority overrides
    if (title || description || category) {
      const isOverride = (issue.priorityReason || '').startsWith('Admin override:');
      if (!isOverride) {
        const smartEval = evaluateSmartPriority({
          category: updates.category || issue.category,
          upvotes: issue.upvotes || 0,
          title: updates.title || issue.title,
          description: updates.description || issue.description,
          requestedPriority: issue.priority
        });
        updates.priority = smartEval.priority;
        updates.priorityReason = smartEval.reason;
      }
    }

    const updatedIssue = await dataService.updateIssue(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: updatedIssue
    });
  } catch (error) {
    console.error('Update issue error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating issue'
    });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private (Owner or Admin)
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await dataService.findIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const ownerId = (issue.userId?._id || issue.userId)?.toString();
    const currentUserId = (req.user._id || req.user.id)?.toString();

    if (ownerId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue'
      });
    }

    await dataService.deleteIssue(id);

    return res.status(200).json({
      success: true,
      message: 'Issue report deleted successfully'
    });
  } catch (error) {
    console.error('Delete issue error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting issue'
    });
  }
};

// @desc    Update issue status & admin remark
// @route   PATCH /api/issues/:id/status
// @access  Private (Admin only)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const validStatuses = [
      'Reported',
      'Under Review',
      'Assigned',
      'In Progress',
      'Resolved',
      'Closed'
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const issue = await dataService.findIssueById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (issue.status === status) {
      return res.status(400).json({
        success: false,
        message: `Issue is already in "${status}" status`
      });
    }

    // Status Workflow Guard: Closed issues must be reopened via Under Review
    if (issue.status === 'Closed' && status !== 'Under Review') {
      return res.status(400).json({
        success: false,
        message: 'A closed issue can only be reopened to "Under Review".'
      });
    }

    const previousStatus = issue.status;
    const timeline = [...(issue.statusTimeline || [])];
    timeline.push({
      status,
      updatedBy: req.user.name || 'Admin Officer',
      remark: adminRemark || `Status progressed from ${previousStatus} to ${status}`,
      timestamp: new Date()
    });

    const updates = {
      status,
      adminRemark: adminRemark !== undefined ? adminRemark : issue.adminRemark,
      statusTimeline: timeline
    };

    const updatedIssue = await dataService.updateIssue(id, updates);

    // Create Notification
    const authorId = issue.userId?._id || issue.userId;
    const notificationMessage = `Your complaint ${issue.complaintId} has been moved to "${status}".${
      adminRemark ? ` Remark: "${adminRemark}"` : ''
    }`;

    await dataService.createNotification({
      userId: authorId,
      issueId: issue._id || issue.id,
      complaintId: issue.complaintId,
      type: 'STATUS_UPDATE',
      message: notificationMessage
    });

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status} successfully`,
      data: updatedIssue
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating status'
    });
  }
};

// @desc    Update issue priority manually
// @route   PATCH /api/issues/:id/priority
// @access  Private (Admin only)
const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, reason } = req.body;

    if (!['NORMAL', 'MEDIUM', 'HIGH'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be NORMAL, MEDIUM, or HIGH'
      });
    }

    const issue = await dataService.findIssueById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const updates = {
      priority,
      priorityReason: reason ? `Admin override: ${reason}` : issue.priorityReason
    };

    const updatedIssue = await dataService.updateIssue(id, updates);

    const authorId = issue.userId?._id || issue.userId;
    await dataService.createNotification({
      userId: authorId,
      issueId: issue._id || issue.id,
      complaintId: issue.complaintId,
      type: 'PRIORITY_UPDATE',
      message: `Priority for complaint ${issue.complaintId} was updated to ${priority}.`
    });

    return res.status(200).json({
      success: true,
      message: 'Priority updated successfully',
      data: updatedIssue
    });
  } catch (error) {
    console.error('Update priority error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating priority'
    });
  }
};

// @desc    Support / Upvote an issue
// @route   POST /api/issues/:id/upvote
// @access  Private (Authenticated citizen)
const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user._id || req.user.id).toString();

    const issue = await dataService.findIssueById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const supportedByList = [...(issue.supportedBy || [])];
    const alreadySupportedIndex = supportedByList.findIndex(
      (uid) => uid.toString() === userId
    );

    let supported = false;
    let newUpvotes = issue.upvotes || 0;

    if (alreadySupportedIndex !== -1) {
      // Toggle off
      supportedByList.splice(alreadySupportedIndex, 1);
      newUpvotes = Math.max(0, newUpvotes - 1);
      supported = false;
    } else {
      // Add support
      supportedByList.push(userId);
      newUpvotes += 1;
      supported = true;
    }

    // Evaluate smart priority
    const smartEval = evaluateSmartPriority({
      category: issue.category,
      upvotes: newUpvotes,
      title: issue.title,
      description: issue.description,
      requestedPriority: issue.priority
    });

    const updates = {
      supportedBy: supportedByList,
      upvotes: newUpvotes,
      priority: smartEval.priority,
      priorityReason: smartEval.reason
    };

    const updatedIssue = await dataService.updateIssue(id, updates);

    return res.status(200).json({
      success: true,
      message: supported
        ? 'Thank you for supporting this civic issue!'
        : 'Support removed from this issue',
      supported,
      upvotes: newUpvotes,
      priority: smartEval.priority,
      priorityReason: smartEval.reason,
      data: updatedIssue
    });
  } catch (error) {
    console.error('Upvote issue error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error registering support'
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  updateStatus,
  updatePriority,
  upvoteIssue
};
