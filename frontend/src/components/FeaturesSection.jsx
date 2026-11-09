import React from 'react';

const featuresData = [
  {
    id: 'adaptive',
    title: 'Adaptive Quizzes',
    badge: 'Real-time AI',
    description:
      'Questions calibrate dynamically to your response history, ensuring you are always learning in your optimal zone of proximal development.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 'personalized',
    title: 'Personalized Learning',
    badge: 'Tailored',
    description:
      'Focus precisely on topics where you need the most practice, skipping unnecessary repetition of concepts you have already mastered.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'feedback',
    title: 'Instant Feedback',
    badge: 'Immediate',
    description:
      'Clear, actionable explanations after every answer give you immediate clarity on core concepts without waiting for final grades.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: 'tracking',
    title: 'Progress Tracking',
    badge: 'Analytics',
    description:
      'Detailed diagnostic dashboards track your retention curve, accuracy trends, and mastery milestones across every subject.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
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
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="dashboard-section" id="features">
      <div className="section-head-row">
        <div>
          <div className="section-badge">Core Capabilities</div>
          <h2 className="section-title">Built for Peak Cognitive Retention</h2>
        </div>
        <p className="section-subtitle">
          Intelligent assessment architecture tailored for students and professionals.
        </p>
      </div>

      <div className="features-card-grid">
        {featuresData.map((feature) => (
          <div key={feature.id} className="feature-rect-card card-3d">
            <div className="card-top-line">
              <div className="feature-icon-box">{feature.icon}</div>
              <span className="feature-tag">{feature.badge}</span>
            </div>
            <h3 className="feature-card-heading">{feature.title}</h3>
            <p className="feature-card-desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
