package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing `Subject` entities.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {

    Optional<Subject> findByCode(String code);

    List<Subject> findAllByOrderByCodeAsc();
}
