package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing student quiz attempts.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserIdOrderByStartedAtDesc(Long userId);

    Optional<QuizAttempt> findByIdAndUserId(Long id, Long userId);
}
