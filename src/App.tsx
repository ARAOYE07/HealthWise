import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { History } from './pages/History';
import { Topics } from './pages/Topics';
import { Profile } from './pages/Profile';

import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAssessments } from './pages/admin/AdminAssessments';
import { AdminSafety } from './pages/admin/AdminSafety';
import { AdminAIReview } from './pages/admin/AdminAIReview';
import { AdminTopics } from './pages/admin/AdminTopics';
import { AdminTips } from './pages/admin/AdminTips';

// Minimal Onboarding Stub
const Onboarding = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to HealthWise!</h1>
      <p className="text-gray-500 mb-6">Let's get your profile set up.</p>
      <a href="/dashboard" className="px-6 py-3 bg-emerald-600 text-white rounded-full">Continue to Dashboard</a>
    </div>
  </div>
);

// Minimal Tips Stub
const Tips = () => (
  <div className="max-w-3xl mx-auto py-8">
    <h1 className="text-3xl font-bold mb-8">Daily Health Tips</h1>
    <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100">
      <h3 className="font-semibold text-lg mb-2">Hydration is Key</h3>
      <p className="text-gray-700 mb-4">Water makes up about 60% of your body weight and is essential for every system to function properly.</p>
      <div className="text-sm text-sky-800 bg-sky-100 px-4 py-3 rounded-lg">
        <strong>Action:</strong> Aim to drink 8 glasses of water a day.
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with AppLayout (Navbar/Footer) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/topics" element={<Topics />} />
            {/* Additional informational pages could go here */}
            <Route path="/how-it-works" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/privacy" element={<Navigate to="/" replace />} />
            <Route path="/terms" element={<Navigate to="/" replace />} />
            <Route path="/disclaimer" element={<Navigate to="/" replace />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tips" element={<Tips />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="assessments" element={<AdminAssessments />} />
            <Route path="ai-review" element={<AdminAIReview />} />
            <Route path="safety" element={<AdminSafety />} />
            <Route path="topics" element={<AdminTopics />} />
            <Route path="tips" element={<AdminTips />} />
            {/* Stubs for remaining admin routes */}
            <Route path="feedback" element={<div className="p-8">Feedback</div>} />
            <Route path="reports" element={<div className="p-8">Reports</div>} />
            <Route path="settings" element={<div className="p-8">Settings</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
