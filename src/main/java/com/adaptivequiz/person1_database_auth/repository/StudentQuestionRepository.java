package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person1_database_auth.model.StudentQuestionView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for student-safe question queries from `student_questions` view.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface StudentQuestionRepository extends JpaRepository<StudentQuestionView, Long> {

    List<StudentQuestionView> findByTopicId(Long topicId);

    List<StudentQuestionView> findByTopicIdAndDifficulty(Long topicId, Difficulty difficulty);
}
