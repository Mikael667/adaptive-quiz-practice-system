# Project Contribution & Architectural Overview

**Team:** Mikael Zinsou, Denilson, Marlize, Wenya, and Harold  
**Architecture:** Spring Boot / MySQL backend & React / Vite frontend  
**Project:** Adaptive Quiz and Practice System  
**Institution:** GD Goenka University  

---

## 1. Directory Structure & Team Division

To guarantee modular separation of concerns and prevent code collision among team members, the codebase is partitioned into designated modules:

```text
src/main/java/com/adaptivequiz/
├── app/
│   └── AdaptiveQuizApplication.java         # Global Spring Boot entry point
├── person1_database_auth/                    # [PERSON 1 — MIKAEL] Database, Persistence & Auth
├── person2_quiz/                            # [PERSON 2 — DENILSON] Quiz lifecycle & session management
├── person3_scoring/                         # [PERSON 3 — MARLIZE] Scoring algorithms & difficulty rules
├── person4_analytics/                       # [PERSON 4 — WENYA] Performance analytics & weak topic detection
└── frontend/                                # [PERSON 5 — HAROLD] React web UI & client-side integration
```

---

## 2. Contributions by Team Member

### Mikael — Person 1: Database and Authentication

Mikael implemented the MySQL database, JPA persistence layer, Spring Security configuration, and transactional attempt completion.

| Package / Directory | File | Purpose |
|---|---|---|
| `database/schema/` | `schema.sql` | DDL creating 7 relational InnoDB tables and 1 student-safe view (`student_questions`) with foreign keys and check constraints. |
| `database/seed/` | `001_subjects.sql` | Idempotent seed script inserting the 9 GD Goenka approved subjects. |
| `database/seed/` | `002_topics.sql` | Syllabi topics catalogue for all approved courses. |
| `database/seed/` | `003_sample_questions.sql` | Initial question bank for question delivery and testing. |
| `database/` | `RESET_AND_SETUP.md` | Verification instructions and automated DB reset commands. |
| `...person1_database_auth.model` | `User.java` | JPA entity mapped to `users` with password hash, roles, and timestamps. |
| `...person1_database_auth.model` | `Subject.java` | JPA entity mapped to `subjects` with subject code as primary key. |
| `...person1_database_auth.model` | `Topic.java` | JPA entity mapped to `topics` with unique constraint `(subject_code, name)`. |
| `...person1_database_auth.model` | `Question.java` | JPA entity mapped to `questions` with options, correct answer, explanation, and generator metadata. |
| `...person1_database_auth.model` | `StudentQuestionView.java` | Read-only entity mapped to the `student_questions` view (excludes answer key). |
| `...person1_database_auth.model` | `QuizAttempt.java` | JPA entity mapped to `quiz_attempts` tracking student score and timing. |
| `...person1_database_auth.model` | `QuizAnswer.java` | JPA entity mapped to `quiz_answers` with cascade deletion on attempt removal. |
| `...person1_database_auth.model` | `TopicPerformance.java` | JPA entity mapped to `topic_performance` with composite key `(user_id, topic_id)`. |
| `...person1_database_auth.model` | `TopicPerformanceId.java` | Composite key embeddable class for `topic_performance`. |
| `...person1_database_auth.model` | `Difficulty.java` | Enum matching `ENUM('EASY', 'MEDIUM', 'HARD')`. |
| `...person1_database_auth.repository` | `UserRepository.java` | Spring Data JPA queries by username, email, and existence checks. |
| `...person1_database_auth.repository` | `SubjectRepository.java` | Spring Data JPA retrieval of approved subjects. |
| `...person1_database_auth.repository` | `TopicRepository.java` | Spring Data JPA retrieval of topics by subject code. |
| `...person1_database_auth.repository` | `QuestionRepository.java` | JPA queries by topic, difficulty, and generator deduplication reference. |
| `...person1_database_auth.repository` | `StudentQuestionRepository.java`| Safe question retrieval from the database view. |
| `...person1_database_auth.repository` | `QuizAttemptRepository.java` | JPA queries by user attempt history. |
| `...person1_database_auth.repository` | `QuizAnswerRepository.java` | JPA queries for submitted answers by attempt ID. |
| `...person1_database_auth.repository` | `TopicPerformanceRepository.java`| JPA queries for finding student weak areas. |
| `...person1_database_auth.auth` | `SecurityConfig.java` | Spring Security filter chain, BCrypt bean, and authorization configuration. |
| `...person1_database_auth.auth` | `AuthService.java` | Registration logic, BCrypt hashing, credential validation, and IDOR access control. |
| `...person1_database_auth.auth` | `CustomUserDetails.java` | Adapter converting JPA `User` to Spring Security `UserDetails`. |
| `...person1_database_auth.auth` | `CustomUserDetailsService.java` | Loads user account from MySQL by username or email. |
| `...person1_database_auth.auth` | `AuthController.java` | Endpoints `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`. |
| `...person1_database_auth.service` | `QuizCompletionService.java` | Atomic `@Transactional` service saving answers, attempt score, and upserting `topic_performance` aggregates. |
| `...person1_database_auth.service` | `TopicPerformanceTrackingService.java`| Retrieval of weak topics below accuracy thresholds for adaptive generation. |
| `...person1_database_auth.dto` | `StudentQuestionDto.java` | Secure DTO preventing answer key and explanation leakage to students. |
| `src/test/...person1_database_auth` | `*Test.java` (6 suites) | Automated unit, security, and transactional verification suite (16 tests, 0 failures). |

