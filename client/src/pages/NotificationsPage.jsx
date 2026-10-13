import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Check,
  ArrowRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const { success, error } = useToast();

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      error(err.message || 'Failed loading notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n))
      );
      success('Marked as read');
    } catch (err) {
      error('Failed to update status');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      success('All notifications marked as read');
    } catch (err) {
      error('Failed updating notifications');
    }
  };

  const filteredNotifs =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notification Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Official municipal alerts regarding your submitted reports
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading notifications...
        </div>
      ) : filteredNotifs.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Bell size={32} color="var(--text-muted)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Notifications</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            You're all caught up! You'll receive real-time alerts whenever administrators update your complaints.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifs.map((n) => {
            const notifId = n._id || n.id;
            const targetId = n.complaintId || n.issueId?._id || n.issueId;

            return (
              <div
                key={notifId}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  gap: '1rem',
                  backgroundColor: n.read ? 'var(--bg-card)' : 'var(--primary-light)',
                  borderLeft: n.read ? '1px solid var(--border-color)' : '4px solid var(--primary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: n.read ? 'var(--bg-subtle)' : 'var(--primary)',
                      color: n.read ? 'var(--text-muted)' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Bell size={18} />
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: n.read ? 500 : 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.4
                      }}
                    >
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {targetId && (
                    <Link
                      to={`/issues/${targetId}`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span>View</span>
                      <ArrowRight size={13} />
                    </Link>
                  )}

                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(notifId)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px' }}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
