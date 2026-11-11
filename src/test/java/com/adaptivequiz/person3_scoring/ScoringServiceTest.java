package com.adaptivequiz.person3_scoring;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ScoringServiceTest {

    private final ScoringService scoringService = new ScoringService(new AnswerChecker(), new ScoreCalculator());

    @Test
    void checksAnswersWithoutCaseOrWhitespaceSensitivity() {
        assertTrue(scoringService.isCorrect(" b ", "B"));
        assertFalse(scoringService.isCorrect(null, "B"));
    }

    @Test
    void calculatesAValidatedQuizResult() {
        QuizResult result = scoringService.createResult(5, 4, Difficulty.MEDIUM);

        assertEquals(1, result.getIncorrectAnswers());
        assertEquals(80.0, result.getPercentage());
        assertEquals("Excellent", result.getPerformanceLevel());
        assertEquals(Difficulty.MEDIUM, result.getFinalDifficulty());
    }

    @Test
    void rejectsInvalidScoreCounts() {
        assertThrows(IllegalArgumentException.class, () -> scoringService.createResult(3, 4, Difficulty.EASY));
        assertThrows(IllegalArgumentException.class, () -> scoringService.createResult(-1, 0, Difficulty.EASY));
    }

    @Test
    void adaptsDifficultyWithinAllowedBounds() {
        AdaptiveDifficulty tracker = scoringService.newDifficultyTracker(Difficulty.EASY);
        tracker.processAnswer(true);
        tracker.processAnswer(true);
        tracker.processAnswer(true);
        assertEquals(Difficulty.MEDIUM, tracker.getDifficulty());

        tracker.processAnswer(true);
        tracker.processAnswer(true);
        tracker.processAnswer(true);
        assertEquals(Difficulty.HARD, tracker.getDifficulty());

        tracker.processAnswer(false);
        tracker.processAnswer(false);
        assertEquals(Difficulty.MEDIUM, tracker.getDifficulty());
    }
}
