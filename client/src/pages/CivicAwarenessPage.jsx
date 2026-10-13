import React from 'react';
import {
  Trash2,
  Droplets,
  Car,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CivicAwarenessPage = () => {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          <Lightbulb size={16} />
          <span>CITIZEN CHARTER & BEST PRACTICES</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800 }}>Civic Awareness Guide</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
          Sustainable, clean, and safe cities require collaborative partnership between municipal authorities and responsible citizens.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >
        {/* Module 1: Waste Segregation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Trash2 size={26} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Household Waste Segregation
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Segregating at source prevents landfill saturation and maximizes organic composting:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>🟢 Wet Waste:</span>
              <span>Fruit peels, leftover food, tea leaves, vegetable scraps (compostable).</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>🔵 Dry Waste:</span>
              <span>Clean plastics, cardboard, glass bottles, metal cans (recyclable).</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>🔴 Hazardous:</span>
              <span>Batteries, expired medicines, sanitary waste, e-waste (safe disposal).</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 Tip: Never mix sanitary waste with organic kitchen compost.
          </div>
        </div>

        {/* Module 2: Water Conservation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Droplets size={26} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Urban Water Conservation
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Groundwater depletion threatens urban resilience. Small individual actions preserve thousands of liters:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Rainwater Harvesting:</strong> Ensure rooftop recharge pits are desilted before pre-monsoon rains.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Immediate Leak Reporting:</strong> Report street pipeline fractures on CivicConnect within 1 hour.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Aerator Taps:</strong> Install low-flow nozzles to cut tap water wastage by up to 50%.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 1 dripping municipal supply tap loses up to 20,000 liters every year.
          </div>
        </div>

        {/* Module 3: Road & Pedestrian Safety */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Car size={26} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Road & Pedestrian Safety
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Safe roads protect families and pedestrians. Key civic rules:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Respect Pedestrian Crossings:</strong> Never stop motor vehicles over white zebra lines at red lights.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Do Not Obstruct Footpaths:</strong> Keep sidewalks free from illegal commercial boards and parked bikes.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Report Open Pits:</strong> Report missing manhole covers immediately under 'Drainage' high priority.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 Pedestrians have right-of-way on all designated school and crosswalk zones.
          </div>
        </div>

        {/* Module 4: Responsible Civic Reporting */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <HeartHandshake size={26} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Effective Grievance Reporting
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Maximize the speed of municipal response with these practical tips:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Take Clear Photos:</strong> Include prominent landmarks in background so crews locate the site easily.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Endorse Existing Reports:</strong> Before creating duplicate reports, search for existing pins and upvote them!</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Be Fact-Based:</strong> Provide measured descriptions (approximate length of pothole, days water was leaking).</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 High upvotes automatically upgrade issue priority to MEDIUM and HIGH!
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div
        className="card"
        style={{
          marginTop: '3.5rem',
          textAlign: 'center',
          padding: '3rem 1.5rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)'
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Spotted a Problem in Your Locality?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0.5rem auto 1.5rem auto', fontSize: '0.95rem' }}>
          Put civic awareness into action. Report an issue or support neighbors today.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/report" className="btn btn-primary">
            Report an Issue Now
          </Link>
          <Link to="/issues" className="btn btn-secondary">
            View Community Map
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CivicAwarenessPage;
