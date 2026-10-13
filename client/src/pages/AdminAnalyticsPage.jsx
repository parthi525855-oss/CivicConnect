import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  ExternalLink,
  Flame,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { adminService } from '../services/adminService';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        Computing municipal intelligence analytics...
      </div>
    );
  }

  const data = analytics || {
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    resolutionRate: '0%',
    pendingRate: '0%',
    mostReportedCategory: { category: 'None', count: 0 },
    mostSupportedIssue: null,
    issuesByLocation: [],
    categoryStats: []
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Civic Intelligence
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Municipal Issue Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Data-driven insights to optimize budget, field personnel, and complaint resolution velocity.
          </p>
        </div>

        <Link to="/admin" className="btn btn-secondary btn-sm">
          <span>Back to Console</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Top 4 Key Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Most Reported Category */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Top Incident Category
            </span>
            <Tag size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--primary)' }}>
            {data.mostReportedCategory?.category}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {data.mostReportedCategory?.count} incidents logged
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Resolution Efficiency
            </span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent-emerald)' }}>
            {data.resolutionRate}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {data.resolvedIssues} of {data.totalIssues} closed
          </div>
        </div>

        {/* Pending Rate */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Backlog Rate
            </span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent-amber)' }}>
            {data.pendingRate}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {data.pendingIssues} issues in progress/review
          </div>
        </div>

        {/* Most Supported Issue */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Highest Community Concern
            </span>
            <Flame size={18} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent-rose)' }}>
            {data.mostSupportedIssue?.upvotes || 0} Upvotes
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data.mostSupportedIssue?.title || 'None'}
          </div>
        </div>
      </div>

      {/* Location Breakdown Chart */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Issues by Locality / Municipal Ward
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Geographic density of citizen grievances across top urban zones
        </p>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data.issuesByLocation} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="location" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance Breakdown Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Category Performance Matrix</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Resolution efficiency and high-priority volume broken down by department
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Total Logged</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Resolved</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>High Priority</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryStats?.map((c) => (
                <tr key={c.category} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {c.category}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.total}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {c.resolved}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-rose)', fontWeight: 600 }}>
                    {c.highPriority}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          background: 'var(--bg-subtle)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          maxWidth: '120px'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${c.rate}%`,
                            background:
                              c.rate >= 70
                                ? 'var(--accent-emerald)'
                                : c.rate >= 40
                                ? 'var(--accent-amber)'
                                : 'var(--accent-rose)'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{c.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
