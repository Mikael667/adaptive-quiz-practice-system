import React from 'react';

export default function CtaSection({ onGetStarted }) {
  return (
    <section className="cta-banner-card card-3d">
      <div className="cta-banner-content">
        <span className="cta-tag">Ready to Excel?</span>
        <h2 className="cta-heading">Elevate Your Practice with Adaptive Intelligence</h2>
        <p className="cta-sub">
          Join thousands of learners mastering complex concepts through tailored, data-driven quizzes.
        </p>

        <div className="cta-btn-row">
          <button
            type="button"
            className="btn btn-sand"
            onClick={onGetStarted}
          >
            <span>Start Free Practice</span>
            <svg
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <a href="#features" className="btn btn-secondary cta-outline-btn">
            Explore Capabilities
          </a>
        </div>

        <div className="cta-perks-row">
          <span>✓ Instant Access</span>
          <span>•</span>
          <span>✓ No Credit Card Required</span>
          <span>•</span>
          <span>✓ Personalized Feedback</span>
        </div>
      </div>
    </section>
  );
}
