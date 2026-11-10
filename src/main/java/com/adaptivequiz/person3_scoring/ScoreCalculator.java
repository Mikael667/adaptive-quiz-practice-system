public class ScoreCalculator {

    public int calculateIncorrectAnswers(
            int totalQuestions,
            int correctAnswers) {

        return totalQuestions - correctAnswers;
    }

    public double calculatePercentage(
            int totalQuestions,
            int correctAnswers) {

        if (totalQuestions == 0) {
            return 0;
        }

        return ((double) correctAnswers / totalQuestions) * 100;
    }
}
