package com.adaptivequiz.person3_scoring;

import org.springframework.stereotype.Component;

/** Checks a submitted multiple-choice option against the stored answer key. */
@Component
public class AnswerChecker {

    public boolean checkAnswer(String studentAnswer, String correctAnswer) {
        if (studentAnswer == null || correctAnswer == null) {
            return false;
        }
        return studentAnswer.trim().equalsIgnoreCase(correctAnswer.trim());
    }
}
