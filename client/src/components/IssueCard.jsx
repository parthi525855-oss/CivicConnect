import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import SupportButton from './SupportButton';
import { getImageUrl } from '../services/api';

const IssueCard = ({ issue, onUpdate }) => {
  const issueId = issue._id || issue.id;
  const imageSrc = getImageUrl(issue.image);

  const formattedDate = new Date(issue.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 0,
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Image Preview & Badges */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={issue.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap'
          }}
        >
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} reason={issue.priorityReason} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontFamily: 'monospace',
            fontWeight: 600
          }}
        >
          {issue.complaintId}
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Tag size={13} />
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{issue.category}</span>
          <span>•</span>
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>

        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          <Link
            to={`/issues/${issue.complaintId || issueId}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {issue.title}
          </Link>
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.45
          }}
        >
          {issue.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            marginTop: 'auto'
          }}
        >
          <MapPin size={14} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {issue.location} {issue.landmark ? `(${issue.landmark})` : ''}
          </span>
        </div>

        {/* Card Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            marginTop: '0.5rem'
          }}
        >
          <SupportButton
            issueId={issueId}
            initialUpvotes={issue.upvotes || 0}
            supportedBy={issue.supportedBy || []}
            onUpdate={onUpdate}
          />

          <Link
            to={`/issues/${issue.complaintId || issueId}`}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            <span>View Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
