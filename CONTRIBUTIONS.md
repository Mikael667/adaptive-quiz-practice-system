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

Mikael designed and implemented the relational persistence foundation, secure authentication, and transactional database logic.

| Component / Layer | Key Files | Purpose |
|---|---|---|
| **SQL Database & Seeds** | `database/schema/schema.sql`, `database/seed/*.sql` | MySQL schema with 7 InnoDB tables, 1 student-safe view (`student_questions`), foreign keys, and seed catalogues. |
| **JPA Domain Entities** | `model/*.java` (10 classes: `User`, `Question`, etc.) | Object-relational mapping matching the database schema, including composite key `TopicPerformanceId`. |
| **Spring Data Repositories** | `repository/*.java` (8 interfaces) | Type-safe database queries for user accounts, quiz attempts, answers, and weak-topic lookups. |
| **Authentication & Security** | `auth/*.java` (`SecurityConfig`, `AuthService`, etc.) | BCrypt password encryption, registration and login REST API (`/api/auth/*`), and IDOR access control. |
| **Persistence Services & DTOs** | `service/*.java`, `dto/*.java` | Atomic `@Transactional` attempt grading (`QuizCompletionService`), performance tracking, and safe question DTOs. |
| **Automated Test Suite** | `src/test/...person1_database_auth` | 6 verification suites (16 automated tests) covering BCrypt, login, and transactional calculation. |

---

### Denilson — Person 2: Quiz Management

Denilson implemented the dynamic quiz lifecycle, question fetching, and session management.

| Component / Layer | Key Files | Purpose |
|---|---|---|
| **Quiz REST Controller** | `QuizController.java` | Endpoints for starting a quiz (`/start`), retrieving questions (`/next`), submitting answers (`/submit`), and finishing quizzes. |
| **Quiz Service & Sessions** | `QuizService.java`, `QuizSession.java` | In-memory session tracking, candidate question filtering by topic & dynamic difficulty, and question delivery. |
| **Adaptive Logic Bridge** | `AdaptiveLogic.java` | Bridge connecting session results with scoring and difficulty progression rules. |
| **Quiz Models & Tests** | `AnswerOption.java`, `AdaptiveLogicTest.java` | Data models and automated unit tests for quiz progression and streak tracking. |

---

### Marlize — Person 3: Scoring and Adaptation

Marlize implemented answer verification, percentage calculation, and performance evaluation.

| Component / Layer | Key Files | Purpose |
|---|---|---|
| **Answer Evaluation** | `AnswerChecker.java` | Case-insensitive validation of user selected options against question answer keys. |
| **Score & Accuracy Math** | `ScoreCalculator.java` | Mathematical percentage scoring logic and precision rounding. |
| **Adaptive Rules Engine** | `AdaptiveDifficulty.java` | Core difficulty transition rules (3 correct &rarr; level up; 2 wrong &rarr; level down). |
| **Scoring Service & Tests** | `ScoringService.java`, `ScoringServiceTest.java` | Service wrapper exposing evaluation models and comprehensive scoring tests. |

---

### Wenya — Person 4: Analytics and Recommendations

Wenya implemented student performance tracking, weak topic diagnostics, and study recommendations.

| Component / Layer | Key Files | Purpose |
|---|---|---|
| **Analytics Controller** | `AnalyticsController.java` | REST endpoints for analytics overview (`/overview`), subject summaries (`/summary`), and weak topics (`/weak-topics`). |
| **Analytics Service** | `AnalyticsService.java` | Aggregates student quiz attempts, calculates subject-level accuracy, and diagnoses performance. |
| **Recommendation Engine** | `AnalyticsSystem.java` | Domain evaluation logic identifying practice needs based on accuracy thresholds. |

---

### Harold — Person 5: Frontend and Integration

Harold built the client-side user interface using React, Vite, and modern CSS.

| Component / Layer | Key Files | Purpose |
|---|---|---|
| **Web Application Pages** | `HomePage`, `QuizPage`, `QuizLibraryPage` | Core user views for landing, topic selection, and taking interactive quizzes. |
| **Analytics & Profile Pages** | `AnalyticsPage`, `ProfilePage`, `ResultsPage` | Student dashboards displaying accuracy charts, score breakdowns, and study history. |
| **Layout & Navigation** | `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx` | Application navigation and responsive layout framework. |
| **Client API Integration** | `authApi.js`, `academicData.js` | REST client connecting frontend to backend authentication and curriculum listings. |
