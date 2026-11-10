import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/Navbar.css';

export default function Navbar({ onToggleSidebar, currentView = 'dashboard', onNavigate, currentUser, onLogin, onRegister, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleBreadcrumbClick = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="top-header">
      <div className="top-header-inner">
        {/* Left Area: Toggle & Breadcrumb */}
        <div className="top-header-left">
          <button
            className="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation Sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="top-breadcrumb">
            <span
              style={{ cursor: 'pointer' }}
              onClick={handleBreadcrumbClick}
            >
              Adaptive Quiz
            </span>
            <span>/</span>
            <span className="current">
              {currentView === 'library'
                ? 'Quiz Library'
                : currentView === 'quiz'
                ? 'Active Quiz'
                : currentView === 'results'
                ? 'Results'
                : currentView === 'analytics'
                ? 'Analytics'
                : currentView === 'profile'
                ? 'Profile & Settings'
                : 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="top-search-wrapper">
          <svg
            className="search-input-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="top-search-input"
            placeholder="Search quizzes, subjects, questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-shortcut-badge">⌘K</span>
        </div>

        {/* Right: Actions */}
        <div className="top-header-right">
          <div className="streak-pill" title="5 consecutive practice days">
            <span>🔥</span>
            <span>5-Day Streak</span>
          </div>

          <ThemeToggle />

          <button
            className="notification-btn"
            aria-label="Notifications"
            onClick={() => alert('No new notifications')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-dot" />
          </button>

          {currentUser ? (
            <>
              <span className="authenticated-user">Hi, {currentUser.username}</span>
              <button className="btn-nav-login" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-nav-login" onClick={onLogin}>Login</button>
              <button className="btn-nav-signup" onClick={onRegister}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
