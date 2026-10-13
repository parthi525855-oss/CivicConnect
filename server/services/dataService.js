const mongoose = require('mongoose');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Notification = require('../models/Notification');
const store = require('../data/store');
const { getIsMongoConnected } = require('../config/db');

class DataService {
  isMongo() {
    return getIsMongoConnected() && mongoose.connection.readyState === 1;
  }

  // ================= USERS =================
  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (this.isMongo()) {
      return await User.findOne({ email: normalized });
    }
    return store.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  async findUserById(id) {
    if (!id) return null;
    const strId = id.toString();
    if (this.isMongo()) {
      return await User.findById(strId);
    }
    return store.users.find((u) => (u._id || u.id).toString() === strId) || null;
  }

  async createUser(userData) {
    if (this.isMongo()) {
      return await User.create(userData);
    }
    const newUser = {
      _id: '661' + Date.now().toString(16).padStart(21, '0').slice(-21),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.users.push(newUser);
    store.save();
    return newUser;
  }

  async updateUser(id, updates) {
    const strId = id.toString();
    if (this.isMongo()) {
      return await User.findByIdAndUpdate(strId, updates, { new: true });
    }
    const idx = store.users.findIndex((u) => (u._id || u.id).toString() === strId);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...updates, updatedAt: new Date() };
    store.save();
    return store.users[idx];
  }

  // ================= ISSUES =================
  async getLatestComplaintWithPrefix(prefix) {
    if (this.isMongo()) {
      return await Issue.findOne({
        complaintId: new RegExp(`^${prefix}`)
      }).sort({ createdAt: -1 });
    }
    const matching = store.issues.filter((i) =>
      i.complaintId && i.complaintId.startsWith(prefix)
    );
    if (!matching.length) return null;
    return matching[matching.length - 1];
  }

  async createIssue(issueData) {
    if (this.isMongo()) {
      return await Issue.create(issueData);
    }
    const newIssue = {
      _id: '662' + Date.now().toString(16).padStart(21, '0').slice(-21),
      ...issueData,
      upvotes: issueData.upvotes || 0,
      supportedBy: issueData.supportedBy || [],
      statusTimeline: issueData.statusTimeline || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.issues.unshift(newIssue);
    store.save();
    return newIssue;
  }

  async findIssues({ category, status, priority, search, myIssuesUserId, sort = 'newest' }) {
    if (this.isMongo()) {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (status && status !== 'All') query.status = status;
      if (priority && priority !== 'All') query.priority = priority;
      if (myIssuesUserId) query.userId = myIssuesUserId;
      if (search && search.trim() !== '') {
        const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escaped, 'i');
        query.$or = [
          { title: searchRegex },
          { complaintId: searchRegex },
          { location: searchRegex },
          { landmark: searchRegex }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'oldest') sortOptions = { createdAt: 1 };
      else if (sort === 'upvotes') sortOptions = { upvotes: -1, createdAt: -1 };

      return await Issue.find(query).populate('userId', 'name email role').sort(sortOptions);
    }

    // In-memory filter
    let results = [...store.issues];

    if (category && category !== 'All') {
      results = results.filter((i) => i.category === category);
    }
    if (status && status !== 'All') {
      results = results.filter((i) => i.status === status);
    }
    if (priority && priority !== 'All') {
      results = results.filter((i) => i.priority === priority);
    }
    if (myIssuesUserId) {
      const uid = myIssuesUserId.toString();
      results = results.filter((i) => {
        const iUid = typeof i.userId === 'object' ? (i.userId._id || i.userId.id) : i.userId;
        return iUid && iUid.toString() === uid;
      });
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (i) =>
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.complaintId && i.complaintId.toLowerCase().includes(q)) ||
          (i.location && i.location.toLowerCase().includes(q)) ||
          (i.landmark && i.landmark.toLowerCase().includes(q))
      );
    }

    // Populate user info
    results = results.map((issue) => {
      const copy = { ...issue };
      if (typeof copy.userId === 'string' || typeof copy.userId === 'number') {
        const author = store.users.find(
          (u) => (u._id || u.id).toString() === copy.userId.toString()
        );
        if (author) {
          copy.userId = {
            _id: author._id || author.id,
            name: author.name,
            email: author.email,
            role: author.role
          };
        }
      }
      return copy;
    });

    if (sort === 'oldest') {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'upvotes') {
      results.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return results;
  }

