# Team Roles and Ownership

| Person | Area | Main folders | Responsibility |
|---|---|---|---|
| 1 | Database and authentication | `person1_database_auth`, `database` | MySQL schema, JPA repositories, registration, login, password handling |
| 2 | Quiz management | `quiz`, `model` | Questions, topics, answer options, quiz lifecycle |
| 3 | Scoring and adaptation | `scoring` | Answer evaluation, percentages, difficulty rules |
| 4 | Analytics and recommendations | `analytics` | Topic performance, weak areas, recommendations |
| 5 | Frontend and integration | `frontend`, `app` | Browser pages, API integration, and final integration |

## Everyone

- Review pull requests when possible.
- Tell the team before changing shared models or database contracts.
- Add tests for new logic.
- Update documentation when decisions change.
