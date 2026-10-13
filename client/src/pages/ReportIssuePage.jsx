import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Upload,
  MapPin,
  Tag,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Compass
} from 'lucide-react';
import { issueService } from '../services/issueService';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
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

const LOCALITY_PRESETS = [
  { name: 'Anna Nagar West', lat: 13.0878, lng: 80.2085 },
  { name: 'T. Nagar (Panagal Park)', lat: 13.0418, lng: 80.2341 },
  { name: 'Adyar (LB Road)', lat: 13.0064, lng: 80.2575 },
  { name: 'Velachery (Gandhi Street)', lat: 12.9815, lng: 80.218 },
  { name: 'Mylapore (Luz Corner)', lat: 13.0368, lng: 80.2676 },
  { name: 'Guindy (Kathipara)', lat: 13.0067, lng: 80.2025 }
];

const ReportIssuePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Roads',
    description: '',
    location: '',
    landmark: '',
    priority: 'NORMAL',
    lat: '13.0827',
    lng: '80.2707'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocalityPreset = (loc) => {
    setFormData((prev) => ({
      ...prev,
      location: loc.name,
      lat: loc.lat.toString(),
      lng: loc.lng.toString()
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error('File size exceeds 5MB limit');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description || !formData.location) {
      error('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('landmark', formData.landmark);
      data.append('priority', formData.priority);
      data.append('lat', formData.lat);
      data.append('lng', formData.lng);

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await issueService.createIssue(data);

      success(`Complaint ${res.data.complaintId} submitted successfully!`);
      navigate(`/issues/${res.data.complaintId}`);
    } catch (err) {
      error(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1rem 0 3rem 0' }}>
      <div
        className="card"
        style={{
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}
          >
            <ShieldAlert size={14} />
            <span>Official Civic Grievance Intake</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Report a Civic Problem</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
            Provide accurate details and photos to help municipal field crews dispatch repairs quickly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Title */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="issue-title">
              Issue Title *
            </label>
            <input
              id="issue-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Deep pothole causing accidents near bus stop"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={120}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Concise summary of the civic hazard (up to 120 characters)
            </span>
          </div>

          {/* Category & Requested Priority */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="issue-category">
                Civic Category *
              </label>
              <select
                id="issue-category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="issue-priority">
                Urgency Level
              </label>
              <select
                id="issue-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="NORMAL">NORMAL (Standard baseline)</option>
                <option value="MEDIUM">MEDIUM (Moderate disruption)</option>
                <option value="HIGH">HIGH (Immediate safety hazard)</option>
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                *Note: Evaluated dynamically using our rule-based smart priority engine.
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="issue-description">
              Detailed Description *
            </label>
            <textarea
              id="issue-description"
              name="description"
              className="form-textarea"
              rows={4}
              placeholder="Describe the problem, duration, approximate dimensions, and immediate safety risks..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Location & Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="issue-location">
                  Locality / Neighborhood *
                </label>
                <input
                  id="issue-location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Anna Nagar West, Chennai"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="issue-landmark">
                  Nearest Landmark (Optional)
                </label>
                <input
                  id="issue-landmark"
                  name="landmark"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Opposite Metro Gate 2"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Quick locality suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Popular Metro Areas:
              </span>
              {LOCALITY_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleLocalityPreset(p)}
                  className="badge"
                  style={{
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Evidence Photo Upload</label>
            {imagePreview ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={imagePreview}
                  alt="Issue Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#ffffff',
                    padding: '6px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-subtle)',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Upload size={22} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                    Click to select photo
                  </span>{' '}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    or drag & drop
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    PNG, JPG, WEBP up to 5MB (Default category image used if skipped)
                  </div>
                </div>
              </label>
            )}
          </div>

          {/* Submission Info Box */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}
          >
            <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Rule-Based Intake:</strong> Your issue will be assigned a unique sequence number (e.g. CIV-2026-XXXX). Priority will be calculated transparently based on municipal category and risk indicators.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Registering Complaint...' : 'Submit Civic Complaint'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssuePage;
