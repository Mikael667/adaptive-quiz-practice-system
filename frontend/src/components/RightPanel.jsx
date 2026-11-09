import React from 'react';
import '../styles/RightPanel.css';

export default function RightPanel() {
  const daysOfWeek = [
    { label: 'M', day: '4', active: true },
    { label: 'T', day: '5', active: true },
    { label: 'W', day: '6', active: true },
    { label: 'T', day: '7', active: true },
    { label: 'F', day: '8', active: true, today: true },
    { label: 'S', day: '9', active: false },
    { label: 'S', day: '10', active: false },
  ];

  const masteryTopics = [
    { name: 'Data Structures', level: 78, tier: 'Advanced' },
    { name: 'Java Core & OOP', level: 92, tier: 'Mastered' },
    { name: 'Database & MySQL', level: 64, tier: 'Proficient' },
  ];

  return (
    <aside className="app-right-panel">
      {/* 1. Weekly Activity & Calendar Streak */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">
            <span>📅 Activity & Streak</span>
          </h3>
          <span className="panel-action-link">5 Days 🔥</span>
        </div>

        <div className="weekly-calendar-grid">
          {daysOfWeek.map((d, idx) => (
            <div key={idx} className="calendar-day-col">
              <span className="cal-day-label">{d.label}</span>
              <div
                className={`cal-day-box ${d.active ? 'active' : ''} ${d.today ? 'today' : ''}`}
                title={`Day ${d.day}: ${d.active ? 'Practice completed' : 'Scheduled'}`}
              >
                {d.day}
              </div>
            </div>
          ))}
        </div>

        <p className="streak-summary-text">
          <span>⚡ <strong>42 questions</strong> solved this week</span>
        </p>
      </div>

      {/* 2. Topic Proficiency / Mastery Widget */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">
            <span>🎯 Skill Mastery</span>
          </h3>
          <a href="#analytics" className="panel-action-link">
            Details
          </a>
        </div>

        <div className="mastery-list">
          {masteryTopics.map((topic, idx) => (
            <div key={idx} className="mastery-item">
              <div className="mastery-meta">
                <span className="mastery-name">{topic.name}</span>
                <span className="mastery-percentage">{topic.level}%</span>
              </div>
              <div className="mastery-track">
                <div
                  className="mastery-bar"
                  style={{ width: `${topic.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recommended Next Quiz Session */}
      <div className="panel-card" style={{ borderLeft: '3px solid var(--color-brown)' }}>
        <div className="panel-card-header">
          <h3 className="panel-card-title">
            <span>💡 Recommended</span>
          </h3>
          <span className="next-quiz-badge">Adaptive</span>
        </div>

        <div className="next-quiz-preview">
          <h4 className="next-quiz-title">Binary Trees & Graph Traversals</h4>
          <div className="next-quiz-meta">
            <span>⏱️ 10 min</span>
            <span>•</span>
            <span>8 Questions</span>
            <span>•</span>
            <span>Med-Hard</span>
          </div>

          <button
            className="btn btn-primary btn-start-session"
            onClick={() => alert('Launching adaptive quiz session: Binary Trees')}
          >
            Start Practice
          </button>
        </div>
      </div>
    </aside>
  );
}
