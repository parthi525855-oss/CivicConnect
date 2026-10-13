import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  BookOpen,
  Camera,
  Layers,
  ThumbsUp
} from 'lucide-react';
import { issueService } from '../services/issueService';
import IssueCard from '../components/IssueCard';

const CATEGORIES = [
  { name: 'Roads', desc: 'Potholes, cracks & road damage', icon: '🛣️' },
  { name: 'Garbage', desc: 'Overflowing bins & waste piles', icon: '🗑️' },
  { name: 'Water', desc: 'Pipeline leaks & low pressure', icon: '💧' },
  { name: 'Drainage', desc: 'Blocked monsoon sewage drains', icon: '🌊' },
  { name: 'Streetlights', desc: 'Dark stretches & faulty lamps', icon: '💡' },
  { name: 'Traffic', desc: 'Malfunctioning signals & jams', icon: '🚦' },
  { name: 'Public Infrastructure', desc: 'Damaged benches, railings & toilets', icon: '🏛️' },
  { name: 'Environment', desc: 'Illegal dumping & tree hazards', icon: '🌱' }
];

const LandingPage = () => {
  const [recentIssues, setRecentIssues] = useState([]);
  const [stats, setStats] = useState({
    reported: 12,
    resolved: 5,
    citizens: 120,
    communities: 18
  });

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await issueService.getIssues({ sort: 'newest' });
        if (res.data) {
          setRecentIssues(res.data.slice(0, 3));
          const total = res.data.length;
          const resolvedCount = res.data.filter((i) =>
            ['Resolved', 'Closed'].includes(i.status)
          ).length;
          setStats((prev) => ({
            ...prev,
            reported: total,
            resolved: resolvedCount
          }));
        }
      } catch (e) {
        console.warn('Landing data fetch:', e.message);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 3.5rem 0',
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-primary) 100%)',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            {/* Pill Announcement */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'var(--primary-light)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                color: 'var(--primary)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.02em'
              }}
            >
              <Sparkles size={15} />
              <span>Smart Civic Issue Reporting & Resolution System</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)'
              }}
            >
              Report. Track.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Improve Your Community.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '680px'
              }}
            >
              A simple, transparent digital platform where citizens can report civic issues, track complaint timelines in real time, and help build cleaner, safer cities.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '1rem'
              }}
            >
              <Link to="/report" className="btn btn-primary btn-lg">
                <PlusCircle size={20} />
                <span>Report an Issue</span>
              </Link>
              <Link to="/issues" className="btn btn-secondary btn-lg">
                <MapPin size={20} />
                <span>Explore Community Issues</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginTop: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" /> 100% Free Public Service
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" /> Real-Time Audit Timeline
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" /> Transparent Upvoting
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Section */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--primary)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {stats.reported}+
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              Issues Reported
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Logged across municipal zones
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--accent-emerald)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {stats.resolved}+
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              Issues Resolved
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Verified by civic engineering teams
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--accent-amber)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {stats.citizens}+
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              Active Citizens
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Upvoting and reporting local problems
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--accent-purple)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {stats.communities}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              Communities Served
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Covering residential and commercial wards
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simple & Transparent
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>How CivicConnect Works</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
            From incident reporting to on-site municipal resolution in 3 easy steps.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Step 1 */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Camera size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Step 01
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              1. Report
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Capture the issue with photos, select category (Roads, Drainage, Water, etc.), pinpoint the locality, and submit your report in under 60 seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Clock size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
              Step 02
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              2. Track & Support
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Get a unique complaint ID (e.g. CIV-2026-0001). Follow status updates along the visual timeline as administrators review, assign, and initiate repairs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
              Step 03
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              3. Resolve
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Municipal engineers complete the fix, provide official administrator remarks, and close the loop with automatic notifications sent to you.
            </p>
          </div>
        </div>
      </section>

      {/* Issue Categories Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Comprehensive Municipal Scope
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Explore Problem Categories</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Report issues spanning all public municipal infrastructure domains.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/issues?category=${encodeURIComponent(cat.name)}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.desc}</p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginTop: 'auto'
                }}
              >
                <span>View reports</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Community Issues Preview */}
      {recentIssues.length > 0 && (
        <section className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Community Feed
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Recently Reported Issues</h2>
            </div>
            <Link to="/issues" className="btn btn-secondary">
              <span>View All Reports</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {recentIssues.map((issue) => (
              <IssueCard
                key={issue._id || issue.id}
                issue={issue}
                onUpdate={(updated) => {
                  setRecentIssues((prev) =>
                    prev.map((i) =>
                      (i._id || i.id) === (updated._id || updated.id) ? updated : i
                    )
                  );
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Why CivicConnect? Features Showcase */}
      <section
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '4rem 0'
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Democratic Governance
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Why CivicConnect?</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
              Engineered to make urban issue reporting accountable, participatory, and efficient.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Transparent Reporting</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every complaint receives a public serial ID with an immutable status audit trail. No complaints are lost or quietly dismissed without recorded administrator remarks.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <ThumbsUp size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Community Upvoting</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Fellow citizens can endorse existing issues in their neighborhood instead of filing duplicate complaints. Reports with high support automatically trigger priority escalation.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Rule-Based Smart Priority</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Critical hazards like water bursts, open manholes, or live electrical wires are categorized as High Priority through deterministic municipal rules, enabling fast triage.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <TrendingUp size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Data-Driven Analytics</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Municipal officers and civic leaders can analyze heatmaps, category volumes, and resolution velocity across wards to optimize municipal budget deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Civic Awareness Teaser Banner */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1rem',
                letterSpacing: '0.04em'
              }}
            >
              <BookOpen size={14} />
              <span>COMMUNITY RESPONSIBILITY</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', color: '#ffffff', lineHeight: 1.25, marginBottom: '0.75rem' }}>
              Be an Informed Citizen: Explore the Civic Awareness Guide
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Learn essential guidelines for dry vs wet waste segregation, water harvesting, road safety etiquette, and responsible civic reporting.
            </p>
          </div>

          <Link
            to="/civic-awareness"
            className="btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#1e3a8a',
              fontWeight: 700,
              padding: '0.875rem 1.75rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span>Read Awareness Guide</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
