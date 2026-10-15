# Development Workflow

## Before coding

1. Create the remote GitHub repository and push the initial framework.
2. Add all group members as collaborators.
3. Create GitHub issues for each feature and assign owners.
4. Agree on the initial schema, model names, and feature contracts.

## Branch and pull-request process

1. Create a branch from `main` using `feature/<short-name>`.
2. Make one coherent change per branch.
3. Test locally before opening a pull request.
4. Describe the feature, tests, and any database/documentation changes in the pull request.
5. Have at least one teammate review it before merging.

## Integration order

1. Domain models and initial database schema
2. Database connection and repositories
3. Authentication
4. Question/topic management and quiz sessions
5. Scoring and adaptive rules
6. Analytics and recommendations
7. Swing screens and full application integration

## Configuration

Use a local, ignored `database.properties` file for credentials. Commit only an example file without real values.

