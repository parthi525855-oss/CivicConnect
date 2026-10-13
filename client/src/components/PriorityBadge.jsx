import React from 'react';
import { AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

const PRIORITY_CONFIG = {
  NORMAL: {
    label: 'NORMAL',
    icon: ShieldCheck,
    className: 'badge-priority-normal',
    color: '#059669'
  },
  MEDIUM: {
    label: 'MEDIUM',
    icon: AlertCircle,
    className: 'badge-priority-medium',
    color: '#d97706'
  },
  HIGH: {
    label: 'HIGH',
    icon: AlertTriangle,
    className: 'badge-priority-high',
    color: '#dc2626'
  }
};

const PriorityBadge = ({ priority = 'NORMAL', showTooltip = false, reason = '' }) => {
  const normalized = (priority || 'NORMAL').toUpperCase();
  const config = PRIORITY_CONFIG[normalized] || PRIORITY_CONFIG.NORMAL;
  const Icon = config.icon;

  return (
    <span
      className={`badge ${config.className}`}
      title={reason ? `Rule-based evaluation: ${reason}` : 'Rule-based algorithmic priority'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        fontSize: '0.72rem',
        fontWeight: 700,
        borderRadius: '9999px',
        letterSpacing: '0.04em'
      }}
    >
      <Icon size={12} />
      <span>{config.label}</span>
      {showTooltip && (
        <span
          style={{
            fontSize: '0.65rem',
            opacity: 0.8,
            marginLeft: '2px',
            fontStyle: 'normal'
          }}
        >
          (RULE-BASED)
        </span>
      )}
    </span>
  );
};

export default PriorityBadge;
