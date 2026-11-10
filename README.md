# Adaptive Quiz and Practice System

A browser-based adaptive quiz platform. The repository currently contains the
Spring Boot backend and MySQL database layer; the frontend will consume its
REST API.

## Technology stack

- Java 21 and Spring Boot
- Spring Web MVC, Spring Security, and Spring Data JPA
- MySQL
- Maven and JUnit/Mockito

## Repository layout

```text
src/main/java/com/adaptivequiz/
  app/                        Spring Boot application entry point
  person1_database_auth/      Database, JPA models, repositories, auth, and DTOs
  person2_quiz/               Quiz lifecycle and question-delivery work
  person3_scoring/            Scoring and difficulty-adaptation work
  person4_analytics/          Performance analysis and recommendations
frontend/                     React browser frontend and backend integration work
src/main/resources/           Spring application configuration
src/test/java/                Automated tests
database/                     MySQL schema and seed data
docs/                         Team documentation
```

## Run the backend

1. Create and seed MySQL using [the database setup guide](database/RESET_AND_SETUP.md).
2. Set `DB_PASSWORD` to the password for the `quiz_app` MySQL user.
3. Run `mvn spring-boot:run`.
4. Run `mvn test` to execute the automated tests.

The currently exposed authentication API is rooted at `/api/auth`:
`register`, `login`, `logout`, and `me`.

## Team workflow

1. Read [the role assignments](docs/TEAM_ROLES.md).
2. Agree on [architecture](docs/ARCHITECTURE.md) and the [database plan](docs/DATABASE_PLAN.md).
3. Create an issue and a feature branch for each piece of work.
4. Open a pull request for review before merging to `main`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database plan](docs/DATABASE_PLAN.md)
- [Team roles](docs/TEAM_ROLES.md)
- [Development workflow](docs/DEVELOPMENT_WORKFLOW.md)
