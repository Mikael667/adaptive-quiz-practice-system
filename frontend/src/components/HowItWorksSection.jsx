import React from 'react';

const stepsData = [
  {
    stepNumber: '01',
    title: 'Choose a Subject',
    description:
      'Select from curated subjects such as Data Structures, Java, Algorithms, or import custom question sets.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
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
    ),
  },
  {
    stepNumber: '02',
    title: 'Take an Adaptive Quiz',
    description:
      'Our Item Response Theory engine calibrates each subsequent question based on your preceding answers.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    stepNumber: '03',
    title: 'Track & Improve',
    description:
      'Inspect detailed diagnostics, identify knowledge gaps, and watch your proficiency score climb.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="dashboard-section" id="how-it-works">
      <div className="section-head-row">
        <div>
          <div className="section-badge">Simple 3-Step Flow</div>
          <h2 className="section-title">How It Works</h2>
        </div>
        <p className="section-subtitle">
          Designed for maximum learning efficiency with zero friction.
        </p>
      </div>

      <div className="steps-rect-grid">
        {stepsData.map((step) => (
          <div key={step.stepNumber} className="step-rect-card card-3d">
            <div className="step-card-header">
              <span className="step-digit">{step.stepNumber}</span>
              <div className="step-icon-pill">{step.icon}</div>
            </div>
            <h3 className="step-card-title">{step.title}</h3>
            <p className="step-card-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
