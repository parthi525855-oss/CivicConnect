import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { issueService } from '../services/issueService';
import { useNavigate } from 'react-router-dom';

const SupportButton = ({ issueId, initialUpvotes = 0, supportedBy = [], onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const userId = user?._id || user?.id;
  const isInitiallySupported =
    isAuthenticated &&
    supportedBy.some((uid) => (uid?._id || uid)?.toString() === userId?.toString());

  const [supported, setSupported] = useState(isInitiallySupported);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [loading, setLoading] = useState(false);

  const handleSupportToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Please sign in to support this civic issue');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await issueService.upvoteIssue(issueId);
      setSupported(res.supported);
      setUpvotes(res.upvotes);

      if (res.supported) {
        success('You supported this issue! Community voices matter.');
      } else {
        info('Removed your support for this issue.');
      }

      if (onUpdate && res.data) {
        onUpdate(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to update support status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSupportToggle}
      disabled={loading}
      className={`btn ${supported ? 'btn-primary' : 'btn-secondary'} btn-sm`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: supported ? 'scale(1.02)' : 'none',
        border: supported ? 'none' : '1px solid var(--border-color)',
        cursor: 'pointer'
      }}
      title={supported ? 'Click to withdraw support' : 'Click to support this community issue'}
    >
      <ThumbsUp
        size={14}
        style={{
          fill: supported ? '#ffffff' : 'none',
          transition: 'transform 0.2s ease',
          transform: loading ? 'scale(1.2)' : 'none'
        }}
      />
      <span>
        {supported ? 'Supported' : 'Support Issue'} ({upvotes})
      </span>
    </button>
  );
};

export default SupportButton;
