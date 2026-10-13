import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { adminService } from '../services/adminService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const STATUS_COLORS = {
  Reported: '#94a3b8',
  'Under Review': '#3b82f6',
  Assigned: '#8b5cf6',
  'In Progress': '#f97316',
  Resolved: '#10b981',
  Closed: '#64748b'
};

const CATEGORY_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#64748b'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        Loading municipal management metrics...
      </div>
    );
  }

  const stats = data?.stats || {
    totalIssues: 0,
    newReports: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
    totalCitizens: 0,
    resolutionPercentage: 0
  };

  const issuesByCategory = data?.charts?.issuesByCategory || [];
  const issuesByStatus = data?.charts?.issuesByStatus || [];
  const monthlyReports = data?.charts?.monthlyReports || [];
  const recentIssues = data?.recentIssues || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Greeting Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(37, 99, 235, 0.08) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Municipal Control Center</h1>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              ADMINISTRATOR
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            City Public Works Department • Grievance Triage & Resolution Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/issues" className="btn btn-secondary btn-sm">
            <span>Manage All Issues</span>
            <ExternalLink size={14} />
          </Link>
          <Link to="/admin/analytics" className="btn btn-primary btn-sm">
            <span>Deep Analytics</span>
            <TrendingUp size={14} />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Total Issues */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Complaints
            </span>
            <FileText size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.1 }}>
            {stats.totalIssues}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across all municipal wards
          </div>
        </div>

        {/* New Reports */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              New Unassigned
            </span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.1, color: 'var(--accent-amber)' }}>
            {stats.newReports}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting inspection review
          </div>
        </div>

        {/* In Progress */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              In Progress
            </span>
            <Wrench size={18} color="#ea580c" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.1, color: '#ea580c' }}>
            {stats.inProgress}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Field repair crews active
          </div>
        </div>

        {/* Resolved */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Resolved Rate
            </span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.1, color: 'var(--accent-emerald)' }}>
            {stats.resolutionPercentage}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {stats.resolved} of {stats.totalIssues} closed
          </div>
        </div>

        {/* High Priority Alerts */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              High Priority
            </span>
            <AlertTriangle size={18} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.1, color: 'var(--accent-rose)' }}>
            {stats.highPriority}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Immediate risk or high upvotes
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Chart 1: Issues by Category */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Chart 1: Issues by Category
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Volume distribution across municipal problem types
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={issuesByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="category" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Issues by Status */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Chart 2: Issues by Status
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Proportion of issues currently in each pipeline stage
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={issuesByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ status, count }) => `${status}: ${count}`}
                  labelLine={false}
                >
                  {issuesByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Reports Velocity */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Chart 3: Monthly Reporting & Resolution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Temporal trend of submitted reports vs completed fixes
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="var(--primary)" fill="var(--primary-light)" name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="var(--accent-emerald)" fill="rgba(16, 185, 129, 0.2)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Issues Table Section */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Grievance Submissions</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Latest 10 complaints logged by citizens awaiting officer review
            </p>
          </div>

          <Link to="/admin/issues" className="btn btn-secondary btn-sm">
            <span>View All Reports</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Location</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Priority</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent issues logged yet.
                  </td>
                </tr>
              ) : (
                recentIssues.map((issue) => (
                  <tr
                    key={issue._id || issue.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                      {issue.complaintId}
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link
                        to={`/admin/issues/${issue.complaintId || issue._id || issue.id}`}
                        style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {issue.title}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {issue.category}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {issue.location}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={issue.status} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link
                        to={`/admin/issues/${issue.complaintId || issue._id || issue.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
