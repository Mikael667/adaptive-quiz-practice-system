package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person1_database_auth.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing complete `Question` entities.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTopicId(Long topicId);

    List<Question> findByTopicIdAndDifficulty(Long topicId, Difficulty difficulty);

    Optional<Question> findByGenerationReference(String generationReference);
}
