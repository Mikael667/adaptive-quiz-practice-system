import React, { useMemo, useState } from 'react';
import { QUIZ_CATALOG, UNIVERSITY_SUBJECTS } from '../services/academicData';
import '../styles/AnalyticsPage.css';

const hasAnswer = (answer) => Array.isArray(answer) ? answer.length > 0 : Boolean(String(answer ?? '').trim());
const normalize = (answer) => Array.isArray(answer) ? answer.slice().sort().join('|').toLowerCase() : String(answer ?? '').trim().toLowerCase();
const isManual = (question) => question.gradingMode === 'manual' || question.gradingStatus === 'pending' || question.type === 'short' || question.type === 'long';
const getQuestionState = (question, answers = {}) => {
  const answer = answers[question.id];
  if (!hasAnswer(answer)) return 'unanswered';
  if (isManual(question) || question.answer == null) return 'pending';
  return normalize(answer) === normalize(question.answer) ? 'correct' : 'incorrect';
};
const getValidScore = (result) => {
  const questions = result?.questions || [];
  const maximum = result?.quiz?.maximumMarks ?? result?.quiz?.totalMarks;
  if (!questions.length || !Number.isFinite(maximum) || maximum <= 0) return null;
  if (questions.some((question) => !Number.isFinite(question.marks))) return null;
  const allocated = questions.reduce((sum, question) => sum + question.marks, 0);
  if (Math.abs(allocated - maximum) >= 0.001) return null;
  if (questions.some((question) => getQuestionState(question, result.answers) === 'pending')) return null;
  const earned = questions.reduce((sum, question) => sum + (getQuestionState(question, result.answers) === 'correct' ? question.marks : 0), 0);
  return { earned, maximum, percentage: Math.round((earned / maximum) * 100) };
};
const formatDuration = (seconds) => {
  const total = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return [h ? `${h}h` : '', m ? `${m}m` : !h ? `${total % 60}s` : ''].filter(Boolean).join(' ');
};
const getUnit = (subject, unitId) => subject?.units.find((unit) => unit.id === unitId);
const getResultUnits = (result, subjectCode, unitId) => (result.questions || []).filter((question) => question.subjectCode === subjectCode && (unitId == null || question.unit === unitId));
const inPeriod = (result, period, now = new Date()) => {
  if (period === 'All time') return true;
  const time = Date.parse(result.completedAt || '');
  if (!Number.isFinite(time)) return false;
  const date = new Date(time);
  if (date > now) return false;
  if (period === 'This month') return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return date >= sixMonthsAgo;
};

