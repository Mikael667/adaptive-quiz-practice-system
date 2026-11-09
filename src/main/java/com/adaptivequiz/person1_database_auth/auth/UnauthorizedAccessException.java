package com.adaptivequiz.person1_database_auth.auth;

/**
 * Thrown when an authenticated student attempts to access records belonging to another student.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}
