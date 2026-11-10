package com.adaptivequiz.person2_quiz.service;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person1_database_auth.model.Question;
import com.adaptivequiz.person1_database_auth.repository.QuestionRepository;
import com.adaptivequiz.person1_database_auth.repository.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Transactional
public class QuizService {

    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final AdaptiveLogic adaptiveLogic;

    private final Map<Long, QuizSession> sessions = new ConcurrentHashMap<>();
    private final AtomicLong nextQuizId = new AtomicLong(1);
    private final Random random = new Random();

    public QuizService(TopicRepository topicRepository, QuestionRepository questionRepository,
                       AdaptiveLogic adaptiveLogic) {
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
        this.adaptiveLogic = adaptiveLogic;
    }

    public Map<String, Object> startQuiz(Long topicId, int numberOfQuestions, Long studentId) {
        if (topicId == null || numberOfQuestions < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "topicId and numberOfQuestions (1 or more) are required");
        }
        topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        int available = questionRepository.findByTopicId(topicId).size();
        if (available == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This topic has no questions yet");
        }

        int total = Math.min(numberOfQuestions, available);
        Long quizId = nextQuizId.getAndIncrement();
        sessions.put(quizId, new QuizSession(topicId, studentId, total));

        Map<String, Object> result = new HashMap<>();
        result.put("quizId", quizId);
        result.put("totalQuestions", total);
        return result;
    }

    // Returns the question WITHOUT the correct answer or explanation.
    public Map<String, Object> nextQuestion(Long quizId) {
        QuizSession session = findOpenSession(quizId);

        if (session.answeredCount() >= session.totalQuestions) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All questions answered. Call /complete");
        }

        List<Question> candidates = new ArrayList<>();
        for (Question q : questionRepository.findByTopicIdAndDifficulty(session.topicId, session.currentDifficulty)) {
            if (!session.answeredQuestionIds.contains(q.getId())) {
                candidates.add(q);
            }
        }
        if (candidates.isEmpty()) {
            for (Question q : questionRepository.findByTopicId(session.topicId)) {
                if (!session.answeredQuestionIds.contains(q.getId())) {
                    candidates.add(q);
                }
            }
        }
        if (candidates.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No more questions available");
        }

        Question q = candidates.get(random.nextInt(candidates.size()));

        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", q.getId());
        view.put("questionText", q.getQuestionText());
        view.put("optionA", q.getOptionA());
        view.put("optionB", q.getOptionB());
        view.put("optionC", q.getOptionC());
        view.put("optionD", q.getOptionD());
        view.put("difficulty", q.getDifficulty().name());
        return view;
    }

    public Map<String, Object> submitAnswer(Long quizId, Long questionId, String selectedOption) {
        QuizSession session = findOpenSession(quizId);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        if (!question.getTopic().getId().equals(session.topicId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question is not part of this quiz");
        }
        if (session.answeredQuestionIds.contains(questionId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question already answered");
        }

        String selected = selectedOption == null ? null : selectedOption.trim().toUpperCase();
        if (selected == null || !List.of("A", "B", "C", "D").contains(selected)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "selectedOption must be A, B, C or D");
        }
        boolean isCorrect = selected.equals(question.getCorrectOption());

        session.answeredQuestionIds.add(questionId);
        if (isCorrect) {
            session.correctCount++;
            session.correctInRow++;
            session.wrongInRow = 0;
        } else {
            session.wrongInRow++;
            session.correctInRow = 0;
        }

        Difficulty newDifficulty = adaptiveLogic.nextDifficulty(
                session.currentDifficulty, session.correctInRow, session.wrongInRow);
        if (session.correctInRow >= 3 || session.wrongInRow >= 2) {
            session.correctInRow = 0;
            session.wrongInRow = 0;
        }
        session.currentDifficulty = newDifficulty;

        Map<String, Object> result = new HashMap<>();
        result.put("correct", isCorrect);
        result.put("correctOption", question.getCorrectOption());
        result.put("explanation", question.getExplanation());
        result.put("nextDifficulty", newDifficulty.name());
        result.put("allQuestionsAnswered", session.answeredCount() >= session.totalQuestions);
        return result;
    }

    
    public Map<String, Object> complete(Long quizId) {

        QuizSession session = sessions.get(quizId);

        if (session == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Quiz not found"
            );
        }

        if (session.completed) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Quiz already completed"
            );
        }

        session.completed = true;

        int answered = session.answeredCount();
        int incorrect = answered - session.correctCount;

        int percentage = adaptiveLogic.percentage(
            session.correctCount, answered
        );

        Map<String, Object> result = new HashMap<>();

        result.put("quizId", quizId);
        result.put("answered", answered);
        result.put("correct", session.correctCount);
        result.put("incorrect", incorrect);
        result.put("percentage", percentage);
        result.put("finalDifficulty", session.currentDifficulty.name());
        result.put("performanceLevel",
            adaptiveLogic.performanceLevel(percentage));

        return result;
    }


    private QuizSession findOpenSession(Long quizId) {
        QuizSession session = sessions.get(quizId);
        if (session == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found");
        }
        if (session.completed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This quiz is already completed");
        }
        return session;
    }
}