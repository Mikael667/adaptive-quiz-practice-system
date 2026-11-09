package com.adaptivequiz.person1_database_auth;

import com.adaptivequiz.person1_database_auth.dto.StudentQuestionDto;
import com.adaptivequiz.person1_database_auth.model.Difficulty;
import com.adaptivequiz.person1_database_auth.model.Question;
import com.adaptivequiz.person1_database_auth.model.Subject;
import com.adaptivequiz.person1_database_auth.model.Topic;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class StudentQuestionDtoTest {

    @Test
    @DisplayName("Verify StudentQuestionDto omits answer key and explanation")
    void testDtoNeverLeaksSensitiveFields() {
        Subject subject = new Subject("CSE2036", "Programming using Java");
        Topic topic = new Topic(subject, "Polymorphism", "Method overloading and overriding");
        topic.setId(5L);

        Question question = new Question(
                topic,
                "Can static methods be overridden in Java?",
                "Yes", "No", "Only if protected", "Only if final",
                "B",
                "Static methods belong to class, not instance, so they are hidden, not overridden.",
                Difficulty.MEDIUM,
                "ai_generator_v2"
        );
        question.setId(42L);

        StudentQuestionDto dto = StudentQuestionDto.fromQuestion(question);

        assertThat(dto.getId()).isEqualTo(42L);
        assertThat(dto.getTopicId()).isEqualTo(5L);
        assertThat(dto.getQuestionText()).isEqualTo("Can static methods be overridden in Java?");
        assertThat(dto.getOptionA()).isEqualTo("Yes");
        assertThat(dto.getOptionB()).isEqualTo("No");
        assertThat(dto.getOptionC()).isEqualTo("Only if protected");
        assertThat(dto.getOptionD()).isEqualTo("Only if final");
        assertThat(dto.getDifficulty()).isEqualTo(Difficulty.MEDIUM);

        // Reflection check: ensure class definition has no correctOption or explanation fields
        List<String> fieldNames = Arrays.stream(StudentQuestionDto.class.getDeclaredFields())
                .map(Field::getName)
                .toList();

        assertThat(fieldNames).doesNotContain("correctOption", "explanation", "generationMetadata", "generationReference");
    }
}
