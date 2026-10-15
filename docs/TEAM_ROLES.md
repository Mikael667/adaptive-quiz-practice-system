# Team Roles and Ownership

| Person | Area | Main folders | Main responsibility |
|---|---|---|---|
| 1 | Database and authentication | `db`, `repository`, `auth`, `database` | Schema, JDBC access, registration, login, secure password handling |
| 2 | Quiz management | `quiz`, `model` | Questions, topics, answer options, quiz lifecycle |
| 3 | Scoring and adaptation | `scoring` | Answer evaluation, percentages, difficulty-selection rules |
| 4 | Analytics and recommendations | `analytics` | Topic performance, weak-area detection, practice recommendations |
| 5 | Frontend and integration | `ui`, `app` | Swing screens, event handling, feature integration |

## Shared responsibilities

- Review pull requests outside your own feature when possible.
- Keep model and database-contract changes visible to the entire team.
- Add tests for the logic you introduce.
- Update the relevant documentation before merging changed decisions.