function ScoreTrend({ results }) {
  const points = results.map((result) => ({ result, score: getValidScore(result) })).filter((item) => item.score).sort((a, b) => Date.parse(a.result.completedAt) - Date.parse(b.result.completedAt));
  if (!points.length) return <p className="analytics-empty">No fully graded assessments match these filters yet. Complete assessments with configured marks to build a score trend.</p>;
  const width = 700;
  const height = 210;
  const pad = { top: 20, right: 24, bottom: 34, left: 34 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const coordinates = points.map(({ score }, index) => ({
    x: pad.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth),
    y: pad.top + (1 - score.percentage / 100) * innerHeight,
  }));
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(' ');
  return <div className="analytics-trend-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graded assessment scores over time, from zero to one hundred percent">
    {[0, 25, 50, 75, 100].map((value) => { const y = pad.top + (1 - value / 100) * innerHeight; return <g key={value}><line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="chart-grid-line" /><text x={pad.left - 7} y={y + 4} textAnchor="end" className="chart-axis-label">{value}%</text></g>; })}
    {coordinates.length > 1 && <polyline points={line} className="chart-score-line" />}
    {coordinates.map((point, index) => <g key={`${points[index].result.completedAt}-${index}`}><circle cx={point.x} cy={point.y} r="5" className="chart-score-point"><title>{`${points[index].score.percentage}% · ${points[index].result.quiz.title || points[index].result.quiz.assessmentType} · ${new Date(points[index].result.completedAt).toLocaleDateString()}`}</title></circle><text x={point.x} y={height - 10} textAnchor="middle" className="chart-axis-label">{new Date(points[index].result.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</text></g>)}
  </svg></div>;
}

export default function AnalyticsPage({ onLaunchRecommendedQuiz, assessmentResults = [] }) {
  const [selectedCourseCode, setSelectedCourseCode] = useState('CSE 2034');
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [assessmentType, setAssessmentType] = useState('All');
  const [period, setPeriod] = useState('All time');
  const unitSubjectCode = selectedCourseCode === 'All' ? 'CSE 2034' : selectedCourseCode;
  const selectedSubject = UNIVERSITY_SUBJECTS.find((subject) => subject.code === unitSubjectCode) || UNIVERSITY_SUBJECTS[0];
  const periodResults = useMemo(() => assessmentResults.filter((result) => inPeriod(result, period)), [assessmentResults, period]);
  const chartResults = periodResults.filter((result) => (selectedCourseCode === 'All' || result.quiz.subjectCode === selectedCourseCode)
    && (assessmentType === 'All' || result.quiz.assessmentType === assessmentType)
    && (selectedUnit === 'All' || (result.questions || []).some((question) => question.unit === Number(selectedUnit.replace('Unit ', '')))));
  const summaryResults = periodResults.filter((result) => (selectedCourseCode === 'All' || result.quiz.subjectCode === selectedCourseCode)
    && (assessmentType === 'All' || result.quiz.assessmentType === assessmentType)
    && (selectedUnit === 'All' || (result.questions || []).some((question) => question.unit === Number(selectedUnit.replace('Unit ', '')))));
  const completedQuizzes = summaryResults.filter((result) => result.quiz.assessmentType === 'Unit Practice').length;
  const totalAttempts = summaryResults.length;
  const totalStudySeconds = summaryResults.reduce((sum, result) => sum + (result.timeSpentSeconds || 0), 0);
  const pendingGrading = summaryResults.reduce((sum, result) => sum + (result.questions || []).filter((question) => getQuestionState(question, result.answers) === 'pending').length, 0);
  const validScores = summaryResults.map(getValidScore).filter(Boolean);
  const averageScore = validScores.length ? Math.round(validScores.reduce((sum, score) => sum + score.percentage, 0) / validScores.length) : null;
  const subjectResults = periodResults.filter((result) => assessmentType === 'All' || result.quiz.assessmentType === assessmentType);

  const unitStats = selectedSubject.units
    .filter((unit) => selectedUnit === 'All' || selectedUnit === `Unit ${unit.id}`)
    .map((unit) => {
      const responses = subjectResults.flatMap((result) => getResultUnits(result, selectedSubject.code, unit.id).map((question) => ({ question, result })));
      const graded = responses.filter(({ question, result }) => {
        const state = getQuestionState(question, result.answers);
        return Number.isFinite(question.marks) && (state === 'correct' || state === 'incorrect' || state === 'unanswered');
      });
      const maximum = graded.reduce((sum, item) => sum + item.question.marks, 0);
      const earned = graded.reduce((sum, item) => sum + (getQuestionState(item.question, item.result.answers) === 'correct' ? item.question.marks : 0), 0);
      const attemptCount = new Set(graded.map((item) => item.result.completedAt)).size;
      return { ...unit, gradedCount: graded.length, attemptCount, percentage: maximum ? Math.round(earned / maximum * 100) : null };
    });
  const recommendations = unitStats.filter((unit) => unit.percentage != null && unit.percentage < 60 && unit.gradedCount >= 3 && unit.attemptCount >= 2);
  const bestUnit = unitStats.filter((unit) => unit.percentage != null && unit.gradedCount >= 3 && unit.attemptCount >= 2).sort((a, b) => b.percentage - a.percentage)[0];
  const recommendedUnit = recommendations[0];
  const recommendedQuiz = recommendedUnit && QUIZ_CATALOG.find((quiz) => quiz.subjectCode === selectedSubject.code && quiz.unitId === recommendedUnit.id && quiz.assessmentType === 'Unit Practice');
  const subjectMetrics = UNIVERSITY_SUBJECTS.map((subject) => {
    const attempts = subjectResults.filter((result) => result.quiz.subjectCode === subject.code);
    const scores = attempts.map(getValidScore).filter(Boolean);
    return { subject, attempts: attempts.length, average: scores.length ? Math.round(scores.reduce((sum, score) => sum + score.percentage, 0) / scores.length) : null };
  });

  return <div className="analytics-container">
    <div className="analytics-header-card"><div className="analytics-header-text"><div className="section-badge">Academic Performance</div><h1>Analytics & Recommendations</h1><p>Review submitted mock assessments and graded answers. Analytics include only results available in this browser.</p></div><span className="section-badge" style={{ margin: 0 }}>Mock assessment history</span></div>

    <div className="analytics-filters" aria-label="Analytics filters">
      <label>Subject<select value={selectedCourseCode} onChange={(event) => setSelectedCourseCode(event.target.value)}><option value="All">All subjects</option>{UNIVERSITY_SUBJECTS.map((subject) => <option key={subject.code} value={subject.code}>{subject.code}</option>)}</select></label>
      <label>Unit<select value={selectedUnit} onChange={(event) => setSelectedUnit(event.target.value)}><option>All</option>{[1, 2, 3, 4, 5].map((unit) => <option key={unit}>Unit {unit}</option>)}</select></label>
      <label>Assessment<select value={assessmentType} onChange={(event) => setAssessmentType(event.target.value)}>{['All', 'Unit Practice', 'MSE', 'ETE'].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Period<select value={period} onChange={(event) => setPeriod(event.target.value)}>{['This month', 'Last 6 months', 'All time'].map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>

    <div className="analytics-summary-grid">
      <div className="metric-summary-card"><div className="metric-summary-head"><span>Quizzes completed</span><span>✓</span></div><div className="metric-summary-val">{completedQuizzes}</div><div className="metric-summary-sub"><span>Submitted unit practices</span></div></div>
      <div className="metric-summary-card"><div className="metric-summary-head"><span>Overall average score</span><span>%</span></div><div className="metric-summary-val">{averageScore == null ? '—' : `${averageScore}%`}</div><div className="metric-summary-sub"><span>{averageScore == null ? 'No fully graded scores yet' : `${validScores.length} fully graded assessment${validScores.length === 1 ? '' : 's'}`}</span></div></div>
      <div className="metric-summary-card"><div className="metric-summary-head"><span>Total study time</span><span>◷</span></div><div className="metric-summary-val">{formatDuration(totalStudySeconds)}</div><div className="metric-summary-sub"><span>Recorded attempt time</span></div></div>
      <div className="metric-summary-card"><div className="metric-summary-head"><span>Assessments attempted</span><span>▤</span></div><div className="metric-summary-val">{totalAttempts}</div><div className="metric-summary-sub"><span>Submitted assessments</span></div></div>
      <div className="metric-summary-card"><div className="metric-summary-head"><span>Pending manual grading</span><span>…</span></div><div className="metric-summary-val">{pendingGrading}</div><div className="metric-summary-sub"><span>Excluded from graded averages</span></div></div>
    </div>

    <section className="analytics-panel-card"><div className="analytics-panel-head"><h2 className="analytics-panel-title">Performance over time</h2><span className="section-badge" style={{ margin: 0 }}>Fully graded results only</span></div><ScoreTrend results={chartResults} /></section>

    <div className="analytics-detailed-grid">
      <section className="analytics-panel-card"><div className="analytics-panel-head"><h2 className="analytics-panel-title">Unit-level analysis</h2><select className="course-select-dropdown" value={selectedCourseCode === 'All' ? 'CSE 2034' : selectedCourseCode} onChange={(event) => setSelectedCourseCode(event.target.value)} aria-label="Subject for unit analysis">{UNIVERSITY_SUBJECTS.map((subject) => <option key={subject.code} value={subject.code}>{subject.code} — {subject.shortName}</option>)}</select></div>
        <p>Unit scores use confirmed marks from automatically graded questions only. Units need at least three graded answers across two assessments before being described as stronger or needing revision.</p>
        <div className="unit-mastery-list">{unitStats.length ? unitStats.map((unit) => { const enoughData = unit.gradedCount >= 3 && unit.attemptCount >= 2; const label = !enoughData ? 'Early data' : unit.percentage < 60 ? 'Consider revision' : unit.percentage >= 80 ? 'Stronger area' : 'Developing'; return <article className="unit-mastery-row" key={unit.id}><div className="unit-row-meta"><span className="unit-title-text">Unit {unit.id}: {unit.title}</span><span className={`unit-tag-pill ${!enoughData ? 'status-steady' : unit.percentage < 60 ? 'status-needs-practice' : 'status-mastered'}`}>{label}</span></div>{unit.percentage == null ? <p className="analytics-empty-inline">No confirmed graded marks for this unit yet.</p> : <><div className="unit-row-meta"><span>{unit.percentage}% of available graded marks</span><span>{unit.gradedCount} answers · {unit.attemptCount} attempts</span></div><div className="unit-progress-track"><div className="unit-progress-fill" style={{ width: `${unit.percentage}%` }} /></div></>}</article>; }) : <p className="analytics-empty">No units match this filter.</p>}</div>
      </section>

      <div className="analytics-side-stack">
        <section className="analytics-panel-card"><h2 className="analytics-panel-title">Study recommendations</h2>{recommendedUnit ? <div className="recommendation-copy"><p>Consider revising <strong>Unit {recommendedUnit.id}: {recommendedUnit.title}</strong> in {selectedSubject.shortName}. Confirmed graded answers average {recommendedUnit.percentage}% across {recommendedUnit.attemptCount} attempts.</p>{recommendedQuiz && <button type="button" className="btn btn-sand" onClick={() => onLaunchRecommendedQuiz?.(recommendedQuiz)}>Start unit practice</button>}</div> : bestUnit ? <p>Graded results show relatively strong performance in Unit {bestUnit.id} ({bestUnit.percentage}%). Keep practising other units as more confirmed results become available.</p> : <p className="analytics-empty">There is not enough confirmed graded data to recommend a unit yet. Complete automatically graded practice assessments; pending written answers are excluded.</p>}{pendingGrading > 0 && <p className="muted">{pendingGrading} answers are awaiting manual grading and do not affect these recommendations.</p>}</section>
        <section className="analytics-panel-card"><div className="analytics-panel-head"><h2 className="analytics-panel-title">Subject performance</h2><span className="muted">{period}</span></div><div className="all-subjects-table">{subjectMetrics.map(({ subject, attempts, average }) => <div key={subject.code} className="subject-table-row"><span className="sub-table-code">{subject.code}</span><span className="sub-table-name">{subject.shortName} · {attempts} assessment{attempts === 1 ? '' : 's'}</span><span className="sub-table-pct">{average == null ? attempts.length ? 'Pending marks' : 'No results' : `${average}% avg`}</span></div>)}</div></section>
      </div>
    </div>
  </div>;
}