  async findIssueById(id) {
    if (!id) return null;
    const str = id.toString();
    if (this.isMongo()) {
      if (str.startsWith('CIV-')) {
        return await Issue.findOne({ complaintId: str }).populate('userId', 'name email role');
      }
      return await Issue.findById(str).populate('userId', 'name email role');
    }

    let issue = store.issues.find(
      (i) => (i._id || i.id).toString() === str || i.complaintId === str
    );
    if (!issue) return null;

    const copy = { ...issue };
    if (typeof copy.userId === 'string' || typeof copy.userId === 'number') {
      const author = store.users.find(
        (u) => (u._id || u.id).toString() === copy.userId.toString()
      );
      if (author) {
        copy.userId = {
          _id: author._id || author.id,
          name: author.name,
          email: author.email,
          role: author.role
        };
      }
    }
    return copy;
  }

  async updateIssue(id, updates) {
    const strId = id.toString();
    if (this.isMongo()) {
      return await Issue.findByIdAndUpdate(strId, updates, { new: true });
    }

    const idx = store.issues.findIndex(
      (i) => (i._id || i.id).toString() === strId || i.complaintId === strId
    );
    if (idx === -1) return null;
    store.issues[idx] = { ...store.issues[idx], ...updates, updatedAt: new Date() };
    store.save();
    return store.issues[idx];
  }

  async deleteIssue(id) {
    const strId = id.toString();
    if (this.isMongo()) {
      return await Issue.findByIdAndDelete(strId);
    }
    const idx = store.issues.findIndex(
      (i) => (i._id || i.id).toString() === strId || i.complaintId === strId
    );
    if (idx === -1) return false;
    store.issues.splice(idx, 1);
    store.save();
    return true;
  }

  async countIssues(filter = {}) {
    if (this.isMongo()) {
      return await Issue.countDocuments(filter);
    }
    return store.issues.filter((i) => {
      for (const key of Object.keys(filter)) {
        if (key === 'status') {
          if (filter.status.$in) {
            if (!filter.status.$in.includes(i.status)) return false;
          } else if (i.status !== filter.status) return false;
        } else if (key === 'priority' && i.priority !== filter.priority) {
          return false;
        } else if (key === 'userId') {
          const uId = typeof i.userId === 'object' ? (i.userId._id || i.userId.id) : i.userId;
          if (uId.toString() !== filter.userId.toString()) return false;
        }
      }
      return true;
    }).length;
  }

