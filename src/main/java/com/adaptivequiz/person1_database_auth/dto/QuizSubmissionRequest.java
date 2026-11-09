package com.adaptivequiz.person1_database_auth.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Payload submitted when a student completes a quiz attempt to be persisted.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class QuizSubmissionRequest {

    private List<AnswerSubmission> answers = new ArrayList<>();

    public QuizSubmissionRequest() {
    }

    public QuizSubmissionRequest(List<AnswerSubmission> answers) {
        this.answers = answers;
    }

    public List<AnswerSubmission> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerSubmission> answers) {
        this.answers = answers;
    }
}
