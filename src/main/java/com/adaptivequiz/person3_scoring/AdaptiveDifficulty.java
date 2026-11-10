public class AdaptiveDifficulty {

    private String difficulty = "EASY";

    private int consecutiveCorrect = 0;
    private int consecutiveIncorrect = 0;

    public void processAnswer(boolean correct) {

        if (correct) {

            consecutiveCorrect++;
            consecutiveIncorrect = 0;

        } else {

            consecutiveIncorrect++;
            consecutiveCorrect = 0;
        }

        updateDifficulty();
    }

    private void updateDifficulty() {

        if (consecutiveCorrect >= 3) {

            increaseDifficulty();
            consecutiveCorrect = 0;

        } else if (consecutiveIncorrect >= 2) {

            decreaseDifficulty();
            consecutiveIncorrect = 0;
        }
    }

    private void increaseDifficulty() {

        if (difficulty.equals("EASY")) {

            difficulty = "MEDIUM";

        } else if (difficulty.equals("MEDIUM")) {

            difficulty = "HARD";
        }
    }

    private void decreaseDifficulty() {

        if (difficulty.equals("HARD")) {

            difficulty = "MEDIUM";

        } else if (difficulty.equals("MEDIUM")) {

            difficulty = "EASY";
        }
    }

    public String getDifficulty() {
        return difficulty;
    }
}