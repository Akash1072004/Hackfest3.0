import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="site-wrapper">
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

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
