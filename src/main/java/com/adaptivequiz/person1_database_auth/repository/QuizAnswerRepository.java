package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for individual answers submitted per quiz attempt.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {

    List<QuizAnswer> findByAttemptId(Long attemptId);

    Optional<QuizAnswer> findByAttemptIdAndQuestionId(Long attemptId, Long questionId);
}
