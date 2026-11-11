# Adaptive Quiz and Practice System

A browser-based adaptive quiz platform with a Spring Boot/MySQL backend and a
React frontend. Authentication is connected end-to-end; the remaining quiz and
analytics screens can progressively replace their sample data with the API.

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

## Run the whole site with Docker (recommended for teammates)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) only.
From the repository root, run:

```sh
docker compose up --build
```

Then open [http://localhost:5173](http://localhost:5173). Docker starts MySQL,
loads the schema and seed data, starts Spring Boot, and serves the React site.
No local MySQL, Java, Maven, Node.js, or npm installation is required.

To stop it, press `Ctrl+C`. To remove the local Docker database and start with
fresh seed data later, run:

```sh
docker compose down -v
```

## API status

| Area | Endpoints | Owner |
|---|---|---|
| Authentication | `/api/auth/register`, `/login`, `/logout`, `/me` | Mikael (Person 1) |
| Quiz flow | `/api/topics`, `/api/quizzes`, question, answer, and completion routes | Denilson (Person 2) |
| Scoring | Shared Spring `ScoringService` used by the quiz-flow compatibility bridge | Marlize (Person 3) |
| Analytics | `/api/analytics/me` | Wenya (Person 4) |
| React web application | `frontend/` | Harold (Person 5) |

## Team contributions

- **Mikael (Person 1):** MySQL schema/seed data, JPA entities and repositories,
  Spring Security, registration/login/session support, and persistent quiz
  completion/topic-performance services.
- **Denilson (Person 2):** REST quiz-session workflow for topics, starting a
  quiz, requesting questions, submitting answers, and completing a quiz.
- **Marlize (Person 3):** Answer checking, score calculation, performance
  levels, and adaptive-difficulty rules.
- **Wenya (Person 4):** Topic-performance analysis and recommendations using
  Strong/Average/Weak levels.
- **Harold (Person 5):** React/Vite interface, dashboard pages, quiz UI,
  styling, and authentication modal integration.

The backend integration layer connects Denilson's quiz workflow to Marlize's
scoring contract and exposes Wenya's analysis from Mikael's persisted topic
performance data.

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
