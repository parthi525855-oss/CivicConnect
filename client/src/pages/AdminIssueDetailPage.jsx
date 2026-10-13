import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Save,
  MessageSquare,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { issueService } from '../services/issueService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../services/api';

const STATUSES = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['NORMAL', 'MEDIUM', 'HIGH'];

const AdminIssueDetailPage = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPriority, setSavingPriority] = useState(false);

  // Form states
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [priorityReason, setPriorityReason] = useState('');

  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await issueService.getIssueById(id);
        setIssue(res.data);
        setSelectedStatus(res.data.status);
        setAdminRemark(res.data.adminRemark || '');
        setSelectedPriority(res.data.priority);
        setPriorityReason('');
      } catch (err) {
        error(err.message || 'Failed loading issue');
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    const issueId = issue._id || issue.id;

    try {
      setSavingStatus(true);
      const res = await issueService.updateStatus(issueId, {
        status: selectedStatus,
        adminRemark
      });
      setIssue(res.data);
      success(`Status updated to "${selectedStatus}". Citizen notified!`);
    } catch (err) {
      error(err.message || 'Failed updating status');
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePriorityUpdate = async (e) => {
    e.preventDefault();
    const issueId = issue._id || issue.id;

    try {
      setSavingPriority(true);
      const res = await issueService.updatePriority(issueId, {
        priority: selectedPriority,
        reason: priorityReason || 'Administrative urgency review'
      });
      setIssue(res.data);
      success(`Priority updated to "${selectedPriority}". Citizen notified!`);
    } catch (err) {
      error(err.message || 'Failed updating priority');
    } finally {
      setSavingPriority(false);
    }
  };

  const handleDelete = async () => {
    const issueId = issue._id || issue.id;
    if (!window.confirm(`Delete complaint ${issue.complaintId}?`)) return;

    try {
      await issueService.deleteIssue(issueId);
      success('Report deleted successfully');
      navigate('/admin/issues');
    } catch (err) {
      error('Failed to delete report');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        Loading incident details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Issue Not Found</h2>
        <Link to="/admin/issues" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to All Issues
        </Link>
      </div>
    );
  }

  const imageSrc = getImageUrl(issue.image);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate('/admin/issues')} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} />
          <span>Back to All Reports</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleDelete} className="btn btn-danger btn-sm" style={{ gap: '6px' }}>
            <Trash2 size={14} />
            <span>Delete Inappropriate Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details on Left, Triage Control Panel on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
          gap: '2rem',
          alignItems: 'start'
        }}
        className="admin-triage-grid"
      >
        {/* Left Column: Complaint Details & Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '300px', width: '100%', overflow: 'hidden', position: 'relative' }}>
              <img
                src={imageSrc}
                alt={issue.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                <StatusBadge status={issue.status} size="lg" />
                <PriorityBadge priority={issue.priority} reason={issue.priorityReason} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.8)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                {issue.complaintId}
              </div>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                <Tag size={14} color="var(--primary)" />
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{issue.category}</span>
                <span>•</span>
                <Calendar size={14} />
                <span>Reported on {new Date(issue.createdAt).toLocaleDateString()}</span>
                {issue.userId?.name && <span>• By {issue.userId.name}</span>}
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                {issue.title}
              </h2>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                {issue.description}
              </p>

              <div
                style={{
                  padding: '12px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <MapPin size={16} color="var(--accent-rose)" />
                <span>
                  <strong>Location:</strong> {issue.location} {issue.landmark ? `(Near ${issue.landmark})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Current Resolution Timeline
            </h3>
            <Timeline currentStatus={issue.status} timelineEvents={issue.statusTimeline || []} />
          </div>
        </div>

        {/* Right Column: Administrative Triage Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Triage Panel 1: Update Status & Admin Remarks */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Update Status & Remarks</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Advance complaint through workflow. An alert is sent to the citizen immediately.
            </p>

            <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Workflow Status Stage</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  required
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Official Administrator Remark</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Road maintenance contractor gang assigned. Asphalt patch laying scheduled tonight."
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  This message is visible to citizens and recorded in the audit trail.
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingStatus}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Save size={16} />
                <span>{savingStatus ? 'Updating Status...' : 'Apply Status & Remarks'}</span>
              </button>
            </form>
          </div>

          {/* Triage Panel 2: Priority Override */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <AlertTriangle size={20} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Adjust Priority Rating</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Override the rule-based urgency score if immediate on-site safety intervention is required.
            </p>

            <form onSubmit={handlePriorityUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Priority Level</label>
                <select
                  className="form-select"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  required
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Override Justification</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Located adjacent to senior citizen walkway"
                  value={priorityReason}
                  onChange={(e) => setPriorityReason(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={savingPriority}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Save size={16} />
                <span>{savingPriority ? 'Saving Priority...' : 'Update Urgency Score'}</span>
              </button>
            </form>
          </div>

          {/* Community Endorsements Card */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Community Engagement Signal
            </h4>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {issue.upvotes || 0} Citizens Endorsed
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              High citizen upvoting signals shared neighborhood impact and elevates rule-based priority.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .admin-triage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminIssueDetailPage;
