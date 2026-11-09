package com.adaptivequiz.person1_database_auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Objects;

/**
 * Tracks aggregated student performance per topic in `topic_performance`.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Entity
@Table(name = "topic_performance")
public class TopicPerformance {

    @EmbeddedId
    private TopicPerformanceId id = new TopicPerformanceId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("topicId")
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "questions_attempted", nullable = false)
    private int questionsAttempted = 0;

    @Column(name = "correct_answers", nullable = false)
    private int correctAnswers = 0;

    @Column(name = "accuracy", nullable = false, precision = 5, scale = 2)
    private BigDecimal accuracy = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

    @Column(name = "last_practiced_at")
    private Instant lastPracticedAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private Instant updatedAt;

    public TopicPerformance() {
    }

    public TopicPerformance(User user, Topic topic) {
        this.user = user;
        this.topic = topic;
        this.id = new TopicPerformanceId(user.getId(), topic.getId());
        this.questionsAttempted = 0;
        this.correctAnswers = 0;
        this.accuracy = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Updates statistics by adding newly attempted questions and recalculating accuracy.
     */
    public void recordResults(int newlyAttempted, int newlyCorrect, Instant practicedAt) {
        this.questionsAttempted += newlyAttempted;
        this.correctAnswers += newlyCorrect;
        if (this.questionsAttempted > 0) {
            double acc = ((double) this.correctAnswers / this.questionsAttempted) * 100.0;
            this.accuracy = BigDecimal.valueOf(acc).setScale(2, RoundingMode.HALF_UP);
        } else {
            this.accuracy = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        this.lastPracticedAt = practicedAt;
    }

    public TopicPerformanceId getId() {
        return id;
    }

    public void setId(TopicPerformanceId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null && id != null) {
            id.setUserId(user.getId());
        }
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
        if (topic != null && id != null) {
            id.setTopicId(topic.getId());
        }
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TopicPerformance that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
