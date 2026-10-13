import React from 'react';
import {
  FileText,
  Clock,
  UserCheck,
  Wrench,
  CheckCircle2,
  Lock,
  Check
} from 'lucide-react';

const STAGES = [
  { key: 'Reported', label: 'Reported', icon: FileText },
  { key: 'Under Review', label: 'Under Review', icon: Clock },
  { key: 'Assigned', label: 'Assigned', icon: UserCheck },
  { key: 'In Progress', label: 'In Progress', icon: Wrench },
  { key: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
  { key: 'Closed', label: 'Closed', icon: Lock }
];

const Timeline = ({ currentStatus = 'Reported', timelineEvents = [] }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div style={{ width: '100%', margin: '1.5rem 0' }}>
      {/* Horizontal Step Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '1rem 0',
          overflowX: 'auto',
          gap: '0.5rem'
        }}
      >
        {STAGES.map((stage, idx) => {
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isFuture = idx > activeIndex;
          const StageIcon = stage.icon;

          return (
            <React.Fragment key={stage.key}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '80px',
                  zIndex: 2,
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    background: isPassed
                      ? 'var(--accent-emerald)'
                      : isCurrent
                      ? 'var(--primary)'
                      : 'var(--bg-subtle)',
                    color: isPassed || isCurrent ? '#ffffff' : 'var(--text-muted)',
                    border: isCurrent
                      ? '3px solid var(--primary-light)'
                      : isPassed
                      ? '2px solid var(--accent-emerald)'
                      : '2px solid var(--border-color)',
                    boxShadow: isCurrent ? '0 0 15px var(--primary-glow)' : 'none'
                  }}
                >
                  {isPassed ? <Check size={18} /> : <StageIcon size={18} />}
                </div>

                <span
                  style={{
                    marginTop: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent
                      ? 'var(--primary)'
                      : isPassed
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    lineHeight: 1.2
                  }}
                >
                  {stage.label}
                </span>

                {isCurrent && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      marginTop: '2px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Current
                  </span>
                )}
              </div>

              {idx < STAGES.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '3px',
                    minWidth: '24px',
                    margin: '0 -4px 24px -4px',
                    background: idx < activeIndex
                      ? 'var(--accent-emerald)'
                      : 'var(--border-color)',
                    transition: 'background 0.3s ease'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detailed Chronological Event Logs */}
      {timelineEvents && timelineEvents.length > 0 && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          <h4
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}
          >
            Resolution History & Remarks
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background:
                      index === timelineEvents.length - 1
                        ? 'var(--primary)'
                        : 'var(--accent-emerald)',
                    marginTop: '6px',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '4px'
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {event.status}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      marginTop: '2px'
                    }}
                  >
                    {event.remark || 'Status updated'}
                  </p>

                  {event.updatedBy && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                      }}
                    >
                      Updated by: {event.updatedBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
