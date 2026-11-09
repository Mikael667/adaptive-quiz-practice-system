package com.adaptivequiz.person1_database_auth;

import com.adaptivequiz.person1_database_auth.auth.CustomUserDetailsService;
import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    private CustomUserDetailsService userDetailsService;

    @BeforeEach
    void setUp() {
        userDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    @DisplayName("Load user by username successfully")
    void testLoadUserByUsername() {
        User user = new User("mikael", "mikael@gdgoenka.ac.in", "$2a$10$hashedPassword", "ROLE_STUDENT");
        user.setId(1L);

        when(userRepository.findByUsername("mikael")).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername("mikael");

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("mikael");
        assertThat(userDetails.getPassword()).isEqualTo("$2a$10$hashedPassword");
        assertThat(userDetails.getAuthorities()).extracting("authority").containsExactly("ROLE_STUDENT");
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    @DisplayName("Load user by email when username search yields empty")
    void testLoadUserByEmail() {
        User user = new User("mikael", "mikael@gdgoenka.ac.in", "$2a$10$hashedPassword", "ROLE_STUDENT");
        user.setId(1L);

        when(userRepository.findByUsername("mikael@gdgoenka.ac.in")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("mikael@gdgoenka.ac.in")).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername("mikael@gdgoenka.ac.in");

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("mikael");
    }

    @Test
    @DisplayName("Throw UsernameNotFoundException when user is not in database")
    void testUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("unknown"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found with username or email: unknown");
    }
}
