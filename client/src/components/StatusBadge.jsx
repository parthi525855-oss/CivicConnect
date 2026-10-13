import React from 'react';
import {
  FileText,
  Clock,
  UserCheck,
  Wrench,
  CheckCircle2,
  Lock
} from 'lucide-react';

const STATUS_CONFIG = {
  Reported: {
    label: 'Reported',
    icon: FileText,
    className: 'badge-status-reported'
  },
  'Under Review': {
    label: 'Under Review',
    icon: Clock,
    className: 'badge-status-review'
  },
  Assigned: {
    label: 'Assigned',
    icon: UserCheck,
    className: 'badge-status-assigned'
  },
  'In Progress': {
    label: 'In Progress',
    icon: Wrench,
    className: 'badge-status-progress'
  },
  Resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    className: 'badge-status-resolved'
  },
  Closed: {
    label: 'Closed',
    icon: Lock,
    className: 'badge-status-closed'
  }
};

const StatusBadge = ({ status = 'Reported', size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Reported;
  const Icon = config.icon;

  return (
    <span
      className={`badge ${config.className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'lg' ? '6px 12px' : '4px 8px',
        fontSize: size === 'lg' ? '0.8125rem' : '0.75rem',
        fontWeight: 600,
        borderRadius: '9999px'
      }}
    >
      <Icon size={size === 'lg' ? 14 : 12} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
