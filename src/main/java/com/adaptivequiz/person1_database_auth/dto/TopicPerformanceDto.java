package com.adaptivequiz.person1_database_auth.dto;

import com.adaptivequiz.person1_database_auth.model.TopicPerformance;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO representing aggregate topic performance metrics from `topic_performance`.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class TopicPerformanceDto {

    private Long topicId;
    private String topicName;
    private String subjectCode;
    private int questionsAttempted;
    private int correctAnswers;
    private BigDecimal accuracy;
    private Instant lastPracticedAt;

    public TopicPerformanceDto() {
    }

    public TopicPerformanceDto(Long topicId, String topicName, String subjectCode,
                               int questionsAttempted, int correctAnswers,
                               BigDecimal accuracy, Instant lastPracticedAt) {
        this.topicId = topicId;
        this.topicName = topicName;
        this.subjectCode = subjectCode;
        this.questionsAttempted = questionsAttempted;
        this.correctAnswers = correctAnswers;
        this.accuracy = accuracy;
        this.lastPracticedAt = lastPracticedAt;
    }

    public static TopicPerformanceDto fromEntity(TopicPerformance tp) {
        String name = tp.getTopic() != null ? tp.getTopic().getName() : null;
        String subject = (tp.getTopic() != null && tp.getTopic().getSubject() != null)
                ? tp.getTopic().getSubject().getCode()
                : null;

        return new TopicPerformanceDto(
                tp.getId() != null ? tp.getId().getTopicId() : null,
                name,
                subject,
                tp.getQuestionsAttempted(),
                tp.getCorrectAnswers(),
                tp.getAccuracy(),
                tp.getLastPracticedAt()
        );
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public int getQuestionsAttempted() {
        return questionsAttempted;
    }

    public void setQuestionsAttempted(int questionsAttempted) {
        this.questionsAttempted = questionsAttempted;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public BigDecimal getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(BigDecimal accuracy) {
        this.accuracy = accuracy;
    }

    public Instant getLastPracticedAt() {
        return lastPracticedAt;
    }

    public void setLastPracticedAt(Instant lastPracticedAt) {
        this.lastPracticedAt = lastPracticedAt;
    }
}
