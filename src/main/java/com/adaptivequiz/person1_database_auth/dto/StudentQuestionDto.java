package com.adaptivequiz.person1_database_auth.dto;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person1_database_auth.model.Question;
import com.adaptivequiz.person1_database_auth.model.StudentQuestionView;

/**
 * Student-safe Question Data Transfer Object.
 * Intentionally omits correct_option and explanation to prevent answer leakage
 * prior to quiz submission.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class StudentQuestionDto {

    private Long id;
    private Long topicId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Difficulty difficulty;

    public StudentQuestionDto() {
    }

    public StudentQuestionDto(Long id, Long topicId, String questionText,
                              String optionA, String optionB, String optionC,
                              String optionD, Difficulty difficulty) {
        this.id = id;
        this.topicId = topicId;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.difficulty = difficulty;
    }

    public static StudentQuestionDto fromEntity(StudentQuestionView view) {
        return new StudentQuestionDto(
                view.getId(),
                view.getTopicId(),
                view.getQuestionText(),
                view.getOptionA(),
                view.getOptionB(),
                view.getOptionC(),
                view.getOptionD(),
                view.getDifficulty()
        );
    }

    public static StudentQuestionDto fromQuestion(Question question) {
        return new StudentQuestionDto(
                question.getId(),
                question.getTopic() != null ? question.getTopic().getId() : null,
                question.getQuestionText(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD(),
                question.getDifficulty()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }
}
