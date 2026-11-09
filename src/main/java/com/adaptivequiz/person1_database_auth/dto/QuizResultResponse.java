package com.adaptivequiz.person1_database_auth.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Full quiz results returned upon successful transactional database persistence.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class QuizResultResponse {

    private Long attemptId;
    private Long userId;
    private Instant startedAt;
    private Instant completedAt;
    private int totalQuestions;
    private int correctAnswers;
    private BigDecimal score;
    private List<QuestionResultDto> questionResults = new ArrayList<>();
    private List<TopicPerformanceDto> updatedPerformance = new ArrayList<>();

    public QuizResultResponse() {
    }

    public QuizResultResponse(Long attemptId, Long userId, Instant startedAt,
                              Instant completedAt, int totalQuestions,
                              int correctAnswers, BigDecimal score,
                              List<QuestionResultDto> questionResults,
                              List<TopicPerformanceDto> updatedPerformance) {
        this.attemptId = attemptId;
        this.userId = userId;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.score = score;
        this.questionResults = questionResults;
        this.updatedPerformance = updatedPerformance;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public List<QuestionResultDto> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(List<QuestionResultDto> questionResults) {
        this.questionResults = questionResults;
    }

    public List<TopicPerformanceDto> getUpdatedPerformance() {
        return updatedPerformance;
    }

    public void setUpdatedPerformance(List<TopicPerformanceDto> updatedPerformance) {
        this.updatedPerformance = updatedPerformance;
    }
}
