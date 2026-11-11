package com.adaptivequiz.person2_quiz.service;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person3_scoring.AnswerChecker;
import com.adaptivequiz.person3_scoring.ScoreCalculator;
import com.adaptivequiz.person3_scoring.ScoringService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AdaptiveLogicTest {

    private final AdaptiveLogic adaptiveLogic = new AdaptiveLogic(
            new ScoringService(new AnswerChecker(), new ScoreCalculator())
    );

    @Test
    void usesPersonThreeRulesForDifficultyAndResults() {
        assertEquals(Difficulty.MEDIUM, adaptiveLogic.nextDifficulty(Difficulty.EASY, 3, 0));
        assertEquals(Difficulty.MEDIUM, adaptiveLogic.nextDifficulty(Difficulty.HARD, 0, 2));
        assertEquals(75, adaptiveLogic.percentage(3, 4));
        assertEquals("Good", adaptiveLogic.performanceLevel(75));
    }
}
