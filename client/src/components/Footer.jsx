import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
        transition: 'background-color 0.25s ease'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Col 1: Brand & Viva Project info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ShieldAlert size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Civic<span style={{ color: 'var(--primary)' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Smart Civic Issue Reporting & Resolution System. A full-stack civic-tech web platform connecting active citizens with responsive municipal governance.
            </p>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--bg-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)'
              }}
            >
              🎓 College Internship Project • 2026
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home Overview</Link>
              </li>
              <li>
                <Link to="/issues" style={{ color: 'var(--text-secondary)' }}>Community Reports</Link>
              </li>
              <li>
                <Link to="/report" style={{ color: 'var(--text-secondary)' }}>Report a New Issue</Link>
              </li>
              <li>
                <Link to="/civic-awareness" style={{ color: 'var(--text-secondary)' }}>Civic Awareness Guide</Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>Citizen Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Common Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Civic Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/issues?category=Roads" style={{ color: 'var(--text-secondary)' }}>Potholes & Damaged Roads</Link>
              </li>
              <li>
                <Link to="/issues?category=Garbage" style={{ color: 'var(--text-secondary)' }}>Waste & Solid Management</Link>
              </li>
              <li>
                <Link to="/issues?category=Water" style={{ color: 'var(--text-secondary)' }}>Water Supply & Leakage</Link>
              </li>
              <li>
                <Link to="/issues?category=Streetlights" style={{ color: 'var(--text-secondary)' }}>Streetlight & Dark Stretches</Link>
              </li>
              <li>
                <Link to="/issues?category=Drainage" style={{ color: 'var(--text-secondary)' }}>Monsoon Drainage & Silt</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Contact & Municipal Transparency */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Public Assistance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} style={{ color: 'var(--primary)' }} />
                <span>support@civicconnect.gov</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} style={{ color: 'var(--accent-emerald)' }} />
                <span>Toll-Free Helpline: 1800-425-CIVIC</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} style={{ color: 'var(--accent-rose)', marginTop: '3px' }} />
                <span>City Municipal Corporation Headquarters, Central Zone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CivicConnect. Built for college project & internship demonstration.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Citizen Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
