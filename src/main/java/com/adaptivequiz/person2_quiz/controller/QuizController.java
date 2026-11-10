package com.adaptivequiz.person2_quiz.controller;

import com.adaptivequiz.person1_database_auth.model.Topic;
import com.adaptivequiz.person1_database_auth.repository.TopicRepository;
import com.adaptivequiz.person2_quiz.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Every method below is one URL the website can call.
@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuizController {

    record StartRequest(Long topicId, int numberOfQuestions, Long studentId) { }
    record AnswerRequest(Long questionId, String selectedOption) { }

    private final QuizService quizService;
    private final TopicRepository topicRepository;

    public QuizController(QuizService quizService, TopicRepository topicRepository) {
        this.quizService = quizService;
        this.topicRepository = topicRepository;
    }

    @GetMapping("/topics")
    public List<Topic> topics() {
        return topicRepository.findAll();
    }

    @PostMapping("/quizzes")
    public Map<String, Object> start(@RequestBody StartRequest request) {
        return quizService.startQuiz(request.topicId(), request.numberOfQuestions(), request.studentId());
    }

    @GetMapping("/quizzes/{quizId}/next-question")
    public Map<String, Object> nextQuestion(@PathVariable Long quizId) {
        return quizService.nextQuestion(quizId);
    }

    @PostMapping("/quizzes/{quizId}/answers")
    public Map<String, Object> answer(@PathVariable Long quizId, @RequestBody AnswerRequest request) {
        return quizService.submitAnswer(quizId, request.questionId(), request.selectedOption());
    }

    @PostMapping("/quizzes/{quizId}/complete")
    public Map<String, Object> complete(@PathVariable Long quizId) {
        return quizService.complete(quizId);
    }
}