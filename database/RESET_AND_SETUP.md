# Local MySQL reset and setup

> Warning: this procedure permanently deletes every table and record in the
> local `adaptive_quiz` database. Do not run it against a shared, staging, or
> production server. Back up anything you need first.

Run these commands from the repository root on your Mac. Replace `root` with
your local MySQL administrator account if necessary. MySQL will securely prompt
for the password; do not add it to the command line.

```sh
mysql -u root -p -e "DROP DATABASE IF EXISTS adaptive_quiz;"
mysql -u root -p < database/schema/schema.sql
mysql -u root -p adaptive_quiz < database/seed/001_subjects.sql
mysql -u root -p adaptive_quiz < database/seed/002_topics.sql
mysql -u root -p adaptive_quiz < database/seed/003_sample_questions.sql
```

Verify the installation:

```sh
mysql -u root -p adaptive_quiz -e "SELECT code, full_name FROM subjects ORDER BY code;"
mysql -u root -p adaptive_quiz -e "SHOW TABLES;"
```

The schema command creates `adaptive_quiz`, its tables, and the
`student_questions` view. The subject and topic seed scripts can be run again
safely; the sample-question script provides the initial question bank.

## Spring Boot connection

The backend uses the datasource settings in `src/main/resources/application.properties`.
Create a local MySQL user named `quiz_app` (or change the configured username)
and set its password in the `DB_PASSWORD` environment variable before starting
the application.

## Cached performance values

`topic_performance` is an application-maintained aggregate, not a second source
of answer history. When a quiz attempt is completed, update its row for every
topic answered in the same transaction that writes `quiz_answers` and the
`quiz_attempts` summary:

- increase `questions_attempted` and `correct_answers`;
- set `accuracy` to `correct_answers / questions_attempted * 100`;
- set `last_practiced_at` to the completion time.

This lets the application find weak topics efficiently while `quiz_answers`
remains the detailed history.
