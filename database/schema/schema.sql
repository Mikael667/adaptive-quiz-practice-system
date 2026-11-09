-- Fresh-install schema for the Adaptive Quiz and Practice System.
-- This file creates structures only. Load database/seed/001_subjects.sql
-- afterwards to add the required subject catalogue.

CREATE DATABASE IF NOT EXISTS adaptive_quiz
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
USE adaptive_quiz;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE = InnoDB;

CREATE TABLE subjects (
    code VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE topics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(10) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_topics_subject_name UNIQUE (subject_code, name),
    CONSTRAINT fk_topics_subject
        FOREIGN KEY (subject_code) REFERENCES subjects(code)
) ENGINE = InnoDB;

CREATE TABLE questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topic_id BIGINT UNSIGNED NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_option CHAR(1) NOT NULL,
    explanation TEXT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'MEDIUM',
    generation_source VARCHAR(100) NOT NULL,
    generation_reference VARCHAR(128) NULL,
    generation_metadata JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    generated_at TIMESTAMP NULL,
    CONSTRAINT ck_questions_correct_option
        CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    CONSTRAINT uq_questions_generation_reference UNIQUE (generation_reference),
    CONSTRAINT fk_questions_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id),
    INDEX idx_questions_topic_difficulty (topic_id, difficulty)
) ENGINE = InnoDB;

CREATE TABLE quiz_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    total_questions INT UNSIGNED NOT NULL DEFAULT 0,
    correct_answers INT UNSIGNED NOT NULL DEFAULT 0,
    score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT ck_quiz_attempts_correct_answers
        CHECK (correct_answers <= total_questions),
    CONSTRAINT ck_quiz_attempts_score CHECK (score BETWEEN 0.00 AND 100.00),
    CONSTRAINT fk_quiz_attempts_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_quiz_attempts_user_started (user_id, started_at)
) ENGINE = InnoDB;

CREATE TABLE quiz_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    selected_option CHAR(1) NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    answered_at TIMESTAMP NULL,
    CONSTRAINT ck_quiz_answers_selected_option
        CHECK (selected_option IS NULL OR selected_option IN ('A', 'B', 'C', 'D')),
    CONSTRAINT uq_quiz_answers_attempt_question UNIQUE (attempt_id, question_id),
    CONSTRAINT fk_quiz_answers_attempt
        FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_answers_question
        FOREIGN KEY (question_id) REFERENCES questions(id),
    INDEX idx_quiz_answers_question_id (question_id)
) ENGINE = InnoDB;

-- One row per user/topic. The count, correct_answers, accuracy, and
-- last_practiced_at values are cached aggregates. When an attempt is
-- completed, the application updates them in the same transaction as the
-- quiz answers and quiz_attempts summary.
CREATE TABLE topic_performance (
    user_id BIGINT UNSIGNED NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    questions_attempted INT UNSIGNED NOT NULL DEFAULT 0,
    correct_answers INT UNSIGNED NOT NULL DEFAULT 0,
    accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    last_practiced_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, topic_id),
    CONSTRAINT ck_topic_performance_correct_answers
        CHECK (correct_answers <= questions_attempted),
    CONSTRAINT ck_topic_performance_accuracy CHECK (accuracy BETWEEN 0.00 AND 100.00),
    CONSTRAINT fk_topic_performance_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_topic_performance_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id),
    INDEX idx_topic_performance_weak_topics (user_id, accuracy, last_practiced_at)
) ENGINE = InnoDB;

-- Student-facing question projection. It intentionally omits correct_option,
-- explanation, and generator metadata. The application/API must use this
-- projection before submission and enforce ownership when retrieving attempts.
CREATE VIEW student_questions AS
SELECT
    id,
    topic_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    difficulty
FROM questions;