  // ================= NOTIFICATIONS =================
  async findNotifications(userId, limit = 30) {
    const uStr = userId.toString();
    if (this.isMongo()) {
      return await Notification.find({ userId })
        .populate('issueId', 'complaintId title category status priority')
        .sort({ createdAt: -1 })
        .limit(limit);
    }
    return store.notifications
      .filter((n) => n.userId.toString() === uStr)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async countUnreadNotifications(userId) {
    const uStr = userId.toString();
    if (this.isMongo()) {
      return await Notification.countDocuments({ userId, read: false });
    }
    return store.notifications.filter(
      (n) => n.userId.toString() === uStr && !n.read
    ).length;
  }

  async createNotification(notificationData) {
    if (this.isMongo()) {
      return await Notification.create(notificationData);
    }
    const newNotification = {
      _id: '663' + Date.now().toString(16).padStart(21, '0').slice(-21),
      ...notificationData,
      read: false,
      createdAt: new Date()
    };
    store.notifications.unshift(newNotification);
    store.save();
    return newNotification;
  }

  async markNotificationRead(id, userId) {
    const strId = id.toString();
    const uStr = userId.toString();
    if (this.isMongo()) {
      return await Notification.findOneAndUpdate(
        { _id: strId, userId },
        { $set: { read: true } },
        { new: true }
      );
    }
    const notif = store.notifications.find(
      (n) => (n._id || n.id).toString() === strId && n.userId.toString() === uStr
    );
    if (!notif) return null;
    notif.read = true;
    store.save();
    return notif;
  }

  async markAllNotificationsRead(userId) {
    const uStr = userId.toString();
    if (this.isMongo()) {
      return await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true } }
      );
    }
    store.notifications.forEach((n) => {
      if (n.userId.toString() === uStr) n.read = true;
    });
    store.save();
    return true;
  }

  // ================= ADMIN STATS & ANALYTICS =================
  async getDashboardData() {
    const issues = this.isMongo() ? await Issue.find().lean() : store.issues;
    const users = this.isMongo() ? await User.find().lean() : store.users;

    const totalIssues = issues.length;
    const newReports = issues.filter((i) => i.status === 'Reported').length;
    const underReview = issues.filter((i) => i.status === 'Under Review').length;
    const inProgress = issues.filter((i) => i.status === 'In Progress').length;
    const resolved = issues.filter((i) =>
      ['Resolved', 'Closed'].includes(i.status)
    ).length;
    const highPriority = issues.filter((i) => i.priority === 'HIGH').length;
    const totalCitizens = users.filter((u) => u.role === 'citizen').length;

    // Category aggregation
    const catCounts = {};
    issues.forEach((i) => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    });
    const issuesByCategory = Object.entries(catCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Status aggregation
    const statCounts = {};
    issues.forEach((i) => {
      statCounts[i.status] = (statCounts[i.status] || 0) + 1;
    });
    const issuesByStatus = Object.entries(statCounts).map(([status, count]) => ({
      status,
      count
    }));

    // Monthly aggregation
    const monthMap = {};
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    issues.forEach((i) => {
      const d = new Date(i.createdAt || Date.now());
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthMap[key]) {
        monthMap[key] = { month: key, total: 0, resolved: 0, sortKey: d.getTime() };
      }
      monthMap[key].total += 1;
      if (['Resolved', 'Closed'].includes(i.status)) {
        monthMap[key].resolved += 1;
      }
    });
    const monthlyReports = Object.values(monthMap).sort(
      (a, b) => a.sortKey - b.sortKey
    );

    // Recent 10 issues
    const sortedIssues = [...issues].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const recentIssues = sortedIssues.slice(0, 10).map((issue) => {
      const copy = { ...issue };
      const author = users.find(
        (u) => (u._id || u.id).toString() === (copy.userId?._id || copy.userId)?.toString()
      );
      if (author) {
        copy.userId = { _id: author._id, name: author.name, email: author.email };
      }
      return copy;
    });

    return {
      stats: {
        totalIssues,
        newReports,
        underReview,
        inProgress,
        resolved,
        highPriority,
        totalCitizens,
        resolutionPercentage:
          totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0
      },
      charts: {
        issuesByCategory,
        issuesByStatus,
        monthlyReports
      },
      recentIssues
    };
  }

  async getAnalyticsData() {
    const issues = this.isMongo() ? await Issue.find().lean() : store.issues;
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter((i) =>
      ['Resolved', 'Closed'].includes(i.status)
    ).length;
    const pendingIssues = totalIssues - resolvedIssues;

    const resolutionRate =
      totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : '0.0';
    const pendingRate =
      totalIssues > 0 ? ((pendingIssues / totalIssues) * 100).toFixed(1) : '0.0';

    // Most reported category
    const catCounts = {};
    issues.forEach((i) => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    });
    const sortedCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const mostReportedCategory = sortedCategories.length
      ? { category: sortedCategories[0][0], count: sortedCategories[0][1] }
      : { category: 'None', count: 0 };

    // Most supported issue
    const sortedByUpvotes = [...issues].sort(
      (a, b) => (b.upvotes || 0) - (a.upvotes || 0)
    );
    const topSupported = sortedByUpvotes[0] || null;

    // Location distribution
    const locCounts = {};
    issues.forEach((i) => {
      if (i.location) locCounts[i.location] = (locCounts[i.location] || 0) + 1;
    });
    const issuesByLocation = Object.entries(locCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Category breakdown with resolution rates
    const categoryStats = sortedCategories.map(([catName, catTotal]) => {
      const catIssues = issues.filter((i) => i.category === catName);
      const resCount = catIssues.filter((i) =>
        ['Resolved', 'Closed'].includes(i.status)
      ).length;
      const hiCount = catIssues.filter((i) => i.priority === 'HIGH').length;
      return {
        category: catName,
        total: catTotal,
        resolved: resCount,
        highPriority: hiCount,
        rate: catTotal > 0 ? Math.round((resCount / catTotal) * 100) : 0
      };
    });

    return {
      totalIssues,
      resolvedIssues,
      pendingIssues,
      resolutionRate: `${resolutionRate}%`,
      pendingRate: `${pendingRate}%`,
      mostReportedCategory,
      mostSupportedIssue: topSupported
        ? {
            id: topSupported._id || topSupported.id,
            complaintId: topSupported.complaintId,
            title: topSupported.title,
            category: topSupported.category,
            location: topSupported.location,
            upvotes: topSupported.upvotes
          }
        : null,
      issuesByLocation,
      categoryStats
    };
  }
}

const dataService = new DataService();
module.exports = dataService;
