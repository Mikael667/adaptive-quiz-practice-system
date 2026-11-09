import React, { useMemo, useState } from 'react';
import { UNIVERSITY_SUBJECTS } from '../services/academicData';
import '../styles/AssessmentPages.css';

const normalize = (value) => Array.isArray(value)
  ? value.slice().sort().join('|').toLowerCase()
  : String(value ?? '').trim().toLowerCase();
const hasAnswer = (value) => Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? '').trim());
const isWritten = (question) => question.type === 'short' || question.type === 'long';
const formatDuration = (seconds = 0) => {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return [hours ? `${hours}h` : '', minutes ? `${minutes}m` : '', !hours && !minutes || remainder ? `${remainder}s` : ''].filter(Boolean).join(' ');
};
const displayAnswer = (answer) => Array.isArray(answer) ? answer.join(', ') : String(answer ?? '').trim() || 'No answer submitted';

export default function ResultsPage({ result, onRetake, onNavigate }) {
  const [showReview, setShowReview] = useState(false);
  const questions = result?.questions || [];
  const quiz = result?.quiz || {};
  const subject = UNIVERSITY_SUBJECTS.find((item) => item.code === quiz.subjectCode) || UNIVERSITY_SUBJECTS[0];
  const breakdown = useMemo(() => questions.map((question) => {
    const answer = result?.answers?.[question.id];
    const answered = hasAnswer(answer);
    const manual = question.gradingMode === 'manual' || question.gradingStatus === 'pending' || isWritten(question);
    const hasKey = question.answer !== undefined && question.answer !== null;
    const gradable = !manual && hasKey;
    const correct = answered && gradable && normalize(answer) === normalize(question.answer);
    const pending = answered && !gradable;
    const status = !answered ? 'unanswered' : pending ? 'pending' : correct ? 'correct' : 'incorrect';
    const earnedMarks = !answered ? 0 : pending || question.marks == null ? null : correct ? question.marks : 0;
    return { ...question, answer, answered, correct, pending, status, earnedMarks };
  }), [questions, result]);

  const maximumMarks = quiz.maximumMarks ?? quiz.totalMarks ?? null;
  const marksAwarded = breakdown.reduce((sum, question) => sum + (question.earnedMarks ?? 0), 0);
  const pendingCount = breakdown.filter((question) => question.pending).length;
  const unansweredCount = breakdown.filter((question) => question.status === 'unanswered').length;
  const incorrectCount = breakdown.filter((question) => question.status === 'incorrect').length;
  const correctCount = breakdown.filter((question) => question.status === 'correct').length;
  const configuredQuestionMarks = breakdown.every((question) => Number.isFinite(question.marks));
  const questionMarksTotal = breakdown.reduce((sum, question) => sum + (Number.isFinite(question.marks) ? question.marks : 0), 0);
  const marksComplete = maximumMarks != null && configuredQuestionMarks && Math.abs(questionMarksTotal - maximumMarks) < 0.001;
  const percentageIsAccurate = marksComplete && pendingCount === 0;
  const percentage = percentageIsAccurate ? Math.round((marksAwarded / maximumMarks) * 100) : null;
  const scoreIsFinal = percentageIsAccurate;
  const submittedAt = result?.completedAt ? new Date(result.completedAt) : null;
  const sectionConfig = quiz.sectionConfiguration || [];
  const sections = [...new Set(breakdown.map((question) => question.section).filter(Boolean))].map((name) => {
    const items = breakdown.filter((question) => question.section === name);
    const config = sectionConfig.find((section) => section.title === name || section.id === name.toLowerCase().replaceAll(' ', '-'));
    const sectionMarks = config?.marks;
    const sectionQuestionMarks = items.reduce((sum, question) => sum + (Number.isFinite(question.marks) ? question.marks : 0), 0);
    const hasConfirmedMarks = Number.isFinite(sectionMarks)
      && items.every((question) => Number.isFinite(question.marks))
      && Math.abs(sectionQuestionMarks - sectionMarks) < 0.001
      && items.every((question) => !question.pending);
    const sectionEarned = items.reduce((sum, question) => sum + (question.earnedMarks ?? 0), 0);
    return { name, items, sectionMarks, hasConfirmedMarks, sectionEarned };
  });
  const statusLabels = { correct: 'Correct', incorrect: 'Incorrect', unanswered: 'Unanswered', pending: 'Pending review' };
  const displayMarks = (question) => {
    const possible = Number.isFinite(question.marks) ? `${question.marks} marks available` : 'Marks not configured';
    if (question.status === 'pending') return `Earned marks pending · ${possible}`;
    if (question.earnedMarks == null) return `Earned marks unavailable · ${possible}`;
    return `${question.earnedMarks} / ${Number.isFinite(question.marks) ? question.marks : '—'} marks`;
  };

  return <main className="assessment-page results-page">
    <header className="results-hero">
      <span className="section-badge">Mock assessment results</span>
      <h1>{quiz.title || 'Assessment results'}</h1>
      <p>{quiz.assessmentType || 'Unit Practice'} · {subject.name} · {subject.code}</p>
      <p>{quiz.unitCoverage || 'Unit coverage not specified'}</p>
      <div className="score-display">
        <strong>{marksAwarded}</strong><span>/ {maximumMarks ?? '—'} marks</span>
        <b>{percentageIsAccurate ? `${percentage}%` : 'Percentage unavailable'}</b>
      </div>
      <p>{scoreIsFinal ? 'Final score' : 'Confirmed marks so far'} · {submittedAt ? submittedAt.toLocaleString() : 'Submission time unavailable'} · {formatDuration(result?.timeSpentSeconds)} spent</p>
      {!scoreIsFinal && <p className="muted">A final percentage is unavailable because question marks are not fully configured or one or more answers still need review.</p>}
    </header>

    <div className="result-stats">
      <article><strong>{correctCount}</strong><span>Correct answers</span></article>
      <article><strong>{incorrectCount}</strong><span>Incorrect answers</span></article>
      <article><strong>{unansweredCount}</strong><span>Unanswered questions</span></article>
      <article><strong>{pendingCount}</strong><span>Awaiting manual grading</span></article>
      <article><strong>{marksAwarded}/{maximumMarks ?? '—'}</strong><span>{scoreIsFinal ? 'Final marks' : 'Confirmed marks so far'}</span></article>
    </div>

    {sections.length > 0 && <section className="panel-card section-performance">
      <h2>Section performance</h2>
      <div className="section-performance-list">{sections.map((section) => {
        const counts = section.items.reduce((acc, item) => ({ ...acc, [item.status]: acc[item.status] + 1 }), { correct: 0, incorrect: 0, unanswered: 0, pending: 0 });
        return <article className="section-performance-row" key={section.name}>
          <div><h3>{section.name}</h3><p>{section.items.length} submitted question{section.items.length === 1 ? '' : 's'}</p></div>
          <p>{counts.correct} correct · {counts.incorrect} incorrect · {counts.unanswered} unanswered · {counts.pending} pending</p>
          <strong>{section.hasConfirmedMarks ? `${section.sectionEarned}/${section.sectionMarks} marks · ${Math.round(section.sectionEarned / section.sectionMarks * 100)}%` : 'Section marks not configured'}</strong>
        </article>;
      })}</div>
    </section>}

    <div className="results-columns">
      <section className="panel-card">
        <h2>Assessment review</h2>
        <p>{pendingCount > 0 ? `${pendingCount} response${pendingCount === 1 ? '' : 's'} await manual grading. Pending answers are excluded from the incorrect count.` : 'Review your submitted answers and available explanations.'}</p>
        <p className="muted">Mock assessment data only; this is not an official university result.</p>
      </section>
      <section className="panel-card">
        <h2>Next steps</h2>
        <div className="action-stack">
          <button className="btn btn-primary" onClick={() => setShowReview((value) => !value)}>{showReview ? 'Hide Answer Review' : 'Review Answers'}</button>
          <button className="btn btn-secondary" onClick={onRetake}>Retake Quiz</button>
          <button className="btn btn-secondary" onClick={() => onNavigate?.('library')}>Back to Quiz Library</button>
          <button className="btn btn-secondary" onClick={() => onNavigate?.('analytics')}>View Performance</button>
        </div>
      </section>
    </div>

    {showReview && <section className="panel-card answer-review">
      <h2>Question-by-question review</h2>
      {breakdown.map((question, index) => <article className="review-answer" key={question.id}>
        <div className="question-meta">
          <strong>Question {index + 1}{question.section ? ` · ${question.section}` : ''}{question.unit ? ` · Unit ${question.unit}` : ''}</strong>
          <span className={`result-status status-${question.status}`}>{statusLabels[question.status]}</span>
        </div>
        <h3>{question.prompt}</h3>
        <p><b>Your answer:</b> {displayAnswer(question.answer)}</p>
        {question.answer !== undefined && question.answer !== null && <p><b>Correct answer:</b> {displayAnswer(question.answer)}</p>}
        {question.answer == null && <p className="muted">Correct answer is not available in the mock data.</p>}
        <p><b>Marks:</b> {displayMarks(question)}</p>
        {question.explanation && <p><b>Explanation:</b> {question.explanation}</p>}
        {question.pending && <p className="muted">This response is awaiting manual review and is not treated as incorrect.</p>}
      </article>)}
    </section>}
  </main>;
}
