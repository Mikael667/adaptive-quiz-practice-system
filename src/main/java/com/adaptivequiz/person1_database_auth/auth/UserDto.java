package com.adaptivequiz.person1_database_auth.auth;

import com.adaptivequiz.person1_database_auth.model.User;

/**
 * Data Transfer Object representing public student profile information.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean enabled;

    public UserDto() {
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.enabled = user.isEnabled();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
