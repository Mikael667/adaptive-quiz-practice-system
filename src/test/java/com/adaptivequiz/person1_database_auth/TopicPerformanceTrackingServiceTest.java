package com.adaptivequiz.person1_database_auth;

import com.adaptivequiz.person1_database_auth.auth.AuthService;
import com.adaptivequiz.person1_database_auth.dto.TopicPerformanceDto;
import com.adaptivequiz.person1_database_auth.model.Subject;
import com.adaptivequiz.person1_database_auth.model.Topic;
import com.adaptivequiz.person1_database_auth.model.TopicPerformance;
import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.repository.TopicPerformanceRepository;
import com.adaptivequiz.person1_database_auth.service.TopicPerformanceTrackingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@ExtendWith(MockitoExtension.class)
public class TopicPerformanceTrackingServiceTest {

    @Mock
    private TopicPerformanceRepository performanceRepository;

    @Mock
    private AuthService authService;

    private TopicPerformanceTrackingService performanceService;

    private User student;
    private Topic topic1;
    private Topic topic2;

    @BeforeEach
    void setUp() {
        performanceService = new TopicPerformanceTrackingService(performanceRepository, authService);

        student = new User("student1", "student1@gdgoenka.ac.in", "hash", "ROLE_STUDENT");
        student.setId(10L);

        Subject javaSubject = new Subject("CSE2036", "Programming using Java");

        topic1 = new Topic(javaSubject, "Inheritance", "Classes and inheritance");
        topic1.setId(1L);

        topic2 = new Topic(javaSubject, "Polymorphism", "Overloading and overriding");
        topic2.setId(2L);
    }

    @Test
    @DisplayName("Fetch student topic performance aggregates")
    void testGetPerformanceForUser() {
        TopicPerformance tp1 = new TopicPerformance(student, topic1);
        tp1.recordResults(10, 8, Instant.now()); // 80.00%

        TopicPerformance tp2 = new TopicPerformance(student, topic2);
        tp2.recordResults(10, 4, Instant.now()); // 40.00%

        when(performanceRepository.findByUserId(10L)).thenReturn(List.of(tp1, tp2));

        List<TopicPerformanceDto> result = performanceService.getPerformanceForUser(10L);

        verify(authService).verifyUserAccess(10L);
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getAccuracy()).isEqualTo(new BigDecimal("80.00"));
        assertThat(result.get(1).getAccuracy()).isEqualTo(new BigDecimal("40.00"));
    }

    @Test
    @DisplayName("Identify weak topics below accuracy threshold for adaptive practice")
    void testGetWeakTopicsForUser() {
        TopicPerformance weakTopic = new TopicPerformance(student, topic2);
        weakTopic.recordResults(10, 3, Instant.now()); // 30.00%

        when(performanceRepository.findTopicsBelowAccuracyThreshold(10L, new BigDecimal("70.00")))
                .thenReturn(List.of(weakTopic));

        List<TopicPerformanceDto> weakTopics = performanceService.getWeakTopicsForUser(10L, new BigDecimal("70.00"));

        verify(authService).verifyUserAccess(10L);
        assertThat(weakTopics).hasSize(1);
        assertThat(weakTopics.get(0).getTopicName()).isEqualTo("Polymorphism");
        assertThat(weakTopics.get(0).getAccuracy()).isEqualTo(new BigDecimal("30.00"));
    }
}
