import React, { useState } from 'react';

export default function HeroSection() {
  const [selectedOption, setSelectedOption] = useState(1);

  return (
    <section className="hero-card card-3d animate-fade-in" id="home">
      {/* Subtle 3D Abstract Knowledge Backdrop */}
      <div className="hero-3d-backdrop" aria-hidden="true">
        <div className="hero-ambient-glow" />
        <svg
          className="hero-3d-object"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Core Radial Glow */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F6F0E8" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#C69A75" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#815B46" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B2923" stopOpacity="0" />
            </radialGradient>

            {/* Bronze & Sand Linear Gradients for 3D Rings */}
            <linearGradient id="ringGradBronze" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C69A75" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#815B46" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B2923" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="ringGradSand" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F6F0E8" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#C69A75" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#815B46" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="ringGradGold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#815B46" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#C69A75" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F6F0E8" stopOpacity="0.5" />
            </linearGradient>

            {/* Soft Glow Filter */}
            <filter id="softAura" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Diffuse Outer Halo */}
          <circle cx="250" cy="250" r="160" fill="url(#coreGlow)" filter="url(#softAura)" opacity="0.65" />

          {/* Outer Gyroscopic Ring */}
          <ellipse
            className="anim-ring-outer"
            cx="250"
            cy="250"
            rx="185"
            ry="92"
            stroke="url(#ringGradBronze)"
            strokeWidth="2.2"
          />

          {/* Secondary Angled Ring with Calibration Ticks */}
          <ellipse
            className="anim-ring-middle"
            cx="250"
            cy="250"
            rx="155"
            ry="72"
            stroke="url(#ringGradSand)"
            strokeWidth="1.8"
            strokeDasharray="6 4"
          />

          {/* Vertical Meridian Ring */}
          <ellipse
            className="anim-ring-meridian"
            cx="250"
            cy="250"
            rx="78"
            ry="170"
            stroke="url(#ringGradGold)"
            strokeWidth="1.8"
          />

          {/* Central Illumination Core */}
          <circle className="anim-core-outer" cx="250" cy="250" r="40" fill="url(#coreGlow)" />
          <circle className="anim-core-inner" cx="250" cy="250" r="16" fill="#F6F0E8" opacity="0.85" filter="url(#softAura)" />

          {/* Floating Subtle Knowledge Nodes */}
          <circle className="anim-node node-a" cx="380" cy="190" r="5" fill="#C69A75" opacity="0.8" />
          <circle className="anim-node node-b" cx="130" cy="305" r="4" fill="#815B46" opacity="0.75" />
          <circle className="anim-node node-c" cx="295" cy="365" r="3.5" fill="#F6F0E8" opacity="0.7" />
        </svg>
      </div>

      <div className="hero-grid">
        {/* Left: Content Column */}
        <div className="hero-text-col">
          <div className="section-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Adaptive Learning Engine</span>
          </div>

          <h1 className="hero-headline">
            Master Any Subject with <span className="highlight-text">Intelligent Adaptive</span> Quizzes
          </h1>

          <p className="hero-subtext">
            Experience smart quizzes that adjust question difficulty in real time to match your exact knowledge level.
            Target weak areas, receive instant explanations, and accelerate your mastery.
          </p>

          <div className="hero-actions">
            <a href="#how-it-works" className="btn btn-primary">
              <span>Start Learning</span>
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <a href="#features" className="btn btn-secondary">
              <span>Explore Features</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="hero-metrics-strip">
            <div className="metric-cell">
              <span className="metric-val">98%</span>
              <span className="metric-lbl">Mastery Rate</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-cell">
              <span className="metric-val">5k+</span>
              <span className="metric-lbl">Calibrated Questions</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-cell">
              <span className="metric-val">4.9/5</span>
              <span className="metric-lbl">Learner Rating</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive 3D Mockup Card */}
        <div className="hero-interactive-col">
          <div className="quiz-preview-box">
            <div className="preview-top-bar">
              <div className="live-status-pill">
                <span className="live-dot" />
                <span className="live-text">Live Adaptive Session</span>
              </div>
              <span className="difficulty-badge">Level: Intermediate</span>
            </div>

            <div className="preview-progress-track">
              <div className="preview-progress-fill" style={{ width: '65%' }} />
            </div>

            <h3 className="preview-prompt">
              Which algorithmic approach dynamically adjusts item difficulty based on learner ability?
            </h3>

            <div className="preview-choices">
              {[
                { id: 0, text: 'Static chronological sorting' },
                { id: 1, text: 'Item Response Theory (IRT) & Bayesian Scoring' },
                { id: 2, text: 'Unweighted random selection' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`preview-choice-btn ${selectedOption === opt.id ? 'active' : ''}`}
                  onClick={() => setSelectedOption(opt.id)}
                >
                  <span className="choice-indicator">
                    {selectedOption === opt.id ? '✓' : ''}
                  </span>
                  <span className="choice-label">{opt.text}</span>
                </button>
              ))}
            </div>

            <div className="preview-bottom-bar">
              <div className="xp-tag">
                <span className="xp-val">+15 XP</span>
                <span className="xp-sub">Precision: High</span>
              </div>
              <span className="feedback-tag">Instant feedback active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
