import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UNIVERSITY_SUBJECTS } from '../services/academicData';
import { ASSESSMENT_FORMATS, getAssessmentQuestions } from '../services/assessmentData';
import '../styles/AssessmentPages.css';

const hasAnswer = (value) => Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? '').trim());

export default function QuizPage({ quizData, onSubmitAssessment, onBackToDashboard }) {
  const subject = UNIVERSITY_SUBJECTS.find((item) => item.code === quizData?.subjectCode) || UNIVERSITY_SUBJECTS[0];
  const format = ASSESSMENT_FORMATS[quizData?.assessmentType];
  const duration = (quizData?.questionConfiguration?.durationMinutes || quizData?.durationMinutes || format?.durationMinutes || 15) * 60;
  const questions = useMemo(() => getAssessmentQuestions(quizData), [quizData]);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState([]);
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(duration);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAlternatives, setSelectedAlternatives] = useState({});
  const startedAtRef = useRef(Date.now());
  const deadlineRef = useRef(startedAtRef.current + duration * 1000);
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  const reviewRef = useRef(review);
  const selectedAlternativesRef = useRef(selectedAlternatives);
  const timerRef = useRef(null);
  const question = questions[current];
  const activeQuestions = questions.filter((item) => !item.choiceGroup || selectedAlternatives[item.choiceGroup] === item.id);
  const answeredCount = activeQuestions.filter((item) => hasAnswer(answers[item.id])).length;
  const unansweredCount = activeQuestions.length - answeredCount;

  const submit = (expired = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    window.clearInterval(timerRef.current);
    setSubmitted(true);
    setConfirming(false);
    const selections = selectedAlternativesRef.current;
    const includedQuestions = questions.filter((item) => !item.choiceGroup || selections[item.choiceGroup] === item.id);
    const completedAt = Date.now();
    const timeSpentSeconds = Math.min(duration, Math.max(0, Math.floor((completedAt - startedAtRef.current) / 1000)));
    const result = { quiz: quizData, questions: includedQuestions, allQuestions: questions, answers: answersRef.current, review: reviewRef.current, selectedAlternatives: selections, timeSpentSeconds, expired, completedAt: new Date(completedAt).toISOString(), startedAt: new Date(startedAtRef.current).toISOString() };
    onSubmitAssessment?.(result);
  };
  useEffect(() => {
    if (submittedRef.current) return undefined;
    timerRef.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining <= 0) submit(true);
    }, 200);
    return () => window.clearInterval(timerRef.current);
  }, []);

  const changeAnswer = (value) => {
    const next = { ...answersRef.current, [question.id]: value };
    answersRef.current = next;
    setAnswers(next);
  };
  const toggleOption = (option) => {
    if (question.type === 'mcq') changeAnswer(option);
    else { const old = answers[question.id] || []; changeAnswer(old.includes(option) ? old.filter((item) => item !== option) : [...old, option]); }
  };
  const toggleReview = () => {
    const next = reviewRef.current.includes(question.id) ? reviewRef.current.filter((id) => id !== question.id) : [...reviewRef.current, question.id];
    reviewRef.current = next;
    setReview(next);
  };
  const chooseAlternative = (groupId, questionId) => {
    const next = { ...selectedAlternativesRef.current, [groupId]: questionId };
    selectedAlternativesRef.current = next;
    setSelectedAlternatives(next);
  };
  const requiredChoices = [...new Set(questions.filter((item) => item.choiceGroup).map((item) => item.choiceGroup))];
  const missingChoice = requiredChoices.some((groupId) => !selectedAlternatives[groupId]);
  const formatTime = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const isAnswered = (item) => (!item.choiceGroup || selectedAlternatives[item.choiceGroup] === item.id) && hasAnswer(answers[item.id]);

  return <main className="assessment-page">
    <header className="exam-header"><div><span className="section-badge">{quizData?.assessmentType || 'Unit Practice'}</span><h1>{quizData?.title || 'Practice Assessment'}</h1><p>{subject.name} · {subject.code} · {quizData?.unitCoverage || 'Mock questions'}</p></div><div className="exam-header-actions"><div className={`exam-timer ${seconds < 300 ? 'urgent' : ''}`} aria-live="polite">◷ {formatTime}</div><button className="btn btn-primary" onClick={() => setConfirming(true)}>Submit Assessment</button></div></header>
    <div className="exam-progress"><span>Progress</span><div className="progress-track"><span style={{ width: `${(answeredCount / Math.max(1, activeQuestions.length)) * 100}%` }} /></div><strong>{answeredCount}/{activeQuestions.length} answered</strong></div>
    <div className="exam-layout"><section className="question-card"><div className="question-meta"><span>Question {current + 1} of {questions.length}</span><span>{question.section} · Unit {question.unit} · {question.marks == null ? 'Marks configurable' : `${question.marks} marks`}</span></div><h2>{question.prompt}</h2>
      {question.choiceGroup && <button className={`btn ${selectedAlternatives[question.choiceGroup] === question.id ? 'btn-sand' : 'btn-secondary'}`} onClick={() => chooseAlternative(question.choiceGroup, question.id)}>{selectedAlternatives[question.choiceGroup] === question.id ? 'Selected alternative' : 'Choose this alternative'}</button>}
      {question.options ? <div className="answer-options">{question.options.map((option) => { const chosen = Array.isArray(answers[question.id]) ? answers[question.id].includes(option) : answers[question.id] === option; return <button key={option} className={`answer-option ${chosen ? 'selected' : ''}`} onClick={() => toggleOption(option)}><span>{chosen ? '✓' : question.type === 'multi' ? '□' : '○'}</span>{option}</button>; })}</div> : <><textarea className="written-answer" value={answers[question.id] || ''} onChange={(event) => changeAnswer(event.target.value)} placeholder="Write your answer here…" rows={7} />{question.gradingMode === 'manual' && <p className="muted">This written response will be marked as pending manual review after submission.</p>}</>}
      <div className="question-controls"><button className={`btn ${review.includes(question.id) ? 'btn-sand' : 'btn-secondary'}`} onClick={toggleReview}>{review.includes(question.id) ? '★ Marked for Review' : '☆ Mark for Review'}</button><div><button className="btn btn-secondary" disabled={!current} onClick={() => setCurrent((old) => old - 1)}>Previous</button>{current < questions.length - 1 ? <button className="btn btn-primary" onClick={() => setCurrent((old) => old + 1)}>Next</button> : <button className="btn btn-primary" onClick={() => setConfirming(true)}>Review & Submit</button>}</div></div>
    </section><aside className="question-nav-card"><h3>Question Navigator</h3><div className="question-legend"><span><i className="legend-swatch answered" />Answered</span><span><i className="legend-swatch unanswered" />Unanswered</span><span><i className="legend-swatch current" />Current</span><span><i className="legend-swatch review" />Review</span></div><div className="question-grid">{questions.map((item, index) => { const answered = isAnswered(item); return <button key={item.id} className={`question-nav ${index === current ? 'current' : ''} ${answered ? 'answered' : 'unanswered'} ${review.includes(item.id) ? 'review' : ''} ${item.choiceGroup && !selectedAlternatives[item.choiceGroup] ? 'alternative' : ''}`} aria-label={`Question ${index + 1}${answered ? ', answered' : ', unanswered'}${index === current ? ', current' : ''}${review.includes(item.id) ? ', marked for review' : ''}${item.choiceGroup ? selectedAlternatives[item.choiceGroup] === item.id ? ', selected alternative' : ', alternative' : ''}`} onClick={() => setCurrent(index)}>{index + 1}</button>; })}</div><p className="muted">{answeredCount} answered · {unansweredCount} unanswered{requiredChoices.length > 0 && ` · ${requiredChoices.length} alternative choice required`}</p><p className="muted">Assessment settings: {quizData?.sectionConfiguration?.map((section) => `${section.title}: ${section.questionCount ?? 'configurable'} questions, ${section.marks ?? 'marks configurable'}`).join(' · ') || 'Flexible unit practice question count and duration.'}</p></aside></div>
    {confirming && <div className="modal-backdrop" role="presentation"><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="submit-title"><h2 id="submit-title">Submit this assessment?</h2><p>You have answered {answeredCount} of {activeQuestions.length} selected questions. {unansweredCount} remain unanswered. Unanswered questions will be submitted without an answer.{missingChoice && ' Select one Part B alternative before submitting.'}</p><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setConfirming(false)}>Continue Assessment</button><button className="btn btn-primary" disabled={missingChoice} onClick={() => submit(false)}>Confirm Submission</button></div></section></div>}
  </main>;
}
