import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Sun,
  Moon,
  PlusCircle,
  LayoutDashboard,
  MapPin,
  BookOpen,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1
              }}
            >
              Civic<span style={{ color: 'var(--primary)' }}>Connect</span>
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              Public Issue Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.25rem'
          }}
          className="desktop-nav"
        >
          <Link
            to="/issues"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/issues') ? 'var(--primary)' : 'var(--text-secondary)',
              textDecoration: 'none'
            }}
          >
            Community Issues
          </Link>

          <Link
            to="/civic-awareness"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/civic-awareness') ? 'var(--primary)' : 'var(--text-secondary)',
              textDecoration: 'none'
            }}
          >
            Civic Awareness
          </Link>

          {isAuthenticated && !isAdmin && (
            <Link
              to="/dashboard"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-secondary)',
                textDecoration: 'none'
              }}
            >
              Citizen Dashboard
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive('/admin') ? 'var(--primary)' : 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
              >
                Admin Console
              </Link>
              <Link
                to="/admin/analytics"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive('/admin/analytics') ? 'var(--primary)' : 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
              >
                Analytics
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Report Button (Prominent for Citizens/Guests) */}
          <Link
            to="/report"
            className="btn btn-primary btn-sm"
            style={{ display: 'none' }}
            id="desktop-report-btn"
          >
            <PlusCircle size={15} />
            <span>Report Issue</span>
          </Link>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '8px',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications Dropdown for Logged In Users */}
          {isAuthenticated && <NotificationDropdown />}

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to={isAdmin ? '/admin' : '/profile'}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
                title="Profile"
              >
                <User size={15} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: '10px',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            id="mobile-menu-btn"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-color)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Link
            to="/report"
            className="btn btn-primary"
            onClick={() => setMobileMenuOpen(false)}
            style={{ width: '100%' }}
          >
            <PlusCircle size={16} />
            <span>Report an Issue</span>
          </Link>

          <Link
            to="/issues"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MapPin size={18} />
            <span>Community Issues</span>
          </Link>

          <Link
            to="/civic-awareness"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={18} />
            <span>Civic Awareness</span>
          </Link>

          {isAuthenticated && (
            <>
              {!isAdmin && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LayoutDashboard size={18} />
                  <span>Citizen Dashboard</span>
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </Link>

                  <Link
                    to="/admin/issues"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FileSpreadsheet size={18} />
                    <span>All Issues Management</span>
                  </Link>

                  <Link
                    to="/admin/analytics"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <BarChart3 size={18} />
                    <span>Analytics & Charts</span>
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
            </>
          )}
        </div>
      )}

      {/* Media query styling inline helper */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-report-btn {
            display: inline-flex !important;
          }
          #mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
