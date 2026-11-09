import React, { useState, useMemo } from 'react';
import { UNIVERSITY_SUBJECTS, QUIZ_CATALOG } from '../services/academicData';
import QuizCard from '../components/QuizCard';
import '../styles/QuizLibrary.css';

export default function QuizLibraryPage({ onStartQuiz }) {
  // State for Subject & Unit Navigation
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('CSE 2034'); // Default to DAA
  const [selectedUnitId, setSelectedUnitId] = useState(null); // null = All Units

  // State for Assessment Format Tab Filter ('All' | 'Unit Practice' | 'MSE' | 'ETE')
  const [formatFilter, setFormatFilter] = useState('All');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pre-flight Launch Modal State
  const [activeModalQuiz, setActiveModalQuiz] = useState(null);

  // Active Subject details
  const activeSubject = useMemo(() => {
    return (
      UNIVERSITY_SUBJECTS.find((s) => s.code === selectedSubjectCode) ||
      UNIVERSITY_SUBJECTS[0]
    );
  }, [selectedSubjectCode]);

  // Filtered Quiz List
  const filteredQuizzes = useMemo(() => {
    return QUIZ_CATALOG.filter((q) => {
      // 1. Subject Match
      if (selectedSubjectCode && q.subjectCode !== selectedSubjectCode) {
        return false;
      }

      // 2. Unit Match (if a specific unit 1-5 is picked, and quiz is a Unit quiz)
      if (selectedUnitId !== null) {
        // Unit practice quizzes have a specific unitId
        if (q.assessmentType === 'Unit Practice' && q.unitId !== selectedUnitId) {
          return false;
        }
        // MSE covers units 1-3
        if (q.assessmentType === 'MSE' && selectedUnitId > 3) {
          return false;
        }
      }

      // 3. Assessment Format Filter
      if (formatFilter !== 'All' && q.assessmentType !== formatFilter) {
        return false;
      }

      // 4. Difficulty Filter
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) {
        return false;
      }

      // 5. Duration Filter
      if (durationFilter !== 'All') {
        if (durationFilter === 'short' && q.durationMinutes >= 15) return false;
        if (durationFilter === 'medium' && (q.durationMinutes < 15 || q.durationMinutes > 30)) return false;
        if (durationFilter === 'long' && q.durationMinutes <= 30) return false;
      }

      // 6. Status Filter
      if (statusFilter !== 'All' && q.status !== statusFilter) {
        return false;
      }

      // 7. Search Query (matches subject code, title, or unit coverage)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesCoverage = q.unitCoverage.toLowerCase().includes(query);
        const matchesCode = q.subjectCode.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCoverage && !matchesCode) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedSubjectCode,
    selectedUnitId,
    formatFilter,
    difficultyFilter,
    durationFilter,
    statusFilter,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedUnitId(null);
    setFormatFilter('All');
    setDifficultyFilter('All');
    setDurationFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
  };

  const handleSelectQuiz = (quiz) => {
    setActiveModalQuiz(quiz);
  };

  const handleConfirmStart = () => {
    if (activeModalQuiz && onStartQuiz) {
      onStartQuiz(activeModalQuiz);
    }
    setActiveModalQuiz(null);
  };

  return (
    <div className="quiz-library-container">
      {/* 1. Header Banner */}
      <div className="library-header-card">
        <div className="library-header-text">
          <div className="section-badge">Academic Curriculum</div>
          <h1>University Quiz & Examination Library</h1>
          <p>
            Explore semester courses, practice specific units, or attempt official Mid-Semester (MSE - 30 Marks)
            and End-Term (ETE - 60 Marks) mock assessments.
          </p>
        </div>

        <div className="library-stat-pill-group">
          <div className="library-counter-pill">
            <span className="counter-num">{UNIVERSITY_SUBJECTS.length}</span>
            <span className="counter-lbl">Courses</span>
          </div>
          <div className="library-counter-pill">
            <span className="counter-num">5</span>
            <span className="counter-lbl">Units / Course</span>
          </div>
          <div className="library-counter-pill">
            <span className="counter-num">MSE & ETE</span>
            <span className="counter-lbl">Mock Formats</span>
          </div>
        </div>
      </div>

      {/* 2. Assessment Format Selector (All, Unit Practice, MSE, ETE) */}
      <div className="assessment-format-selector">
        <div
          className={`format-tab-card ${formatFilter === 'All' ? 'active' : ''}`}
          onClick={() => setFormatFilter('All')}
        >
          <div className="format-tab-header">
            <span className="format-title">All Assessment Modes</span>
            <span className="format-badge-tag unit">All</span>
          </div>
          <span className="format-desc">Complete catalog of unit drills and official exams</span>
        </div>

        <div
          className={`format-tab-card ${formatFilter === 'Unit Practice' ? 'active' : ''}`}
          onClick={() => setFormatFilter('Unit Practice')}
        >
          <div className="format-tab-header">
            <span className="format-title">Unit Practice</span>
            <span className="format-badge-tag unit">Units 1 – 5</span>
          </div>
          <span className="format-desc">Targeted drills per unit (10–15 Questions, flexible score)</span>
        </div>

        <div
          className={`format-tab-card ${formatFilter === 'MSE' ? 'active' : ''}`}
          onClick={() => setFormatFilter('MSE')}
        >
          <div className="format-tab-header">
            <span className="format-title">MSE Mock Exam</span>
            <span className="format-badge-tag mse">Units 1 – 3</span>
          </div>
          <div className="format-marks-indicator">30 Marks • 90 Mins</div>
          <span className="format-desc">Official Mid-Semester Examination mock format</span>
        </div>

        <div
          className={`format-tab-card ${formatFilter === 'ETE' ? 'active' : ''}`}
          onClick={() => setFormatFilter('ETE')}
        >
          <div className="format-tab-header">
            <span className="format-title">ETE Mock Exam</span>
            <span className="format-badge-tag ete">All 5 Units</span>
          </div>
          <div className="format-marks-indicator">60 Marks • 180 Mins</div>
          <span className="format-desc">Official End-Term Comprehensive Examination</span>
        </div>
      </div>

      {/* 3. Subject Selector Carousel & Active Subject Header */}
      <div className="subject-selector-card">
        <div className="subject-selector-head">
          <span className="subject-label-small">Select Official Subject ({UNIVERSITY_SUBJECTS.length} Courses)</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Course Code + Title
          </span>
        </div>

        <div className="subject-pills-scroll">
          {UNIVERSITY_SUBJECTS.map((sub) => {
            const isSelected = selectedSubjectCode === sub.code;
            return (
              <button
                key={sub.code}
                type="button"
                className={`subject-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSubjectCode(sub.code);
                  setSelectedUnitId(null); // Reset unit filter when switching subject
                }}
              >
                <span className="subject-code-tag">{sub.code}</span>
                <span>{sub.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Subject Details Banner */}
        <div className="active-subject-banner">
          <div className="subject-banner-info">
            <h2>
              <span>{activeSubject.name}</span>
              <span className="subject-code-pill">{activeSubject.code}</span>
            </h2>
            <p className="subject-banner-desc">{activeSubject.description}</p>
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <strong>{activeSubject.credits} Credits</strong> • {activeSubject.type} Course
          </div>
        </div>

        {/* 4. Unit Selector (1 to 5) */}
        <div className="unit-nav-bar">
          <span className="unit-nav-label">Select Unit:</span>
          <button
            type="button"
            className={`unit-tab-btn ${selectedUnitId === null ? 'active' : ''}`}
            onClick={() => setSelectedUnitId(null)}
          >
            All Units (1 – 5)
          </button>

          {activeSubject.units.map((unit) => (
            <button
              key={unit.id}
              type="button"
              className={`unit-tab-btn ${selectedUnitId === unit.id ? 'active' : ''}`}
              onClick={() => setSelectedUnitId(unit.id)}
              title={unit.description}
            >
              Unit {unit.id}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Filter Controls & Search Bar */}
      <div className="library-filter-panel">
        {/* Search */}
        <div className="filter-search-box">
          <svg
            className="filter-search-icon"
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
            className="filter-search-input"
            placeholder="Search by topic, unit, or exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Difficulty Filter */}
        <select
          className="filter-select"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          aria-label="Filter by Difficulty"
        >
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* Duration Filter */}
        <select
          className="filter-select"
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          aria-label="Filter by Duration"
        >
          <option value="All">All Durations</option>
          <option value="short">&lt; 15 mins</option>
          <option value="medium">15 – 30 mins</option>
          <option value="long">&gt; 30 mins (Exams)</option>
        </select>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="All">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* 6. Active Filter Indicators */}
      <div className="filter-status-row">
        <span className="results-count-text">
          Showing <strong>{filteredQuizzes.length}</strong> quizzes & assessments for{' '}
          <strong>{activeSubject.code}</strong>
          {selectedUnitId ? ` (Unit ${selectedUnitId})` : ''}
          {formatFilter !== 'All' ? ` • [${formatFilter}]` : ''}
        </span>

        {(selectedUnitId !== null ||
          formatFilter !== 'All' ||
          difficultyFilter !== 'All' ||
          durationFilter !== 'All' ||
          statusFilter !== 'All' ||
          searchQuery !== '') && (
          <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
            Reset all filters
          </button>
        )}
      </div>

      {/* 7. Quizzes Cards Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="quiz-cards-grid">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onSelectQuiz={handleSelectQuiz} />
          ))}
        </div>
      ) : (
        <div className="library-empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No Quizzes Match Your Filter Criteria</h3>
          <p className="empty-state-desc">
            Try adjusting your search terms, selecting "All Units", or changing the assessment format filter.
          </p>
          <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* 8. Pre-Flight Assessment Modal */}
      {activeModalQuiz && (
        <div className="modal-overlay" onClick={() => setActiveModalQuiz(null)}>
          <div className="preflight-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className={`format-badge-tag ${activeModalQuiz.assessmentType.toLowerCase()}`}>
                  {activeModalQuiz.assessmentType} Format
                </span>
                <h3 className="modal-title" style={{ marginTop: '6px' }}>
                  {activeModalQuiz.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModalQuiz(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-spec-grid">
              <div className="modal-spec-cell">
                <span className="modal-spec-lbl">Course Code</span>
                <span className="modal-spec-val">{activeModalQuiz.subjectCode}</span>
              </div>
              <div className="modal-spec-cell">
                <span className="modal-spec-lbl">Syllabus Scope</span>
                <span className="modal-spec-val">{activeModalQuiz.unitCoverage}</span>
              </div>
              <div className="modal-spec-cell">
                <span className="modal-spec-lbl">Total Marks</span>
                <span className="modal-spec-val" style={{ color: 'var(--color-brown)' }}>
                  {activeModalQuiz.totalMarks ? `${activeModalQuiz.totalMarks} Marks` : 'Ungraded'}
                </span>
              </div>
              <div className="modal-spec-cell">
                <span className="modal-spec-lbl">Duration</span>
                <span className="modal-spec-val">{activeModalQuiz.durationMinutes} Minutes</span>
              </div>
            </div>

            <div className="modal-instructions">
              <p>
                <strong>Assessment Notice:</strong>{' '}
                {activeModalQuiz.assessmentType === 'MSE'
                  ? 'Official Mid-Semester pattern. Maximum marks: 30. Covers Units 1–2.5 (configurable up to Unit 3).'
                  : activeModalQuiz.assessmentType === 'ETE'
                  ? 'Official End-Term comprehensive pattern. Maximum marks: 60. Covers all 5 units. Question counts and mark distribution remain configurable.'
                  : 'Focused unit drill. You may practice questions freely with instant pedagogical feedback.'}
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveModalQuiz(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmStart}
              >
                <span>Begin Assessment</span>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
