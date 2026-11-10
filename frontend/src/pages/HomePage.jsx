import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CtaSection from '../components/CtaSection';
import RightPanel from '../components/RightPanel';
import Footer from '../components/Footer';
import QuizLibraryPage from './QuizLibraryPage';
import QuizPage from './QuizPage';
import ResultsPage from './ResultsPage';
import ProfilePage from './ProfilePage';
import AnalyticsPage from './AnalyticsPage';
import AuthModal from '../components/AuthModal';
import { login, logout, register } from '../services/authApi';
import '../styles/DashboardLayout.css';
import '../styles/Home.css';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('library'); // Set default or switchable view
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('assessment-results') || '[]'); return Array.isArray(saved) ? saved : []; } catch { return []; }
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuiz = (quizData) => {
    setActiveQuiz(quizData);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitAssessment = (result) => {
    setAssessmentResult(result);
    setAssessmentResults((previous) => {
      const next = [...previous, result];
      try { localStorage.setItem('assessment-results', JSON.stringify(next)); } catch { /* Analytics remains available for this app session. */ }
      return next;
    });
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setCurrentView('library');
    setActiveQuiz(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticate = async ({ mode, username, email, password }) => {
    const response = mode === 'register'
      ? await register({ username, email, password })
      : await login({ username, password });

    if (mode === 'login') {
      setCurrentUser(response);
      setAuthMode(null);
      handleNavigate('dashboard');
    }
    return response;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setCurrentUser(null);
      handleNavigate('dashboard');
    }
  };

  return (
    <div className="dashboard-root">
      {/* 1. Left Vertical Navigation Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Area: Topbar + Body Grid */}
      <div className="dashboard-main-wrapper">
        {/* 2. Top Header with Search & Useful Actions */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          currentView={currentView}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogin={() => setAuthMode('login')}
          onRegister={() => setAuthMode('register')}
          onLogout={handleLogout}
        />

        {/* 3. Dashboard Body */}
        {currentView === 'dashboard' && (
          <div className="dashboard-body">
            {/* Central Section (Well-organized rectangular cards) */}
            <main className="dashboard-center-column">
              {/* Hero / Overview Card with 3D Adaptive Preview */}
              <HeroSection onExploreCatalog={() => handleNavigate('library')} />

              {/* Core Features Rectangular Grid */}
              <FeaturesSection />

              {/* 3-Step Flow */}
              <HowItWorksSection />

              {/* Call to Action Banner */}
              <CtaSection onGetStarted={() => setAuthMode('register')} />

              {/* Structured Compact Footer */}
              <Footer />
            </main>

            {/* 4. Right-side Panel (Activity, Progress, Calendar & Recommendations) */}
            <div className="dashboard-right-column">
              <RightPanel onStartSession={() => handleNavigate('library')} />
            </div>
          </div>
        )}

        {/* 4. Quiz Library Page (University Academic Curriculum: Subject -> Units -> MSE/ETE) */}
        {currentView === 'library' && (
          <div style={{ padding: '24px' }}>
            <QuizLibraryPage onStartQuiz={handleStartQuiz} />
            <Footer />
          </div>
        )}

        {/* 5. Active Adaptive Quiz Session */}
        {currentView === 'quiz' && (
          <div style={{ padding: '24px' }}>
            <QuizPage quizData={activeQuiz} onSubmitAssessment={handleSubmitAssessment} />
          </div>
        )}
        {currentView === 'results' && <div style={{ padding: '24px' }}><ResultsPage result={assessmentResult} onNavigate={handleNavigate} onRetake={() => { const quiz = assessmentResult?.quiz || activeQuiz; setAssessmentResult(null); handleStartQuiz(quiz); }} /></div>}
        {currentView === 'analytics' && <div style={{ padding: '24px' }}><AnalyticsPage onLaunchRecommendedQuiz={handleStartQuiz} assessmentResults={assessmentResults} /></div>}
        {currentView === 'profile' && <div style={{ padding: '24px' }}><ProfilePage /></div>}
      </div>
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSubmit={handleAuthenticate}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  );
}
