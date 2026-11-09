package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing `Topic` entities.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findBySubjectCode(String subjectCode);

    List<Topic> findBySubjectCodeOrderByNameAsc(String subjectCode);

    Optional<Topic> findBySubjectCodeAndName(String subjectCode, String name);
}
