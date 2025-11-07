package com.example.librarybackend.dto;

// This class represents the JSON body of a login request.
// It must have fields that match the keys in the JSON object sent from the frontend.
public class LoginRequest {
    private String email;
    private String password;

    // --- Getters and Setters ---
    // Spring needs these to map the incoming JSON to this object.
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}