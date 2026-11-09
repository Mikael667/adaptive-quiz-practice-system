package com.adaptivequiz.person1_database_auth.repository;

import com.adaptivequiz.person1_database_auth.model.TopicPerformance;
import com.adaptivequiz.person1_database_auth.model.TopicPerformanceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for cached aggregate topic performance records.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Repository
public interface TopicPerformanceRepository extends JpaRepository<TopicPerformance, TopicPerformanceId> {

    @Query("SELECT tp FROM TopicPerformance tp WHERE tp.id.userId = :userId")
    List<TopicPerformance> findByUserId(@Param("userId") Long userId);

    @Query("SELECT tp FROM TopicPerformance tp WHERE tp.id.userId = :userId AND tp.id.topicId = :topicId")
    Optional<TopicPerformance> findByUserIdAndTopicId(@Param("userId") Long userId, @Param("topicId") Long topicId);

    @Query("SELECT tp FROM TopicPerformance tp WHERE tp.id.userId = :userId ORDER BY tp.accuracy ASC")
    List<TopicPerformance> findWeakTopicsByUserId(@Param("userId") Long userId);

    @Query("SELECT tp FROM TopicPerformance tp WHERE tp.id.userId = :userId AND tp.accuracy < :threshold ORDER BY tp.accuracy ASC")
    List<TopicPerformance> findTopicsBelowAccuracyThreshold(@Param("userId") Long userId, @Param("threshold") BigDecimal threshold);
}
