package com.adaptivequiz.person1_database_auth;

import com.adaptivequiz.person1_database_auth.auth.AuthResponse;
import com.adaptivequiz.person1_database_auth.auth.AuthService;
import com.adaptivequiz.person1_database_auth.auth.CustomUserDetails;
import com.adaptivequiz.person1_database_auth.auth.DuplicateResourceException;
import com.adaptivequiz.person1_database_auth.auth.LoginRequest;
import com.adaptivequiz.person1_database_auth.auth.RegisterRequest;
import com.adaptivequiz.person1_database_auth.auth.UnauthorizedAccessException;
import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager);
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Successfully register a new student with BCrypt hashed password")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("student1", "student1@gdgoenka.ac.in", "Password123!");

        when(userRepository.existsByUsername("student1")).thenReturn(false);
        when(userRepository.existsByEmail("student1@gdgoenka.ac.in")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(101L);
            return u;
        });

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(101L);
        assertThat(response.getUsername()).isEqualTo("student1");
        assertThat(response.getEmail()).isEqualTo("student1@gdgoenka.ac.in");
        assertThat(response.getRole()).isEqualTo("ROLE_STUDENT");

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Prevent registration if username is already taken")
    void testRegisterDuplicateUsername() {
        RegisterRequest request = new RegisterRequest("duplicateUser", "dup@test.com", "Password123!");
        when(userRepository.existsByUsername("duplicateUser")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Username 'duplicateUser' is already registered.");
    }

    @Test
    @DisplayName("Prevent registration if email is already taken")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("newUser", "taken@test.com", "Password123!");
        when(userRepository.existsByUsername("newUser")).thenReturn(false);
        when(userRepository.existsByEmail("taken@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email address 'taken@test.com' is already registered.");
    }

    @Test
    @DisplayName("Enforce password policy: reject passwords shorter than 8 characters")
    void testRegisterShortPassword() {
        RegisterRequest request = new RegisterRequest("student1", "student1@gdgoenka.ac.in", "short");

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Password must be at least 8 characters long.");
    }

    @Test
    @DisplayName("Authenticate user and return profile on valid login")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("student1", "Password123!");
        User user = new User("student1", "student1@gdgoenka.ac.in", passwordEncoder.encode("Password123!"), "ROLE_STUDENT");
        user.setId(50L);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);

        AuthResponse response = authService.login(request);

        assertThat(response.getId()).isEqualTo(50L);
        assertThat(response.getUsername()).isEqualTo("student1");
        assertThat(response.getRole()).isEqualTo("ROLE_STUDENT");
    }

    @Test
    @DisplayName("Reject login when authentication manager throws BadCredentialsException")
    void testLoginBadCredentials() {
        LoginRequest request = new LoginRequest("student1", "WrongPassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("Access control: prevent Horizontal Privilege Escalation (IDOR)")
    void testVerifyUserAccessPreventsCrossUserDataAccess() {
        User loggedInStudent = new User("student1", "student1@gdgoenka.ac.in", "hash", "ROLE_STUDENT");
        loggedInStudent.setId(10L);

        CustomUserDetails principal = new CustomUserDetails(loggedInStudent);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Accessing own data should succeed
        authService.verifyUserAccess(10L);

        // Accessing another student's data should throw UnauthorizedAccessException
        assertThatThrownBy(() -> authService.verifyUserAccess(999L))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("Access denied");
    }
}