---

### Denilson — Person 2: Quiz Management

Denilson implemented the dynamic quiz lifecycle, question fetching, and session management.

| Package / Directory | File | Purpose |
|---|---|---|
| `...person2_quiz.controler` | `QuizController.java` | REST endpoints for starting a quiz (`/start`), retrieving next question (`/next`), submitting individual answers (`/submit`), and finishing quizzes (`/complete`). |
| `...person2_quiz.service` | `QuizService.java` | In-memory session tracking, candidate question filtering by topic & dynamic difficulty, and question delivery. |
| `...person2_quiz.service` | `QuizSession.java` | Session state model tracking current difficulty, answered questions, and streak counters. |
| `...person2_quiz.service` | `AdaptiveLogic.java` | Bridge connecting session results with scoring and 3-correct / 2-wrong difficulty transitions. |
| `...person2_quiz.model` | `AnswerOption.java` | Model representing answer choices and labels for questions. |
| `src/test/...person2_quiz` | `AdaptiveLogicTest.java` | Unit tests for streak tracking and dynamic difficulty progression. |

---

### Marlize — Person 3: Scoring and Adaptation

Marlize implemented answer verification, percentage calculation, and performance evaluation.

| Package / Directory | File | Purpose |
|---|---|---|
| `...person3_scoring` | `AnswerChecker.java` | Case-insensitive validation of user selected options against question answer keys. |
| `...person3_scoring` | `ScoreCalculator.java` | Mathematical percentage scoring logic and precision rounding. |
| `...person3_scoring` | `AdaptiveDifficulty.java` | Core difficulty transition rules based on student answer streaks. |
| `...person3_scoring` | `QuizResult.java` | Scoring evaluation model containing final score, accuracy percentage, and performance classification. |
| `...person3_scoring` | `AdaptiveQuizSystem.java` | Orchestrates end-to-end question evaluation and difficulty updates. |
| `...person3_scoring` | `ScoringService.java` | Spring service wrapper exposing scoring and result calculation to the rest of the application. |
| `src/test/...person3_scoring` | `ScoringServiceTest.java` | Unit tests for answer checking, accuracy calculation, and difficulty thresholds. |

---

### Wenya — Person 4: Analytics and Recommendations

Wenya implemented student performance tracking, weak topic diagnostics, and study recommendations.

| Package / Directory | File | Purpose |
|---|---|---|
| `...person4_analytics` | `AnalyticsController.java` | REST endpoints exposing analytics overview (`/overview`), subject summaries (`/summary`), weak topics (`/weak-topics`), and recommendations (`/recommendations`). |
| `...person4_analytics` | `AnalyticsService.java` | Aggregates student quiz attempts, calculates subject-level accuracy, and identifies topics needing revision. |
| `...person4_analytics` | `AnalyticsSystem.java` | Domain evaluation logic identifying practice needs based on accuracy thresholds. |

---

### Harold — Person 5: Frontend and Integration

Harold built the client-side user interface using React, Vite, and modern CSS.

| Package / Directory | File / Component | Purpose |
|---|---|---|
| `frontend/src/pages/` | `HomePage.jsx` | Landing page introducing the system, features, and call-to-action. |
| `frontend/src/pages/` | `QuizPage.jsx` | Interactive test environment showing live questions, option selection, timer, and progress. |
| `frontend/src/pages/` | `QuizLibraryPage.jsx` | Catalog of university subjects and topics where students select quizzes. |
| `frontend/src/pages/` | `AnalyticsPage.jsx` | Performance dashboard displaying accuracy charts, weak areas, and progress. |
| `frontend/src/pages/` | `ProfilePage.jsx` | Student profile overview, settings, and study history. |
| `frontend/src/pages/` | `ResultsPage.jsx` | Post-quiz score summary, performance badges, and review answers. |
| `frontend/src/components/` | `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx` | Application navigation and responsive layout framework. |
| `frontend/src/services/` | `authApi.js` | REST client connecting frontend to Person 1's authentication API (`/api/auth/*`). |
| `frontend/src/services/` | `academicData.js` | University curriculum, subject codes, and topic listings for client navigation. |
| `frontend/src/services/` | `theme.js` | Dark/light mode theme management. |
