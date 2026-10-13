const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, requireAdmin } = require('../middleware/auth');
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  updateStatus,
  updatePriority,
  upvoteIssue
} = require('../controllers/issueController');

const { getJwtSecret } = require('../config/jwt');
const dataService = require('../services/dataService');

// Optional auth helper to attach req.user if token is present on public GET routes
const optionalAuth = async (req, res, next) => {
  const jwt = require('jsonwebtoken');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        getJwtSecret()
      );
      const user = await dataService.findUserById(decoded.id);
      if (user) {
        const safeUser = { ...user };
        delete safeUser.password;
        req.user = safeUser;
      }
      return next();
    } catch {
      return next();
    }
  }
  next();
};

router.post('/', protect, upload.single('image'), createIssue);
router.get('/', optionalAuth, getIssues);
router.get('/:id', getIssueById);
router.put('/:id', protect, upload.single('image'), updateIssue);
router.delete('/:id', protect, deleteIssue);

// Admin-only updates
router.patch('/:id/status', protect, requireAdmin, updateStatus);
router.patch('/:id/priority', protect, requireAdmin, updatePriority);

// Citizen upvote
router.post('/:id/upvote', protect, upvoteIssue);

module.exports = router;
