import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

// Fix standard Leaflet default icon paths with CDN fallback
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const CATEGORY_COLORS = {
  Roads: '#f59e0b',
  Garbage: '#10b981',
  Water: '#06b6d4',
  Drainage: '#6366f1',
  Streetlights: '#eab308',
  Traffic: '#ef4444',
  'Public Infrastructure': '#8b5cf6',
  Environment: '#10b981',
  Other: '#64748b'
};

const CommunityMap = ({ issues = [], center = [13.0827, 80.2707], zoom = 12 }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = [];

    issues.forEach((issue) => {
      const lat = issue.coordinates?.lat || 13.0827;
      const lng = issue.coordinates?.lng || 80.2707;
      bounds.push([lat, lng]);

      const pinColor = CATEGORY_COLORS[issue.category] || '#2563eb';

      // Custom circular marker icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
          ">
            ●
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">
              ${issue.complaintId}
            </span>
            <span style="font-size: 11px; font-weight: 600; color: #475569;">
              ${issue.category}
            </span>
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 14px; color: #0f172a; line-height: 1.3;">
            ${issue.title}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
            📍 ${issue.location}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span style="font-size: 11px; font-weight: 600; color: #059669;">
              Status: ${issue.status}
            </span>
            <a href="/issues/${issue.complaintId || issue._id}" style="color: #2563eb; font-size: 12px; font-weight: 600; text-decoration: none;">
              Details &rarr;
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.bindPopup(popupContent);
      markersLayerRef.current.addLayer(marker);
    });

    if (bounds.length > 0 && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [issues]);

  return (
    <div
      style={{
        width: '100%',
        height: '460px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default CommunityMap;
