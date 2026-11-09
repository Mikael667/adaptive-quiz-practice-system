package com.adaptivequiz.person1_database_auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Objects;

/**
 * Represents one of the approved GD Goenka university subjects mapped to `subjects`.
 *
 * @author Mikael Zinsou (Person 1: Database & Authentication)
 */
@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @Column(name = "code", length = 10, nullable = false)
    private String code;

    @Column(name = "full_name", length = 255, nullable = false)
    private String fullName;

    public Subject() {
    }

    public Subject(String code, String fullName) {
        this.code = code;
        this.fullName = fullName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Subject subject)) return false;
        return Objects.equals(code, subject.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    @Override
    public String toString() {
        return "Subject{" +
                "code='" + code + '\'' +
                ", fullName='" + fullName + '\'' +
                '}';
    }
}
