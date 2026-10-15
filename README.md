# Adaptive Quiz and Practice System

A Java desktop application concept for delivering topic-based quizzes, adapting question difficulty, recording results, and recommending practice areas.

## Status

Project framework only. No application, database, or test code has been added yet.

## Planned stack

- Java
- Java Swing
- MySQL
- JDBC
- Git and GitHub

## Repository layout

```text
src/main/java/com/adaptivequiz/
  app/         application entry point and composition
  auth/        registration and login
  quiz/        quiz session and question-management logic
  scoring/     answer checking and adaptive-difficulty rules
  analytics/   progress analysis and recommendations
  ui/          Java Swing screens and event handling
  model/       shared domain objects
  repository/  database access interfaces/implementations
  db/          JDBC connection and database setup support
  util/        shared helpers
src/main/resources/
  config/      non-secret configuration templates
  images/      UI assets
src/test/java/com/adaptivequiz/
  ...          tests grouped by feature
database/
  schema/      table definitions
  seed/        starter/reference data
  migrations/  ordered database changes
docs/          project decisions and team documentation
```

## Getting started as a team

1. Assign the five ownership areas in [docs/TEAM_ROLES.md](docs/TEAM_ROLES.md).
2. Agree on the domain and database contracts in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DATABASE_PLAN.md](docs/DATABASE_PLAN.md).
3. Create a GitHub repository from this folder, add the team as collaborators, and protect `main`.
4. Work in feature branches and open pull requests for review.
5. Add source code only inside the matching package; keep credentials out of Git.

## Suggested workflow

- Branch names: `feature/auth-login`, `feature/quiz-session`, `feature/adaptive-scoring`, `feature/analytics`, `feature/swing-ui`.
- Keep each pull request focused on one feature.
- Update documentation when an interface, table, or rule changes.

## Documentation

- [Architecture and boundaries](docs/ARCHITECTURE.md)
- [Database plan](docs/DATABASE_PLAN.md)
- [Team roles](docs/TEAM_ROLES.md)
- [Development workflow](docs/DEVELOPMENT_WORKFLOW.md)

