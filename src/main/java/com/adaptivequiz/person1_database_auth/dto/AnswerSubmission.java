package com.adaptivequiz.person1_database_auth.dto;

/**
 * Individual question answer submitted by a student for database recording.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class AnswerSubmission {

    private Long questionId;
    private String selectedOption; // "A", "B", "C", or "D" (or null if unanswered)

    public AnswerSubmission() {
    }

    public AnswerSubmission(Long questionId, String selectedOption) {
        this.questionId = questionId;
        this.selectedOption = selectedOption;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
