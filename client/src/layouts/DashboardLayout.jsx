import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  MapPin,
  Bell,
  User,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const citizenNav = [
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Report New Issue', path: '/report', icon: PlusCircle },
    { label: 'Community Feed', path: '/issues', icon: MapPin },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'All Civic Reports', path: '/admin/issues', icon: FileSpreadsheet },
    { label: 'Issue Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Public Feed', path: '/issues', icon: MapPin }
  ];

  const currentNav = isAdmin ? adminNav : citizenNav;

  return (
    <div className="app-wrapper">
      <Navbar />
      <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '2rem',
              alignItems: 'start'
            }}
            className="dashboard-grid"
          >
            {/* Sidebar */}
            <aside
              className="dashboard-sidebar"
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* User Snapshot Header */}
              <div
                style={{
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isAdmin ? 'var(--accent-purple)' : 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {user?.name}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ShieldCheck size={12} color="var(--primary)" />
                      {isAdmin ? 'Municipal Administrator' : 'Verified Citizen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: active ? 700 : 500,
                        color: active ? 'var(--primary)' : 'var(--text-secondary)',
                        backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {active && <ChevronRight size={14} />}
                    </Link>
                  );
                })}
              </nav>

              {/* College Project Viva Helper Badge */}
              <div
                style={{
                  marginTop: '2rem',
                  padding: '12px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Viva Navigation
                </div>
                Toggle roles or view real-time data timeline directly from the portal.
              </div>
            </aside>

            {/* Main Dashboard Area */}
            <main style={{ minWidth: 0 }}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
