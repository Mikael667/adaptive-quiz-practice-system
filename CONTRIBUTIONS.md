# Project Contribution & Architectural Overview

**Student:** Mikael Zinsou  
**Assigned Area:** Person 1 — Database & Authentication  
**Project:** Adaptive Quiz and Practice System  
**Institution:** GD Goenka University  

---

## 1. Directory Structure & Team Division

To guarantee modular separation of concerns and prevent code collision among team members, the codebase is partitioned into designated modules:

```text
src/main/java/com/adaptivequiz/
├── app/
│   └── AdaptiveQuizApplication.java         # Global Spring Boot entry point
├── person1_database_auth/                    # [OWNED BY MIKAEL ZINSOU]
│   ├── auth/                                # Security, BCrypt, session, and registration
│   ├── dto/                                 # Secure data transfer contracts (safe question views)
│   ├── model/                               # JPA Entities mapping MySQL tables and views
│   ├── repository/                          # Spring Data JPA database interfaces
│   └── service/                             # Transactional persistence & aggregate calculations
├── person2_quiz/                            # [PERSON 2] Question generation & quiz lifecycle
├── person3_scoring/                         # [PERSON 3] Scoring evaluation & difficulty adaptation
├── person4_analytics/                       # [PERSON 4] Recommendation engine
└── frontend/                                # [PERSON 5] React frontend & API integration
```

---

## 2. Complete File Manifest for Mikael Zinsou

Every file below was authored and implemented by Mikael Zinsou as part of the Database and Authentication responsibility.

| Package / Directory | File | Purpose |
|---|---|---|
| `database/schema/` | `schema.sql` | DDL creating 7 relational InnoDB tables and 1 student-safe view (`student_questions`) with foreign keys and check constraints. |
| `database/seed/` | `001_subjects.sql` | Idempotent seed script inserting the 9 GD Goenka approved subjects. |
| `database/seed/` | `002_topics.sql` | Syllabi topics catalogue for all approved courses. |
| `database/seed/` | `003_sample_questions.sql` | Initial question bank for question generation and grading tests. |
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

## 3. How Teammates Interface with Person 1's Work

Teammates build their functionality on top of these exposed interfaces:
* **Person 2 (Quiz Manager):** Injects `StudentQuestionRepository` and `QuizCompletionService` to fetch safe questions and submit student answers.
* **Person 3 (Scoring & Adaptation):** References `Difficulty` enum and grading contracts in `QuizCompletionService`.
* **Person 4 (Analytics):** Calls `TopicPerformanceTrackingService` to retrieve weak topics and accuracy stats.
* **Person 5 (Frontend):** Connects to `AuthController` (`/api/auth/login`, `/api/auth/register`) and quiz REST endpoints.
