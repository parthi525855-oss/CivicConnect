import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Trash2,
  Edit,
  ArrowUpDown,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { issueService } from '../services/issueService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'All',
  'Roads',
  'Garbage',
  'Water',
  'Drainage',
  'Streetlights',
  'Traffic',
  'Public Infrastructure',
  'Environment',
  'Other'
];

const STATUSES = ['All', 'Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['All', 'NORMAL', 'MEDIUM', 'HIGH'];

const AdminIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('newest');

  const { success, error } = useToast();

  const fetchAdminIssues = async () => {
    try {
      setLoading(true);
      const res = await issueService.getIssues({
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined,
        priority: priority !== 'All' ? priority : undefined,
        search: search.trim() || undefined,
        sort
      });
      setIssues(res.data || []);
    } catch (err) {
      error(err.message || 'Failed loading issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminIssues();
  }, [category, status, priority, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminIssues();
  };

  const handleDelete = async (id, complaintId) => {
    if (!window.confirm(`Are you sure you want to delete report ${complaintId}? This action is permanent.`)) {
      return;
    }

    try {
      await issueService.deleteIssue(id);
      setIssues((prev) => prev.filter((i) => (i._id || i.id) !== id));
      success(`Complaint ${complaintId} deleted successfully.`);
    } catch (err) {
      error(err.message || 'Failed to delete report');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <span
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Municipal Oversight
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>All Civic Reports Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Inspect, adjust urgency, assign departments, and update resolution statuses.
          </p>
        </div>

        <Link to="/admin" className="btn btn-secondary btn-sm">
          <span>Back to Dashboard</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Filter and Search Box */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Complaint ID, Title, or Locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Filter
          </button>
        </form>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Category:
              </span>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '4px 8px', fontSize: '0.8125rem', width: 'auto' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Status:
              </span>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ padding: '4px 8px', fontSize: '0.8125rem', width: 'auto' }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Priority:
              </span>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ padding: '4px 8px', fontSize: '0.8125rem', width: 'auto' }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sort:
            </span>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '0.8125rem', width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="upvotes">Most Supported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Location</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Priority</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Upvotes</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading civic complaints database...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No reports match your filters.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => {
                  const issueId = issue._id || issue.id;
                  return (
                    <tr
                      key={issueId}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {issue.complaintId}
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link
                          to={`/admin/issues/${issue.complaintId || issueId}`}
                          style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}
                        >
                          {issue.title}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {issue.category}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {issue.location}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <PriorityBadge priority={issue.priority} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={issue.status} />
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {issue.upvotes || 0}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Link
                            to={`/admin/issues/${issue.complaintId || issueId}`}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 8px', gap: '4px' }}
                            title="Review and update issue"
                          >
                            <Edit size={13} />
                            <span>Triage</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(issueId, issue.complaintId)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '4px 6px' }}
                            title="Delete inappropriate report"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminIssuesPage;
