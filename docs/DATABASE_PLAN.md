# Database Plan

No schema is implemented yet. This document is the team's contract before creating SQL files in `database/schema`.

## Proposed entities

| Entity | Purpose | Owner |
|---|---|---|
| Student | Account/profile and authentication data | Person 1 |
| Topic | Subject areas such as loops or arrays | Person 2 |
| Question | Prompt, difficulty, topic, and answer data | Person 2 |
| Answer option | Choices associated with a question | Person 2 |
| Quiz attempt | One student's quiz session and final score | Persons 1–3 |
| Attempt answer | A student's selected answer and correctness | Persons 1–3 |
| Recommendation | Optional persisted practice suggestion | Person 4 |

## Naming conventions

- Use `snake_case` for tables and columns.
- Use singular table names, agreed consistently by the whole team.
- Give each table a primary key.
- Record creation/update timestamps where they help analysis.
- Use foreign keys for relationships and index commonly queried IDs.
- Never store plain-text passwords; store only a secure password hash.

## Files to add later

- `database/schema/001_initial_schema.sql`
- `database/seed/001_sample_topics_and_questions.sql`
- `database/migrations/` for changes after the initial schema
- `src/main/resources/config/database.properties.example` for connection-setting names only

