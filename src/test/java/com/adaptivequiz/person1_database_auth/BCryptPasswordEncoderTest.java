package com.adaptivequiz.person1_database_auth;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class BCryptPasswordEncoderTest {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    @DisplayName("BCrypt generates unique salted hashes for identical raw passwords")
    void testBCryptUniqueSalt() {
        String rawPassword = "SecureStudentPassword2026!";

        String hash1 = passwordEncoder.encode(rawPassword);
        String hash2 = passwordEncoder.encode(rawPassword);

        // Even for identical input, BCrypt hashes must differ due to random per-hash salting
        assertThat(hash1).isNotEqualTo(hash2);

        // But both hashes must successfully verify against the original password
        assertThat(passwordEncoder.matches(rawPassword, hash1)).isTrue();
        assertThat(passwordEncoder.matches(rawPassword, hash2)).isTrue();

        // Incorrect password must fail verification
        assertThat(passwordEncoder.matches("WrongPassword", hash1)).isFalse();
    }
}
