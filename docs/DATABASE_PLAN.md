# Database Plan

The MySQL schema is implemented in [schema.sql](../database/schema/schema.sql).
It supports the Spring Data JPA entities in `person1_database_auth`.

| Entity | Purpose | Owner |
|---|---|---|
| User | Account, role, and password-hash data | Person 1 |
| Subject | Course catalogue | Person 1 |
| Topic | Subject areas | Persons 1–2 |
| Question | Prompt, choices, difficulty, answer data, and generation metadata | Persons 1–2 |
| Quiz attempt | A student's quiz session and score | Persons 1–3 |
| Quiz answer | Selected answer and correctness | Persons 1–3 |
| Topic performance | Cached per-topic accuracy for adaptive and analytics features | Persons 1, 3–4 |

## Conventions

- Use `snake_case` SQL names.
- Use primary keys, foreign keys, and indexes for relational integrity and common queries.
- Never store plain-text passwords; `users.password_hash` stores BCrypt hashes only.
- Return `StudentQuestionDto` or the `student_questions` view to students before submission so correct answers and explanations are not exposed.
- Treat `topic_performance` as a cached aggregate updated in the same transaction as a completed quiz attempt.

## Files

- `database/schema/schema.sql` — database schema and `student_questions` view
- `database/seed/001_subjects.sql` — subjects
- `database/seed/002_topics.sql` — topics
- `database/seed/003_sample_questions.sql` — sample question bank
- `database/RESET_AND_SETUP.md` — local setup instructions
- `src/main/resources/application.properties` — Spring datasource and JPA settings
