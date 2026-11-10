public class AnswerChecker {

    public boolean checkAnswer(String studentAnswer, String correctAnswer) {

        return studentAnswer.equalsIgnoreCase(correctAnswer);
    }
}