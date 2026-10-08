import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CyberNoiseBackground from './components/ui/CyberNoiseBackground';
import ComicHalftoneOverlay from './components/ui/ComicHalftoneOverlay';

// Existing Pages
import HomePage from './pages/HomePage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';
import CompetitionsListPage from './pages/CompetitionsListPage';
import MissionsPage from './pages/MissionsPage';
import SchedulePage from './pages/SchedulePage';
import PrizesPage from './pages/PrizesPage';
import RulesFaqPage from './pages/RulesFaqPage';
import AboutPage from './pages/AboutPage';
import MentorsJudgesPage from './pages/MentorsJudgesPage';
import SponsorsPage from './pages/SponsorsPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Participant Dashboard Pages
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import DashboardProfilePage from './pages/dashboard/DashboardProfilePage';
import DashboardTeamPage from './pages/dashboard/DashboardTeamPage';
import DashboardRegistrationPage from './pages/dashboard/DashboardRegistrationPage';
import DashboardSubmissionPage from './pages/dashboard/DashboardSubmissionPage';

// Judge Arena Pages
import JudgeDashboardPage from './pages/judge/JudgeDashboardPage';
import JudgeEvaluatePage from './pages/judge/JudgeEvaluatePage';

// Admin / Organizer Pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminParticipantsPage from './pages/admin/AdminParticipantsPage';
import AdminTeamsPage from './pages/admin/AdminTeamsPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage';
import AdminJudgingPage from './pages/admin/AdminJudgingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="site-wrapper">
          <CyberNoiseBackground />
          <ComicHalftoneOverlay />
          <Navbar />
          <Routes>
            {/* Main Cinematic Landing Page */}
            <Route path="/" element={<HomePage />} />

            {/* Dedicated Sections & Details */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/competitions" element={<CompetitionsListPage />} />
            <Route path="/codeathon" element={<CompetitionDetailPage competitionId="codeathon" />} />
            <Route path="/ideathon" element={<CompetitionDetailPage competitionId="ideathon" />} />
            <Route path="/hackathon" element={<CompetitionDetailPage competitionId="hackathon" />} />
            
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/prizes" element={<PrizesPage />} />
            <Route path="/rules" element={<RulesFaqPage />} />
            <Route path="/faq" element={<RulesFaqPage />} />
            <Route path="/mentors" element={<MentorsJudgesPage />} />
            <Route path="/judges" element={<MentorsJudgesPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Participant Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <DashboardProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/team"
              element={
                <ProtectedRoute>
                  <DashboardTeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/registration"
              element={
                <ProtectedRoute>
                  <DashboardRegistrationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/submission"
              element={
                <ProtectedRoute>
                  <DashboardSubmissionPage />
                </ProtectedRoute>
              }
            />

            {/* Judge Routes */}
            <Route
              path="/judge"
              element={
                <ProtectedRoute allowedRoles={['judge', 'admin', 'organizer']}>
                  <JudgeDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/judge/submissions"
              element={
                <ProtectedRoute allowedRoles={['judge', 'admin', 'organizer']}>
                  <JudgeDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/judge/evaluate/:submissionId"
              element={
                <ProtectedRoute allowedRoles={['judge', 'admin', 'organizer']}>
                  <JudgeEvaluatePage />
                </ProtectedRoute>
              }
            />

            {/* Admin / Organizer Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                  <AdminOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/participants"
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                  <AdminParticipantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teams"
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                  <AdminTeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                  <AdminRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/submissions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                  <AdminSubmissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/judging"
              element={
                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                  <AdminJudgingPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
