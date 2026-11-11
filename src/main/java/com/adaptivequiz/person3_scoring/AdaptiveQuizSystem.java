package com.adaptivequiz.person3_scoring;

import com.adaptivequiz.person1_database_auth.model.Difficulty;

/**
 * Manual console demonstration of the scoring rules. The Spring application
 * uses {@link ScoringService}; this class is not an application entry point.
 */
public class AdaptiveQuizSystem {

    public static void main(String[] args) {

        boolean[] answers = {
            true,
            true,
            true,
            false,
            false
        };
        ScoreCalculator scoreCalculator = new ScoreCalculator();

        AnswerChecker answerChecker = new AnswerChecker();

        String studentAnswer = "B";
        String correctAnswer = "B";

        boolean answerIsCorrect = answerChecker.checkAnswer(studentAnswer, correctAnswer);

        System.out.println("Answer Check: " + answerIsCorrect);
        System.out.println("--------------------");

        int correctAnswers = 0;

        AdaptiveDifficulty adaptiveDifficulty =
                new AdaptiveDifficulty();

        for (boolean answer : answers) {

            if (answer) {
                correctAnswers++;
                System.out.println("Correct!");
            } else {
                System.out.println("Incorrect!");
            }

            adaptiveDifficulty.processAnswer(answer);

            System.out.println(
                "Current difficulty: "
                + adaptiveDifficulty.getDifficulty()
            );

            System.out.println("--------------------");
        }

        int totalQuestions = answers.length;

        int incorrectAnswers =
                scoreCalculator.calculateIncorrectAnswers(
                    totalQuestions,
                    correctAnswers
                );

        double percentage =
                scoreCalculator.calculatePercentage(
                    totalQuestions,
                    correctAnswers
                );

        QuizResult quizResult = new QuizResult(
            totalQuestions,
            correctAnswers,
            incorrectAnswers,
            percentage,
            adaptiveDifficulty.getDifficulty()
        );

        System.out.println("=== QUIZ RESULT ===");
        System.out.println("Total Questions: " + quizResult.getTotalQuestions());
        System.out.println("Correct Answers: " + quizResult.getCorrectAnswers());
        System.out.println("Incorrect Answers: " + quizResult.getIncorrectAnswers());
        System.out.println("Percentage: " + quizResult.getPercentage() + "%");
        System.out.println(
        "Final Difficulty: " + quizResult.getFinalDifficulty());
        System.out.println(
        "Performance Level: " + quizResult.getPerformanceLevel());
    }   
}
