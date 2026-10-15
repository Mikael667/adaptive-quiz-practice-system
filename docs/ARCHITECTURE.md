# Architecture

## Goal

Build a Java Swing desktop application with a clear separation between the interface, application logic, and MySQL persistence.

## Proposed layers

| Layer | Responsibility | Primary packages |
|---|---|---|
| User interface | Screens, input collection, display, navigation | `ui` |
| Application logic | Quiz flow, scoring, adaptation, analytics | `quiz`, `scoring`, `analytics`, `auth` |
| Domain model | Shared concepts and validation rules | `model` |
| Persistence | JDBC operations and database mapping | `repository`, `db` |
| Application setup | Startup and dependency wiring | `app` |

## Key dependency rule

The Swing UI should request actions from application logic. Application logic should use repository contracts for saved data. Database code should not control Swing components.

## Main user journey

1. Student registers or signs in.
2. Student selects a topic and starts a quiz.
3. The quiz service supplies an appropriate question.
4. The student submits an answer.
5. Scoring evaluates it and updates the next difficulty.
6. The attempt and answers are saved.
7. Analytics identifies weak topics and creates recommendations.
8. The UI presents the result and progress.

## Decisions to agree before implementation

- Authentication/password-hashing library and policy.
- Quiz length and allowed question types.
- Difficulty levels and adaptive thresholds.
- Whether incomplete quiz attempts are saved.
- How recommendations are ranked when several topics are weak.

