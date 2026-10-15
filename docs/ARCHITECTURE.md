# Architecture

## Goal

Build a Java Swing desktop application that separates interface, application logic, and MySQL persistence.

| Layer | Responsibility | Packages |
|---|---|---|
| User interface | Screens, events, navigation | `ui` |
| Application logic | Quiz flow, scoring, adaptation, analytics, login | `quiz`, `scoring`, `analytics`, `auth` |
| Domain model | Shared concepts and rules | `model` |
| Persistence | JDBC operations and mapping | `repository`, `db` |
| Setup | Startup and dependency wiring | `app` |

## Dependency rule

The Swing UI requests actions from application logic. Application logic uses repositories for saved data. Database code must not control Swing components.

## Main journey

1. Student registers or signs in.
2. Student chooses a topic and starts a quiz.
3. The quiz supplies a suitable question.
4. The student submits an answer.
5. Scoring evaluates it and adapts the next difficulty.
6. Results are saved and analysed.
7. The UI shows performance and a recommendation.

## Decisions before implementation

- Password hashing library and policy
- Quiz length and question types
- Difficulty levels and adaptive thresholds
- Incomplete-attempt handling
- Recommendation ranking rules
