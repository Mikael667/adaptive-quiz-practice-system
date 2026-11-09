package com.adaptivequiz.person1_database_auth.service;

import com.adaptivequiz.person1_database_auth.auth.AuthService;
import com.adaptivequiz.person1_database_auth.dto.TopicPerformanceDto;
import com.adaptivequiz.person1_database_auth.model.TopicPerformance;
import com.adaptivequiz.person1_database_auth.repository.TopicPerformanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service providing cached topic performance queries and weak-topic detection
 * directly from the `topic_performance` database table.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Service
@Transactional(readOnly = true)
public class TopicPerformanceTrackingService {

    public static final BigDecimal DEFAULT_WEAKNESS_THRESHOLD = new BigDecimal("70.00");

    private final TopicPerformanceRepository performanceRepository;
    private final AuthService authService;

    public TopicPerformanceTrackingService(TopicPerformanceRepository performanceRepository, AuthService authService) {
        this.performanceRepository = performanceRepository;
        this.authService = authService;
    }

    /**
     * Retrieves all cached topic performance summaries for a student.
     */
    public List<TopicPerformanceDto> getPerformanceForUser(Long userId) {
        authService.verifyUserAccess(userId);
        return performanceRepository.findByUserId(userId).stream()
                .map(TopicPerformanceDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Finds topics where accuracy is below the specified threshold (default 70%),
     * ordered by lowest accuracy first for adaptive question generation.
     */
    public List<TopicPerformanceDto> getWeakTopicsForUser(Long userId, BigDecimal threshold) {
        authService.verifyUserAccess(userId);
        BigDecimal effectiveThreshold = threshold != null ? threshold : DEFAULT_WEAKNESS_THRESHOLD;
        return performanceRepository.findTopicsBelowAccuracyThreshold(userId, effectiveThreshold).stream()
                .map(TopicPerformanceDto::fromEntity)
                .collect(Collectors.toList());
    }
}
