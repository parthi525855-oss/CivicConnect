import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommunityIssuesPage from './pages/CommunityIssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import CivicAwarenessPage from './pages/CivicAwarenessPage';

// Protected Citizen Pages
import CitizenDashboard from './pages/CitizenDashboard';
import ReportIssuePage from './pages/ReportIssuePage';
import CitizenProfilePage from './pages/CitizenProfilePage';
import NotificationsPage from './pages/NotificationsPage';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminIssuesPage from './pages/AdminIssuesPage';
import AdminIssueDetailPage from './pages/AdminIssueDetailPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

// Auth Guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/issues" element={<CommunityIssuesPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />
                <Route path="/civic-awareness" element={<CivicAwarenessPage />} />
              </Route>

              {/* Protected Citizen Routes with DashboardLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/report" element={<ReportIssuePage />} />
                <Route path="/profile" element={<CitizenProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>

              {/* Protected Admin Routes with DashboardLayout */}
              <Route
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/issues" element={<AdminIssuesPage />} />
                <Route path="/admin/issues/:id" element={<AdminIssueDetailPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
