# Adaptive Quiz and Practice System

Project framework only. No application, database, or test code has been added yet.

## Technology stack

Java, Java Swing, MySQL, JDBC, Git, and GitHub.

## Repository layout

```text
src/main/java/com/adaptivequiz/
  app/         application startup and wiring
  auth/        registration and login
  quiz/        quiz sessions and question management
  scoring/     answer checking and adaptive rules
  analytics/   progress analysis and recommendations
  ui/          Java Swing screens and event handling
  model/       shared domain objects
  repository/  database access
  db/          JDBC setup
  util/        shared helpers
src/main/resources/  configuration templates and images
src/test/java/       feature tests
database/            schema, seed data, and migrations
docs/                team documentation
```

## Start as a team

1. Read [the role assignments](docs/TEAM_ROLES.md).
2. Agree on [architecture](docs/ARCHITECTURE.md) and the [database plan](docs/DATABASE_PLAN.md).
3. Create an issue and a feature branch for each piece of work.
4. Open a pull request for review before merging to `main`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database plan](docs/DATABASE_PLAN.md)
- [Team roles](docs/TEAM_ROLES.md)
- [Development workflow](docs/DEVELOPMENT_WORKFLOW.md)
