public class QuizResult {

    private int totalQuestions;
    private int correctAnswers;
    private int incorrectAnswers;
    private double percentage;
    private String finalDifficulty;

    public QuizResult(
            int totalQuestions,
            int correctAnswers,
            int incorrectAnswers,
            double percentage,
            String finalDifficulty) {

        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = incorrectAnswers;
        this.percentage = percentage;
        this.finalDifficulty = finalDifficulty;
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

    public String getFinalDifficulty() {
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