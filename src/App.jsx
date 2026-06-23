import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from './components/common/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import RegisterPage from './features/auth/RegisterPage';
import LoginPage from './features/auth/LoginPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import ResendVerificationPage from './features/auth/ResendVerificationPage';

import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import TemplatesPage from './pages/TemplatesPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <ErrorBoundary>
        <Routes>
          {/* Public-only routes (redirect to dashboard if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Public routes accessible regardless of auth state */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/resend-verification" element={<ResendVerificationPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Resume editor has its own minimal top bar, not the main app nav */}
            <Route path="/resume/:id" element={<ResumeEditorPage />} />

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/payment/history" element={<PaymentHistoryPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
