package com.adaptivequiz.person3_scoring;

import com.adaptivequiz.person1_database_auth.model.Difficulty;

/**
 * Stateful difficulty tracker for one quiz session. Three consecutive correct
 * answers increase difficulty; two consecutive incorrect answers decrease it.
 */
public class AdaptiveDifficulty {

    private Difficulty difficulty;

    private int consecutiveCorrect = 0;
    private int consecutiveIncorrect = 0;

    public AdaptiveDifficulty() {
        this(Difficulty.EASY);
    }

    public AdaptiveDifficulty(Difficulty startingDifficulty) {
        this.difficulty = startingDifficulty == null ? Difficulty.EASY : startingDifficulty;
    }

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

        if (difficulty == Difficulty.EASY) {
            difficulty = Difficulty.MEDIUM;
        } else if (difficulty == Difficulty.MEDIUM) {
            difficulty = Difficulty.HARD;
        }
    }

    private void decreaseDifficulty() {

        if (difficulty == Difficulty.HARD) {
            difficulty = Difficulty.MEDIUM;
        } else if (difficulty == Difficulty.MEDIUM) {
            difficulty = Difficulty.EASY;
        }
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }
}
