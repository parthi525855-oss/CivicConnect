import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Map,
  LayoutGrid,
  ArrowUpDown,
  AlertCircle,
  MapPin,
  Sparkles
} from 'lucide-react';
import { issueService } from '../services/issueService';
import IssueCard from '../components/IssueCard';
import CommunityMap from '../components/CommunityMap';

const CATEGORIES = [
  'All',
  'Roads',
  'Garbage',
  'Water',
  'Drainage',
  'Streetlights',
  'Traffic',
  'Public Infrastructure',
  'Environment',
  'Other'
];

const STATUSES = ['All', 'Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['All', 'NORMAL', 'MEDIUM', 'HIGH'];

const CommunityIssuesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'All');
  const [sort, setSort] = useState('newest');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await issueService.getIssues({
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined,
        priority: priority !== 'All' ? priority : undefined,
        search: search.trim() || undefined,
        sort
      });
      setIssues(res.data || []);
    } catch (err) {
      console.error('Error fetching community issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, priority, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setPriority('All');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Page Title & View Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
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
            Public Civic Directory
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '2px' }}>
            Community Issues Feed
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Browse citizen reports, endorse unresolved problems, and inspect live geographic distribution.
          </p>
        </div>

        {/* View Switcher: Grid vs Map */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            onClick={() => setViewMode('grid')}
            className="btn btn-sm"
            style={{
              backgroundColor: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              fontWeight: viewMode === 'grid' ? 700 : 500
            }}
          >
            <LayoutGrid size={16} />
            <span>Card Feed</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className="btn btn-sm"
            style={{
              backgroundColor: viewMode === 'map' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'map' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'map' ? 'var(--shadow-sm)' : 'none',
              fontWeight: viewMode === 'map' ? 700 : 500
            }}
          >
            <Map size={16} />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        {/* Search input */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            gap: '10px',
            width: '100%'
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Title, ID (e.g. CIV-2026-0001), or Area (e.g. Anna Nagar)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Filter controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

            {/* Status */}
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

            {/* Priority */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Priority:
              </span>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="var(--text-muted)" />
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
                <option value="upvotes">Most Endorsements</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Map or Grid */}
      {viewMode === 'map' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>
                Showing <strong>{issues.length}</strong> geolocated incidents across the city. Click any pin to view details.
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              OpenStreetMap + Leaflet Engine
            </span>
          </div>

          <CommunityMap issues={issues} />
        </div>
      ) : (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Loading community civic reports...
            </div>
          ) : issues.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <AlertCircle size={32} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Matching Reports</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
                No civic issues matched your query. Try broadening your category or location filters.
              </p>
              <button onClick={resetFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}
              >
                Showing {issues.length} civic report{issues.length !== 1 ? 's' : ''}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.75rem'
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommunityIssuesPage;
