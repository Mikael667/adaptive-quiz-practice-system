package com.adaptivequiz.person3_scoring;

import com.adaptivequiz.person1_database_auth.model.Difficulty;

/** Immutable scoring result for a completed quiz. */
public class QuizResult {

    private final int totalQuestions;
    private final int correctAnswers;
    private final int incorrectAnswers;
    private final double percentage;
    private final Difficulty finalDifficulty;

    public QuizResult(
            int totalQuestions,
            int correctAnswers,
            int incorrectAnswers,
            double percentage,
            Difficulty finalDifficulty) {

        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = incorrectAnswers;
        this.percentage = percentage;
        this.finalDifficulty = finalDifficulty == null ? Difficulty.EASY : finalDifficulty;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public int getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public double getPercentage() {
        return percentage;
    }

    public Difficulty getFinalDifficulty() {
        return finalDifficulty;
    }
    public String getPerformanceLevel() {
        
        if (percentage >= 80) {
            return "Excellent";
        } else if (percentage >= 60) {
            return "Good";
        } else if (percentage >= 40) {
            return "Needs Improvement";
        } else {
            return "Poor";
        }
    }
}
