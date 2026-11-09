package com.adaptivequiz.person1_database_auth.auth;

/**
 * Incoming request payload for student authentication.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class LoginRequest {

    private String username;
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
