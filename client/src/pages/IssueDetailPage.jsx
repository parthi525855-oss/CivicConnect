import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { issueService } from '../services/issueService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import SupportButton from '../components/SupportButton';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../services/api';

const IssueDetailPage = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await issueService.getIssueById(id);
        setIssue(res.data);
      } catch (err) {
        error(err.message || 'Failed to load issue details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: `Civic report ${issue.complaintId}: ${issue.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading complaint record...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Issue Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          The requested complaint ID does not exist or has been removed.
        </p>
        <Link to="/issues" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Browse Issues
        </Link>
      </div>
    );
  }

  const imageSrc = getImageUrl(issue.image);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Back button & Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>

        <button
          onClick={handleShare}
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <Share2 size={16} />
          <span>Share Report</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
          gap: '2.5rem',
          alignItems: 'start'
        }}
        className="issue-detail-grid"
      >
        {/* Left Column: Image, Details & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Card with Large Image */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
              <img
                src={imageSrc}
                alt={issue.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}
              >
                <StatusBadge status={issue.status} size="lg" />
                <PriorityBadge priority={issue.priority} showTooltip={true} reason={issue.priorityReason} />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.8)',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                {issue.complaintId}
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              {/* Category, Date & Author */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  flexWrap: 'wrap',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={14} color="var(--primary)" />
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{issue.category}</span>
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  <span>Reported on {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {issue.userId?.name && (
                  <>
                    <span>•</span>
                    <span>By {issue.userId.name}</span>
                  </>
                )}
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.25rem' }}>
                {issue.title}
              </h1>

              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                {issue.description}
              </div>

              {/* Location Badge */}
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)'
                }}
              >
                <MapPin size={18} color="var(--accent-rose)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Incident Location:</strong> {issue.location}
                  {issue.landmark && (
                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                      (Landmark: {issue.landmark})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Progression Timeline Component */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Resolution Progress & Audit Trail
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Live lifecycle tracking from intake to on-site closure.
            </p>

            <Timeline
              currentStatus={issue.status}
              timelineEvents={issue.statusTimeline || []}
            />
          </div>
        </div>

        {/* Right Column: Municipal Remarks & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Community Endorsement Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Community Support
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Endorse this report to signal priority to ward municipal engineers.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {issue.upvotes || 0} Citizens Supported
              </div>

              <SupportButton
                issueId={issue._id || issue.id}
                initialUpvotes={issue.upvotes || 0}
                supportedBy={issue.supportedBy || []}
                onUpdate={(updated) => setIssue((prev) => ({ ...prev, ...updated }))}
              />
            </div>
          </div>

          {/* Priority Insights Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Smart Priority Evaluation</h3>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <PriorityBadge priority={issue.priority} reason={issue.priorityReason} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {issue.priorityReason || 'Calculated using municipal hazard category, location density, and community endorsement thresholds.'}
            </p>
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic'
              }}
            >
              * Transparent rule-based heuristic, not opaque generative AI.
            </div>
          </div>

          {/* Official Municipal Remarks Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <MessageSquare size={18} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Official Admin Remark</h3>
            </div>

            {issue.adminRemark ? (
              <div
                style={{
                  padding: '12px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--accent-emerald)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)'
                }}
              >
                "{issue.adminRemark}"
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No administrator remark recorded yet. Will be updated once inspection teams inspect the locality.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .issue-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default IssueDetailPage;
