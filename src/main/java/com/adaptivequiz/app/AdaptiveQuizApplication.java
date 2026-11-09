package com.adaptivequiz.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main application entry point for the Adaptive Quiz and Practice System.
 */
@SpringBootApplication(scanBasePackages = "com.adaptivequiz")
@EnableJpaRepositories(basePackages = "com.adaptivequiz.person1_database_auth.repository")
public class AdaptiveQuizApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdaptiveQuizApplication.class, args);
    }
}