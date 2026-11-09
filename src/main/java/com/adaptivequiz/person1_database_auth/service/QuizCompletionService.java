package com.adaptivequiz.person1_database_auth.service;

import com.adaptivequiz.person1_database_auth.auth.AuthService;
import com.adaptivequiz.person1_database_auth.dto.AnswerSubmission;
import com.adaptivequiz.person1_database_auth.dto.QuestionResultDto;
import com.adaptivequiz.person1_database_auth.dto.QuizResultResponse;
import com.adaptivequiz.person1_database_auth.dto.QuizSubmissionRequest;
import com.adaptivequiz.person1_database_auth.dto.TopicPerformanceDto;
import com.adaptivequiz.person1_database_auth.model.Question;
import com.adaptivequiz.person1_database_auth.model.QuizAnswer;
import com.adaptivequiz.person1_database_auth.model.QuizAttempt;
import com.adaptivequiz.person1_database_auth.model.Topic;
import com.adaptivequiz.person1_database_auth.model.TopicPerformance;
import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.repository.QuestionRepository;
import com.adaptivequiz.person1_database_auth.repository.QuizAnswerRepository;
import com.adaptivequiz.person1_database_auth.repository.QuizAttemptRepository;
import com.adaptivequiz.person1_database_auth.repository.TopicPerformanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Transactional service managing database persistence of quiz attempts,
 * question answer records, and cached topic performance aggregates.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Service
public class QuizCompletionService {

    private final QuizAttemptRepository attemptRepository;
    private final QuizAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final TopicPerformanceRepository performanceRepository;
    private final AuthService authService;

    public QuizCompletionService(QuizAttemptRepository attemptRepository,
                                 QuizAnswerRepository answerRepository,
                                 QuestionRepository questionRepository,
                                 TopicPerformanceRepository performanceRepository,
                                 AuthService authService) {
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.performanceRepository = performanceRepository;
        this.authService = authService;
    }

    /**
     * Completes a quiz attempt within a single atomic database transaction.
     * Evaluates answers, records attempt score, and updates topic aggregates.
     */
    @Transactional
    public QuizResultResponse completeAttempt(Long attemptId, QuizSubmissionRequest submission) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz attempt not found with ID: " + attemptId));

        User user = attempt.getUser();
        authService.verifyUserAccess(user.getId());

        if (attempt.getCompletedAt() != null) {
            throw new IllegalStateException("Quiz attempt " + attemptId + " has already been completed.");
        }

        Instant completionTime = Instant.now();
        List<AnswerSubmission> submissions = submission != null && submission.getAnswers() != null
                ? submission.getAnswers()
                : List.of();

        int totalQuestions = submissions.size();
        int correctCount = 0;

        List<QuestionResultDto> resultDetails = new ArrayList<>();
        Map<Topic, int[]> topicStats = new HashMap<>(); // [attempted, correct]

        for (AnswerSubmission sub : submissions) {
            Question question = questionRepository.findById(sub.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + sub.getQuestionId()));

            String rawOption = sub.getSelectedOption();
            String normalizedOption = (rawOption != null && !rawOption.isBlank())
                    ? rawOption.trim().toUpperCase()
                    : null;

            if (normalizedOption != null && !normalizedOption.matches("^[ABCD]$")) {
                throw new IllegalArgumentException("Selected option must be 'A', 'B', 'C', 'D', or null.");
            }

            boolean isCorrect = normalizedOption != null && normalizedOption.equals(question.getCorrectOption());
            if (isCorrect) {
                correctCount++;
            }

            // Persist quiz_answer record
            QuizAnswer answer = answerRepository.findByAttemptIdAndQuestionId(attempt.getId(), question.getId())
                    .orElseGet(() -> new QuizAnswer(attempt, question, normalizedOption, isCorrect));
            answer.setSelectedOption(normalizedOption);
            answer.setCorrect(isCorrect);
            answer.setAnsweredAt(completionTime);
            answerRepository.save(answer);

            // Accumulate topic-level stats for aggregation
            Topic topic = question.getTopic();
            if (topic != null) {
                int[] stats = topicStats.computeIfAbsent(topic, t -> new int[2]);
                stats[0]++; // attempted
                if (isCorrect) {
                    stats[1]++; // correct
                }
            }

            resultDetails.add(new QuestionResultDto(
                    question.getId(),
                    question.getQuestionText(),
                    normalizedOption,
                    question.getCorrectOption(),
                    isCorrect,
                    question.getExplanation()
            ));
        }

        // Update quiz_attempts summary
        BigDecimal score = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (totalQuestions > 0) {
            double rawScore = ((double) correctCount / totalQuestions) * 100.0;
            score = BigDecimal.valueOf(rawScore).setScale(2, RoundingMode.HALF_UP);
        }

        attempt.setTotalQuestions(totalQuestions);
        attempt.setCorrectAnswers(correctCount);
        attempt.setScore(score);
        attempt.setCompletedAt(completionTime);
        attemptRepository.save(attempt);

        // Update topic_performance aggregates atomically
        List<TopicPerformanceDto> updatedPerformanceList = new ArrayList<>();
        for (Map.Entry<Topic, int[]> entry : topicStats.entrySet()) {
            Topic topic = entry.getKey();
            int attemptedForTopic = entry.getValue()[0];
            int correctForTopic = entry.getValue()[1];

            TopicPerformance performance = performanceRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                    .orElseGet(() -> new TopicPerformance(user, topic));

            performance.recordResults(attemptedForTopic, correctForTopic, completionTime);
            TopicPerformance saved = performanceRepository.save(performance);
            updatedPerformanceList.add(TopicPerformanceDto.fromEntity(saved));
        }

        return new QuizResultResponse(
                attempt.getId(),
                user.getId(),
                attempt.getStartedAt(),
                attempt.getCompletedAt(),
                totalQuestions,
                correctCount,
                score,
                resultDetails,
                updatedPerformanceList
        );
    }
}
