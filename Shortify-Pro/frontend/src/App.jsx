import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MyUrlsPage = lazy(() => import('./pages/MyUrlsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const UrlAnalyticsPage = lazy(() => import('./pages/UrlAnalyticsPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const QrCenterPage = lazy(() => import('./pages/QrCenterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LinkExpiredPage = lazy(() => import('./pages/LinkExpiredPage'));
const LinkNotFoundPage = lazy(() => import('./pages/LinkNotFoundPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6">
    <div className="w-12 h-12 rounded-xl bg-[#FFA116]/10 flex items-center justify-center text-[#FFA116] border border-[#FFA116]/20 animate-pulse mb-4">
      <FiZap size={24} />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF] animate-pulse">
      KatoLink is loading...
    </p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/expired" element={<LinkExpiredPage />} />
        <Route path="/not-found" element={<LinkNotFoundPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-urls" element={<MyUrlsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/url/:id" element={<UrlAnalyticsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/qr-center" element={<QrCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/404" element={<LinkNotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;

