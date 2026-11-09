import React from 'react';
import '../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose, currentView = 'dashboard', onNavigate }) {
  const handleNav = (view, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div
          className="sidebar-brand"
          style={{ cursor: 'pointer' }}
          onClick={(e) => handleNav('dashboard', e)}
        >
          <div className="sidebar-logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>
            Adaptive<span className="brand-text-accent">Quiz</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Menu</span>

          <a
            href="#home"
            className={`sidebar-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => handleNav('dashboard', e)}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Overview</span>
          </a>

          <a
            href="#quizzes"
            className={`sidebar-nav-item ${currentView === 'library' ? 'active' : ''}`}
            onClick={(e) => handleNav('library', e)}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 6 12 12 16 14" />
            </svg>
            <span>Adaptive Quizzes</span>
            <span className="nav-badge-pill">AI</span>
          </a>

          <a
            href="#library"
            className={`sidebar-nav-item ${currentView === 'library' ? 'active' : ''}`}
            onClick={(e) => handleNav('library', e)}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>Practice Catalog</span>
          </a>

          <a
            href="#analytics"
            className={`sidebar-nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={(e) => handleNav('analytics', e)}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Analytics & Mastery</span>
          </a>

          <span className="nav-section-title" style={{ marginTop: '8px' }}>
            System
          </span>

          <a
            href="#study-goals"
            className="sidebar-nav-item"
            onClick={(e) => {
              e.preventDefault();
              alert('Study Goals: Semester target manager active!');
            }}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Study Goals</span>
          </a>
          <a href="#profile" className={`sidebar-nav-item ${currentView === 'profile' ? 'active' : ''}`} onClick={(e) => handleNav('profile', e)}>
            <span className="nav-icon" aria-hidden="true">⚙</span><span>Profile & Settings</span>
          </a>
        </nav>

        {/* Pro / Smart Calibration Box */}
        <div className="sidebar-feature-box">
          <div className="feature-box-title">
            <span>✨ Item Response Theory</span>
          </div>
          <p className="feature-box-desc">
            Real-time difficulty adjustment based on every response you submit.
          </p>
          <div className="feature-box-indicator">
            <span className="dot-pulse" />
            <span>Engine Active</span>
          </div>
        </div>

        {/* User Status at Bottom */}
        <div className="sidebar-user">
          <div className="user-avatar">AM</div>
          <div className="user-info">
            <span className="user-name">Alex Morgan</span>
            <span className="user-role">Scholar Tier II</span>
          </div>
        </div>
      </aside>
    </>
  );
}
