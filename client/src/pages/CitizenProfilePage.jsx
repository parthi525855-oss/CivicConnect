import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Save,
  ShieldCheck
} from 'lucide-react';
import { userService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CitizenProfilePage = () => {
  const { user: authUser, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userService.getProfile();
        setProfileData(res.data);
        setEditForm({
          name: res.data.name || '',
          phone: res.data.phone || '',
          address: res.data.address || ''
        });
      } catch (err) {
        error(err.message || 'Failed loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userService.updateProfile(editForm);
      setProfileData((prev) => ({ ...prev, ...res.data }));
      await refreshUser();
      success('Profile updated successfully!');
    } catch (err) {
      error(err.message || 'Failed updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        Loading profile details...
      </div>
    );
  }

  const stats = profileData?.stats || {
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0
  };

  const joinedDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Overview Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800
          }}
        >
          {profileData?.name ? profileData.name[0].toUpperCase() : 'U'}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{profileData?.name}</h1>
            <span className="badge badge-priority-normal">
              <ShieldCheck size={12} />
              {profileData?.role?.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={14} />
              <span>{profileData?.email}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Member since {joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Civic Engagement Statistics Cards */}
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
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalReports}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Reports</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.pendingReports}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Reports</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.resolvedReports}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolved Reports</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Edit Personal Profile
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Keep your contact information up to date for SMS/email escalation references.
        </p>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="profile-name">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              className="form-input"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="profile-email">
              Email Address (Cannot be changed)
            </label>
            <input
              id="profile-email"
              type="email"
              className="form-input"
              value={profileData?.email || ''}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'var(--bg-subtle)' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="profile-phone">
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                className="form-input"
                placeholder="+91 98400..."
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="profile-address">
                Residential Locality
              </label>
              <input
                id="profile-address"
                type="text"
                className="form-input"
                placeholder="e.g. Anna Nagar, Chennai"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ minWidth: '140px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitizenProfilePage;
