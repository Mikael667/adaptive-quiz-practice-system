import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content-row">
        <div className="footer-brand-snippet">
          <div className="footer-logo-small">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          <span className="footer-sep">•</span>
          <span className="footer-copy">© {new Date().getFullYear()} Adaptive Quiz and Practice System.</span>
        </div>

        <div className="footer-quick-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Docs</a>
        </div>
      </div>
    </footer>
  );
}
