import React from 'react';

export default function QuizCard({ quiz, onSelectQuiz }) {
  const isMSE = quiz.assessmentType === 'MSE';
  const isETE = quiz.assessmentType === 'ETE';

  const getCardModifierClass = () => {
    if (isMSE) return 'is-mse';
    if (isETE) return 'is-ete';
    return '';
  };

  const getAssessmentBadgeClass = () => {
    if (isMSE) return 'mse';
    if (isETE) return 'ete';
    return 'unit';
  };

  const getStatusLabel = () => {
    if (quiz.status === 'Completed') {
      return (
        <span className="status-badge Completed">
          <span>✓</span>
          <span>Score: {quiz.lastScore}/{quiz.totalMarks} ({Math.round((quiz.lastScore / quiz.totalMarks) * 100)}%)</span>
        </span>
      );
    }
    if (quiz.status === 'In Progress') {
      return (
        <span className="status-badge In-Progress">
          <span>⏳</span>
          <span>In Progress</span>
        </span>
      );
    }
    return (
      <span className="status-badge Not-Started">
        <span>○</span>
        <span>Not Started</span>
      </span>
    );
  };

  const getActionBtnText = () => {
    if (quiz.status === 'Completed') return 'Retake';
    if (quiz.status === 'In Progress') return 'Resume';
    if (isMSE) return 'Start MSE (30M)';
    if (isETE) return 'Start ETE (60M)';
    return 'Start Quiz';
  };

  return (
    <div className={`quiz-rect-card card-3d ${getCardModifierClass()}`}>
      <div>
        {/* Card Header */}
        <div className="quiz-card-head">
          <div className="quiz-badge-wrap">
            <span className={`assessment-pill ${getAssessmentBadgeClass()}`}>
              {quiz.assessmentType}
            </span>
            <span className="quiz-subject-tag">{quiz.subjectCode}</span>
          </div>

          <span className={`quiz-difficulty-tag diff-${quiz.difficulty}`}>
            {quiz.difficulty}
          </span>
        </div>

        {/* Card Body */}
        <div className="quiz-card-body" style={{ marginTop: '10px' }}>
          <span className="quiz-unit-coverage-tag">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{quiz.unitCoverage}</span>
          </span>

          <h3 className="quiz-card-title">{quiz.title}</h3>

          <div className="quiz-meta-specs">
            <span className="quiz-spec-item">
              <span>📝</span>
              <span>{quiz.questionCount} Questions</span>
            </span>
            <span className="quiz-spec-item">
              <span>⏱️</span>
              <span>{quiz.durationMinutes} mins</span>
            </span>
            {quiz.totalMarks && (
              <span className="quiz-spec-item quiz-marks-highlight">
                <span>🎯</span>
                <span>{quiz.totalMarks} Marks</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="quiz-card-footer">
        {getStatusLabel()}

        <button
          type="button"
          className={`btn ${isETE ? 'btn-primary' : isMSE ? 'btn-sand' : 'btn-secondary'} btn-card-action`}
          onClick={() => onSelectQuiz(quiz)}
        >
          <span>{getActionBtnText()}</span>
        </button>
      </div>
    </div>
  );
}
