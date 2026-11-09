package com.adaptivequiz.person1_database_auth;

import com.adaptivequiz.person1_database_auth.auth.AuthService;
import com.adaptivequiz.person1_database_auth.dto.AnswerSubmission;
import com.adaptivequiz.person1_database_auth.dto.QuizResultResponse;
import com.adaptivequiz.person1_database_auth.dto.QuizSubmissionRequest;
import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person1_database_auth.model.Question;
import com.adaptivequiz.person1_database_auth.model.QuizAnswer;
import com.adaptivequiz.person1_database_auth.model.QuizAttempt;
import com.adaptivequiz.person1_database_auth.model.Subject;
import com.adaptivequiz.person1_database_auth.model.Topic;
import com.adaptivequiz.person1_database_auth.model.TopicPerformance;
import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.repository.QuestionRepository;
import com.adaptivequiz.person1_database_auth.repository.QuizAnswerRepository;
import com.adaptivequiz.person1_database_auth.repository.QuizAttemptRepository;
import com.adaptivequiz.person1_database_auth.repository.TopicPerformanceRepository;
import com.adaptivequiz.person1_database_auth.service.QuizCompletionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@ExtendWith(MockitoExtension.class)
public class QuizCompletionServiceTest {

    @Mock
    private QuizAttemptRepository attemptRepository;

    @Mock
    private QuizAnswerRepository answerRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private TopicPerformanceRepository performanceRepository;

    @Mock
    private AuthService authService;

    private QuizCompletionService completionService;

    private User student;
    private Subject javaSubject;
    private Topic inheritanceTopic;
    private QuizAttempt attempt;
    private Question q1;
    private Question q2;

    @BeforeEach
    void setUp() {
        completionService = new QuizCompletionService(
                attemptRepository,
                answerRepository,
                questionRepository,
                performanceRepository,
                authService
        );

        student = new User("student1", "student1@gdgoenka.ac.in", "hash", "ROLE_STUDENT");
        student.setId(10L);

        javaSubject = new Subject("CSE2036", "Programming using Java");
        inheritanceTopic = new Topic(javaSubject, "Inheritance", "Object-oriented inheritance");
        inheritanceTopic.setId(1L);

        attempt = new QuizAttempt(student);
        attempt.setId(100L);

        q1 = new Question(inheritanceTopic, "Which keyword is used for inheritance in Java?",
                "super", "extends", "this", "implements", "B",
                "extends is used to inherit a class in Java.", Difficulty.EASY, "generator_v1");
        q1.setId(1L);

        q2 = new Question(inheritanceTopic, "Does Java support multiple inheritance through classes?",
                "Yes", "No", "Only in Java 21", "Depends on compiler", "B",
                "Java does not support multiple class inheritance.", Difficulty.MEDIUM, "generator_v1");
        q2.setId(2L);
    }

    @Test
    @DisplayName("Transactionally grade attempt and update topic performance")
    void testCompleteAttemptSuccess() {
        when(attemptRepository.findById(100L)).thenReturn(Optional.of(attempt));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(q1));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(q2));
        when(answerRepository.findByAttemptIdAndQuestionId(any(), any())).thenReturn(Optional.empty());
        when(performanceRepository.findByUserIdAndTopicId(10L, 1L)).thenReturn(Optional.empty());
        when(performanceRepository.save(any(TopicPerformance.class))).thenAnswer(inv -> inv.getArgument(0));

        QuizSubmissionRequest request = new QuizSubmissionRequest(List.of(
                new AnswerSubmission(1L, "B"),
                new AnswerSubmission(2L, "A")
        ));

        QuizResultResponse result = completionService.completeAttempt(100L, request);

        assertThat(result.getAttemptId()).isEqualTo(100L);
        assertThat(result.getTotalQuestions()).isEqualTo(2);
        assertThat(result.getCorrectAnswers()).isEqualTo(1);
        assertThat(result.getScore()).isEqualTo(new BigDecimal("50.00"));
        assertThat(result.getCompletedAt()).isNotNull();

        verify(answerRepository, org.mockito.Mockito.times(2)).save(any(QuizAnswer.class));
        verify(attemptRepository).save(attempt);
        verify(performanceRepository).save(any(TopicPerformance.class));

        assertThat(result.getUpdatedPerformance()).hasSize(1);
        assertThat(result.getUpdatedPerformance().get(0).getQuestionsAttempted()).isEqualTo(2);
        assertThat(result.getUpdatedPerformance().get(0).getCorrectAnswers()).isEqualTo(1);
        assertThat(result.getUpdatedPerformance().get(0).getAccuracy()).isEqualTo(new BigDecimal("50.00"));
    }

    @Test
    @DisplayName("Prevent double submission of an already completed attempt")
    void testPreventDoubleSubmission() {
        attempt.setCompletedAt(java.time.Instant.now());
        when(attemptRepository.findById(100L)).thenReturn(Optional.of(attempt));

        QuizSubmissionRequest request = new QuizSubmissionRequest(List.of());

        assertThatThrownBy(() -> completionService.completeAttempt(100L, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("has already been completed");
    }
}
