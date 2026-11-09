import { UNIVERSITY_SUBJECTS } from './academicData';

// Subject-specific source questions currently available for Algorithms.
// Written prompts use the same manual-review status as future authored items.
const SOURCE_QUESTIONS = [
  { id: 'daa-q1', subjectCode: 'CSE 2034', unit: 1, type: 'mcq', marks: 4, section: 'Part A', prompt: 'Which notation describes an asymptotic upper bound?', options: ['Big O', 'Big Omega', 'Big Theta', 'Little omega'], answer: 'Big O', explanation: 'Big O bounds growth from above.' },
  { id: 'daa-q2', subjectCode: 'CSE 2034', unit: 1, type: 'multi', marks: 4, section: 'Part A', prompt: 'Select all properties of a balanced binary search tree.', options: ['Search is O(log n)', 'Inorder traversal is sorted', 'Every node has exactly two children', 'Height is O(log n)'], answer: ['Search is O(log n)', 'Inorder traversal is sorted', 'Height is O(log n)'], explanation: 'Balance bounds height logarithmically; inorder traversal follows key order.' },
  { id: 'daa-q3', subjectCode: 'CSE 2034', unit: 2, type: 'short', marks: 4, section: 'Part A', prompt: 'State the worst-case time complexity of Merge Sort.', answer: 'O(n log n)', explanation: 'Merge Sort processes n items at each of logarithmically many levels.' },
  { id: 'daa-q4', subjectCode: 'CSE 2034', unit: 2, type: 'long', marks: 10, section: 'Part B', prompt: 'Describe the divide and conquer strategy and illustrate it with one algorithm.', answer: 'A method that divides a problem into subproblems, solves them recursively, and combines their results.', explanation: 'An acceptable answer identifies divide, conquer, and combine.' },
  { id: 'daa-q5', subjectCode: 'CSE 2034', unit: 3, type: 'long', marks: 10, section: 'Part B', prompt: 'Explain how dynamic programming solves overlapping subproblems.', answer: 'Store subproblem results using memoization or tabulation to avoid repeated work.', explanation: 'Mentioning optimal substructure and reuse earns full credit.' },
  { id: 'daa-q6', subjectCode: 'CSE 2034', unit: 4, type: 'long', marks: 16, section: 'Part C', prompt: 'Compare Dijkstra’s and Bellman-Ford algorithms, including their limitations.', answer: 'Dijkstra requires nonnegative edges; Bellman-Ford supports negative edges and detects negative cycles.', explanation: 'Compare edge constraints, approach, and complexity.' },
];

export const ASSESSMENT_FORMATS = {
  MSE: {
    assessmentType: 'MSE', durationMinutes: 90, maximumMarks: 30,
    coverage: { defaultUnitCount: 3, configurableUnitCounts: [2.5, 3] },
    sections: [
      { id: 'part-a', title: 'Part A', questionCount: 5, marks: null },
      { id: 'part-b', title: 'Part B', questionCount: 2, marks: null, choice: { groupId: 'part-b-choice', selectCount: 1, rule: null } },
    ],
  },
  ETE: {
    assessmentType: 'ETE', durationMinutes: 180, maximumMarks: 60,
    coverage: { defaultUnitCount: 5 },
    sections: [
      { id: 'part-a', title: 'Part A', questionCount: null, marks: null },
      { id: 'part-b', title: 'Part B', questionCount: null, marks: null },
      { id: 'part-c', title: 'Part C', questionCount: null, marks: null },
    ],
  },
};

const getUnitTitle = (subjectCode, unitId) => {
  const subject = UNIVERSITY_SUBJECTS.find((item) => item.code === subjectCode);
  return subject?.units.find((unit) => unit.id === unitId)?.title || `Unit ${unitId}`;
};

const getSubjectUnitQuestions = (subjectCode, unitId, count, section = 'Practice') => {
  const authored = SOURCE_QUESTIONS.filter((question) => question.subjectCode === subjectCode && question.unit === unitId);
  const base = authored.length ? authored : [{
    id: `${subjectCode.replace(/\W/g, '').toLowerCase()}-unit-${unitId}-mock`, subjectCode, unit: unitId,
    type: 'short', marks: null, prompt: `Describe a key concept from ${getUnitTitle(subjectCode, unitId)}.`,
    answer: null, explanation: null,
  }];
  return Array.from({ length: Math.max(0, count) }, (_, index) => {
    const source = base[index % base.length];
    return {
      ...source,
      id: `${source.id}-${index + 1}`,
      section,
      gradingMode: source.type === 'mcq' || source.type === 'multi' ? 'automatic' : 'manual',
      gradingStatus: source.type === 'mcq' || source.type === 'multi' ? 'automatic' : 'pending',
    };
  });
};

export function getAssessmentQuestions(quiz) {
  if (!quiz) return [];
  const subjectCode = quiz.subjectCode;
  if (quiz.assessmentType === 'Unit Practice') {
    const configuredCount = quiz.questionConfiguration?.count ?? quiz.questionCount ?? 1;
    return getSubjectUnitQuestions(subjectCode, quiz.unitId || 1, configuredCount);
  }
  if (quiz.assessmentType === 'MSE') {
    const unitCount = quiz.coverageConfiguration?.unitCount ?? ASSESSMENT_FORMATS.MSE.coverage.defaultUnitCount;
    const partAUnits = [1, 1, 2, 2, unitCount === 2.5 ? 2 : 3];
    const partA = partAUnits.flatMap((unit, index) => getSubjectUnitQuestions(subjectCode, unit, 1, 'Part A').map((question) => ({ ...question, id: `mse-a-${index + 1}`, marks: null })));
    const alternatives = [Math.min(2, Math.ceil(unitCount)), Math.min(3, Math.ceil(unitCount))];
    const partB = alternatives.map((unit, index) => getSubjectUnitQuestions(subjectCode, unit, 1, 'Part B').map((question) => ({
      ...question[0], id: `mse-b-${index + 1}`, marks: null,
      choiceGroup: 'part-b-choice', choiceRequired: true,
    }))[0]);
    return [...partA, ...partB];
  }
  if (quiz.assessmentType === 'ETE') {
    const source = SOURCE_QUESTIONS.filter((question) => question.subjectCode === subjectCode && question.unit <= 5);
    if (source.length) return source.map((question) => ({ ...question, gradingMode: question.type === 'mcq' || question.type === 'multi' ? 'automatic' : 'manual', gradingStatus: question.type === 'mcq' || question.type === 'multi' ? 'automatic' : 'pending' }));
    return [1, 2, 3, 4, 5].map((unit, index) => ({
      ...getSubjectUnitQuestions(subjectCode, unit, 1, ['Part A', 'Part A', 'Part B', 'Part B', 'Part C'][index])[0],
      id: `ete-${unit}`, marks: null,
    }));
  }
  return [];
}

export const MOCK_QUESTIONS = SOURCE_QUESTIONS.map((question) => ({
  ...question,
  gradingMode: question.type === 'mcq' || question.type === 'multi' ? 'automatic' : 'manual',
  gradingStatus: question.type === 'mcq' || question.type === 'multi' ? 'automatic' : 'pending',
}));
