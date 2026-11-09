package com.adaptivequiz.person1_database_auth.auth;

/**
 * Thrown when attempting to register with an existing username or email.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
