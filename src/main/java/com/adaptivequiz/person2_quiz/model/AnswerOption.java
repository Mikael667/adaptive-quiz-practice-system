package com.adaptivequiz.person2_quiz.model;

import com.adaptivequiz.person1_database_auth.model.Question;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class AnswerOption {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private boolean correct;

    @ManyToOne
    private Question question;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    @JsonIgnore
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }

    @JsonIgnore
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
}
