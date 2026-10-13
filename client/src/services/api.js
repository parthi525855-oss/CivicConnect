import axios from 'axios';

// Normalize API base URL from Vite environment variable
const rawApiUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`)
  : '/api';

// Base backend server origin (without /api suffix) for static assets like /uploads
export const SERVER_BASE_URL = rawApiUrl
  ? rawApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '')
  : '';

/**
 * Resolves full URL for issue media/images.
 * Uses configured VITE_API_URL in production, and relative proxy path in development.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  if (SERVER_BASE_URL) {
    return `${SERVER_BASE_URL}${cleanPath}`;
  }
  return cleanPath;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for friendly error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
