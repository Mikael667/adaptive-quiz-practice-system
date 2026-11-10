package com.adaptivequiz.person2_quiz.service;

import com.adaptivequiz.person1_database_auth.model.Difficulty;

import java.util.HashSet;
import java.util.Set;

/** Holds the progress of one running quiz. */
public class QuizSession {

    final Long topicId;
    final Long studentId;
    final int totalQuestions;
    final Set<Long> answeredQuestionIds = new HashSet<>();

    Difficulty currentDifficulty = Difficulty.MEDIUM;
    int correctInRow = 0;
    int wrongInRow = 0;
    int correctCount = 0;
    boolean completed = false;

    QuizSession(Long topicId, Long studentId, int totalQuestions) {
        this.topicId = topicId;
        this.studentId = studentId;
        this.totalQuestions = totalQuestions;
    }

    int answeredCount() {
        return answeredQuestionIds.size();
    }
}

