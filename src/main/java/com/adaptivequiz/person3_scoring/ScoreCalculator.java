package com.adaptivequiz.person3_scoring;

import org.springframework.stereotype.Component;

/** Calculates validated quiz summary values. */
@Component
public class ScoreCalculator {

    public int calculateIncorrectAnswers(
            int totalQuestions,
            int correctAnswers) {

        validateCounts(totalQuestions, correctAnswers);
        return totalQuestions - correctAnswers;
    }

    public double calculatePercentage(
            int totalQuestions,
            int correctAnswers) {

        validateCounts(totalQuestions, correctAnswers);
        if (totalQuestions == 0) return 0.0;

        return ((double) correctAnswers / totalQuestions) * 100;
    }

    private void validateCounts(int totalQuestions, int correctAnswers) {
        if (totalQuestions < 0) {
            throw new IllegalArgumentException("Total questions cannot be negative.");
        }
        if (correctAnswers < 0 || correctAnswers > totalQuestions) {
            throw new IllegalArgumentException("Correct answers must be between 0 and total questions.");
        }
    }
}
