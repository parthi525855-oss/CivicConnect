import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { issueService } from '../services/issueService';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';

const CATEGORIES = ['All', 'Roads', 'Garbage', 'Water', 'Drainage', 'Streetlights', 'Traffic', 'Public Infrastructure', 'Environment', 'Other'];
const STATUSES = ['All', 'Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchCitizenIssues = async () => {
    try {
      setLoading(true);
      const res = await issueService.getIssues({
        myIssues: 'true',
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined,
        search: search.trim() || undefined,
        sort
      });
      setIssues(res.data || []);
    } catch (err) {
      console.error('Failed fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizenIssues();
  }, [category, status, sort]);

  // Debounced search trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCitizenIssues();
  };

  // Card metrics calculation from issues
  const totalCount = issues.length;
  const pendingCount = issues.filter((i) =>
    ['Reported', 'Under Review', 'Assigned'].includes(i.status)
  ).length;
  const inProgressCount = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = issues.filter((i) =>
    ['Resolved', 'Closed'].includes(i.status)
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Track the status of your submitted civic complaints and monitor local resolutions.
          </p>
        </div>

        <Link to="/report" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Dashboard KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Reports
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Pending Review
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(249, 115, 22, 0.15)',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Wrench size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
              {inProgressCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              In Progress
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
              {resolvedCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Resolved & Closed
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.25rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Submitted Complaints</h2>

          {/* Search form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '1',
              maxWidth: '380px'
            }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by ID, title, or locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem', fontSize: '0.875rem' }}
              />
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              Search
            </button>
          </form>
        </div>

        {/* Dropdown Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Category:
            </span>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Status:
            </span>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sort:
            </span>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="upvotes">Most Supported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading your complaint reports...
        </div>
      ) : issues.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Complaints Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
            You haven't reported any civic problems matching the current filters yet. Help your neighborhood by lodging a complaint!
          </p>
          <Link to="/report" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <PlusCircle size={16} />
            <span>Report an Issue</span>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {issues.map((issue) => (
            <IssueCard
              key={issue._id || issue.id}
              issue={issue}
              onUpdate={(updated) => {
                setIssues((prev) =>
                  prev.map((i) =>
                    (i._id || i.id) === (updated._id || updated.id) ? updated : i
                  )
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
