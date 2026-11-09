# Development Workflow

## Before coding

1. Create GitHub issues and assign their owners.
2. Agree on initial models, database schema, and feature contracts.
3. Use one branch per feature: `feature/auth-login`, `feature/quiz-session`, `feature/adaptive-scoring`, `feature/analytics`, or `feature/web-ui`.

## Pull requests

1. Branch from `main`.
2. Make one focused change.
3. Test it locally.
4. Describe the change, tests, and any database/documentation impact.
5. Request a teammate review before merging.

## Recommended integration order

1. Domain models and database schema
2. JPA repositories and REST contracts
3. Authentication
4. Quiz management
5. Scoring and adaptive rules
6. Analytics and recommendations
7. Web frontend and final integration

Keep credentials out of version control. Configure the local database password through the `DB_PASSWORD` environment variable.
