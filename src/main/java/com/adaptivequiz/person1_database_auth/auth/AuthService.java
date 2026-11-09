package com.adaptivequiz.person1_database_auth.auth;

import com.adaptivequiz.person1_database_auth.model.User;
import com.adaptivequiz.person1_database_auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.regex.Pattern;

/**
 * Service managing student registration, password hashing via BCrypt,
 * authentication, and session identity extraction.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registers a new student account.
     * Enforces validation, uniqueness, BCrypt hashing, and role assignment.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validateRegistrationInput(request);

        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username '" + username + "' is already registered.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email address '" + email + "' is already registered.");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User newUser = new User(username, email, passwordHash, "ROLE_STUDENT");
        User savedUser = userRepository.save(newUser);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "Student account registered successfully."
        );
    }

    /**
     * Authenticates a student using username/email and raw password.
     */
    public AuthResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username or email is required.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername().trim(),
                        request.getPassword()
                )
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Login successful."
        );
    }

    /**
     * Returns the currently authenticated student, or throws an exception if unauthenticated.
     */
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedAccessException("No authenticated session found.");
        }

        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getUser();
        }

        String principalName = authentication.getName();
        return userRepository.findByUsername(principalName)
                .or(() -> userRepository.findByEmail(principalName))
                .orElseThrow(() -> new UnauthorizedAccessException("Authenticated user not found in database."));
    }

    /**
     * Validates that the requested targetUserId belongs to the authenticated student,
     * preventing Horizontal Privilege Escalation / Insecure Direct Object Reference (IDOR).
     */
    public void verifyUserAccess(Long targetUserId) {
        User currentUser = getCurrentAuthenticatedUser();
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(currentUser.getRole());
        if (!isAdmin && !currentUser.getId().equals(targetUserId)) {
            throw new UnauthorizedAccessException("Access denied: You cannot view or modify data of another student.");
        }
    }

    private void validateRegistrationInput(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Registration request cannot be null.");
        }

        String username = request.getUsername();
        if (username == null || username.trim().length() < 3 || username.trim().length() > 50) {
            throw new IllegalArgumentException("Username must be between 3 and 50 characters.");
        }

        String email = request.getEmail();
        if (email == null || email.trim().length() > 254 || !EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("A valid email address is required (maximum 254 characters).");
        }

        String password = request.getPassword();
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
    }
}
