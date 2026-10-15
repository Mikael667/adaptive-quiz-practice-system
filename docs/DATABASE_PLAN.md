# Database Plan

No SQL schema is implemented yet. Create it later in `database/schema` after team agreement.

| Entity | Purpose | Owner |
|---|---|---|
| Student | Account and authentication data | Person 1 |
| Topic | Subject areas | Person 2 |
| Question | Prompt, difficulty, topic, answer data | Person 2 |
| Answer option | Choices for a question | Person 2 |
| Quiz attempt | A student's quiz session and score | Persons 1–3 |
| Attempt answer | Selected answer and correctness | Persons 1–3 |
| Recommendation | Optional persisted practice suggestion | Person 4 |

## Conventions

- Use consistent `snake_case` SQL names.
- Give every table a primary key and relationships foreign keys.
- Index frequently queried IDs.
- Never store plain-text passwords; store a secure password hash only.

## Planned files

- `database/schema/001_initial_schema.sql`
- `database/seed/001_sample_topics_and_questions.sql`
- `database/migrations/` for later changes
- `src/main/resources/config/database.properties.example` for setting names only
