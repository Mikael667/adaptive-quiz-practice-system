package com.adaptivequiz;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.lang.reflect.Method;
import java.util.List;

/**
 * Self-contained test executor for Person 1 (Database & Authentication).
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class TestRunner {

    public static void main(String[] args) {
        List<Class<?>> testClasses = List.of(
                com.adaptivequiz.person1_database_auth.BCryptPasswordEncoderTest.class,
                com.adaptivequiz.person1_database_auth.CustomUserDetailsServiceTest.class,
                com.adaptivequiz.person1_database_auth.AuthServiceTest.class,
                com.adaptivequiz.person1_database_auth.QuizCompletionServiceTest.class,
                com.adaptivequiz.person1_database_auth.TopicPerformanceTrackingServiceTest.class,
                com.adaptivequiz.person1_database_auth.StudentQuestionDtoTest.class
        );

        int passed = 0;
        int failed = 0;

        System.out.println("=================================================");
        System.out.println("   PERSON 1 (MIKAEL) - DATABASE & AUTH TESTS     ");
        System.out.println("=================================================");

        for (Class<?> clazz : testClasses) {
            System.out.println("\nExecuting: " + clazz.getSimpleName());
            Method beforeEach = null;
            for (Method m : clazz.getDeclaredMethods()) {
                if (m.isAnnotationPresent(BeforeEach.class)) {
                    beforeEach = m;
                    break;
                }
            }

            for (Method method : clazz.getDeclaredMethods()) {
                if (method.isAnnotationPresent(Test.class)) {
                    try {
                        Object instance = clazz.getDeclaredConstructor().newInstance();
                        if (clazz.isAnnotationPresent(org.junit.jupiter.api.extension.ExtendWith.class)) {
                            org.mockito.MockitoAnnotations.openMocks(instance);
                        }
                        if (beforeEach != null) {
                            beforeEach.setAccessible(true);
                            beforeEach.invoke(instance);
                        }
                        method.setAccessible(true);
                        method.invoke(instance);
                        System.out.println("  [PASS] " + method.getName());
                        passed++;
                    } catch (Throwable t) {
                        Throwable cause = t.getCause() != null ? t.getCause() : t;
                        System.err.println("  [FAIL] " + method.getName() + " -> " + cause.getMessage());
                        cause.printStackTrace(System.err);
                        failed++;
                    }
                }
            }
        }

        System.out.println("\n-------------------------------------------------");
        System.out.printf("Test Results: %d passed, %d failed%n", passed, failed);
        System.out.println("-------------------------------------------------");

        if (failed > 0) {
            System.exit(1);
        }
    }
}
