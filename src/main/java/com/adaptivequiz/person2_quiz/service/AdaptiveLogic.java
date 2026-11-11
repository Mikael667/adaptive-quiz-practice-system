package com.adaptivequiz.person2_quiz.service;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person3_scoring.ScoringService;
import org.springframework.stereotype.Component;

/**
 * Compatibility bridge used by Person 2's quiz flow. It delegates score and
 * performance-level calculations to Person 3's scoring module.
 */
@Component
public class AdaptiveLogic {

    private final ScoringService scoringService;

    public AdaptiveLogic(ScoringService scoringService) {
        this.scoringService = scoringService;
    }

    public Difficulty nextDifficulty(Difficulty currentDifficulty,
                                     int consecutiveCorrect,
                                     int consecutiveIncorrect) {
        Difficulty current = currentDifficulty == null ? Difficulty.EASY : currentDifficulty;
        if (consecutiveCorrect >= 3) {
            return current == Difficulty.EASY ? Difficulty.MEDIUM : Difficulty.HARD;
        }
        if (consecutiveIncorrect >= 2) {
            return current == Difficulty.HARD ? Difficulty.MEDIUM : Difficulty.EASY;
        }
        return current;
    }

    public int percentage(int correctAnswers, int totalQuestions) {
        return (int) Math.round(scoringService
                .createResult(totalQuestions, correctAnswers, Difficulty.EASY)
                .getPercentage());
    }

    public String performanceLevel(int percentage) {
        return scoringService
                .createResult(100, percentage, Difficulty.EASY)
                .getPerformanceLevel();
    }
}
