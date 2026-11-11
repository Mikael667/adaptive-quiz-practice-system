package com.adaptivequiz.person3_scoring;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import org.springframework.stereotype.Service;

/**
 * Spring-facing contract for Person 3's scoring module. Quiz orchestration
 * services can use it to evaluate answer keys, calculate a result, and create
 * a per-attempt adaptive difficulty tracker.
 */
@Service
public class ScoringService {

    private final AnswerChecker answerChecker;
    private final ScoreCalculator scoreCalculator;

    public ScoringService(AnswerChecker answerChecker, ScoreCalculator scoreCalculator) {
        this.answerChecker = answerChecker;
        this.scoreCalculator = scoreCalculator;
    }

    public boolean isCorrect(String submittedAnswer, String correctAnswer) {
        return answerChecker.checkAnswer(submittedAnswer, correctAnswer);
    }

    public QuizResult createResult(int totalQuestions, int correctAnswers, Difficulty finalDifficulty) {
        int incorrectAnswers = scoreCalculator.calculateIncorrectAnswers(totalQuestions, correctAnswers);
        double percentage = scoreCalculator.calculatePercentage(totalQuestions, correctAnswers);
        return new QuizResult(totalQuestions, correctAnswers, incorrectAnswers, percentage, finalDifficulty);
    }

    public AdaptiveDifficulty newDifficultyTracker(Difficulty startingDifficulty) {
        return new AdaptiveDifficulty(startingDifficulty);
    }
}
