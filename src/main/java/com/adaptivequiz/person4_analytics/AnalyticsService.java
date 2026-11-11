package com.adaptivequiz.person4_analytics;

import com.adaptivequiz.person1_database_auth.auth.AuthService;
import com.adaptivequiz.person1_database_auth.dto.TopicPerformanceDto;
import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.service.TopicPerformanceTrackingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Web-facing bridge for Person 4's Strong/Average/Weak analysis rules. It uses
 * Person 1's persisted topic-performance data for the authenticated student.
 */
@Service
public class AnalyticsService {

    private final AuthService authService;
    private final TopicPerformanceTrackingService performanceTrackingService;

    public AnalyticsService(AuthService authService,
                            TopicPerformanceTrackingService performanceTrackingService) {
        this.authService = authService;
        this.performanceTrackingService = performanceTrackingService;
    }

    public Map<String, Object> currentUserAnalytics() {
        User user = authService.getCurrentAuthenticatedUser();
        List<TopicPerformanceDto> performance = performanceTrackingService.getPerformanceForUser(user.getId());

        int totalCorrect = 0;
        int totalQuestions = 0;
        TopicPerformanceDto weakest = null;
        List<Map<String, Object>> topics = performance.stream().map(item -> {
            Map<String, Object> topic = new LinkedHashMap<>();
            topic.put("topicId", item.getTopicId());
            topic.put("topicName", item.getTopicName());
            topic.put("subjectCode", item.getSubjectCode());
            topic.put("questionsAttempted", item.getQuestionsAttempted());
            topic.put("correctAnswers", item.getCorrectAnswers());
            topic.put("accuracy", item.getAccuracy());
            topic.put("level", level(item.getAccuracy()));
            topic.put("recommendation", recommendation(item.getTopicName(), item.getAccuracy()));
            return topic;
        }).toList();

        for (TopicPerformanceDto item : performance) {
            totalCorrect += item.getCorrectAnswers();
            totalQuestions += item.getQuestionsAttempted();
            if (weakest == null || item.getAccuracy().compareTo(weakest.getAccuracy()) < 0) {
                weakest = item;
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("userId", user.getId());
        response.put("totalTopics", performance.size());
        response.put("totalCorrectAnswers", totalCorrect);
        response.put("totalQuestions", totalQuestions);
        response.put("overallAccuracy", totalQuestions == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(totalCorrect * 100.0 / totalQuestions));
        response.put("weakestTopic", weakest == null ? null : weakest.getTopicName());
        response.put("topics", topics);
        return response;
    }

    private String level(BigDecimal accuracy) {
        if (accuracy.compareTo(new BigDecimal("80")) >= 0) return "Strong";
        if (accuracy.compareTo(new BigDecimal("50")) >= 0) return "Average";
        return "Weak";
    }

    private String recommendation(String topicName, BigDecimal accuracy) {
        String topic = topicName == null ? "this topic" : topicName;
        if (accuracy.compareTo(new BigDecimal("50")) < 0) return "Practice more questions on " + topic;
        if (accuracy.compareTo(new BigDecimal("80")) < 0) return "Revise and improve " + topic;
        return "Excellent! Try advanced questions on " + topic;
    }
}
