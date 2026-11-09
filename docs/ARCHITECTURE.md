# Architecture

## Goal

Build a browser-based adaptive quiz platform with a Spring Boot REST backend,
a separate web frontend, and MySQL persistence.

| Layer | Responsibility | Location |
|---|---|---|
| Web frontend | Pages, forms, navigation, and API calls | `person5_ui` |
| HTTP API and security | REST endpoints, authentication, authorization | `person1_database_auth/auth` |
| Application logic | Quiz flow, scoring, adaptation, analytics | `person2_quiz`, `person3_scoring`, `person4_analytics` |
| Domain and persistence | JPA entities, repositories, MySQL schema | `person1_database_auth/model`, `person1_database_auth/repository`, `database` |
| Setup | Spring Boot startup and configuration | `app` |

## Dependency rule

The browser frontend communicates only with REST endpoints. Controllers call
application services; services use repositories; repositories persist JPA
entities to MySQL. Database and service code must not contain browser or UI
logic.

## Main journey

1. Student registers or signs in.
2. Student chooses a topic and starts a quiz.
3. The quiz supplies a suitable question.
4. The student submits an answer.
5. Scoring evaluates it and adapts the next difficulty.
6. Results are saved and analysed.
7. The frontend shows performance and a recommendation.

## Decisions before implementation

- Frontend framework and deployment approach
- Session or token authentication contract for the frontend
- Quiz length and question types
- Difficulty levels and adaptive thresholds
- Incomplete-attempt handling
- Recommendation ranking rules
